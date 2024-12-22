const CarModel = require("../models/CarModel");
const SlotModel = require("../models/SlotModel");
const stripe = require("../components/payment");

const preRegister = async (req, res) => {
  // since this is a random registeration at any time,
  // we need to make sure that he will not stay longer than
  // the next check-in reserved car in any slot

  // this function send to the user until what time he can stay,
  // so that he know when to leave

  // get all slots
  const slotsData = await SlotModel.find({}); // returns array of all data in db
  // check if any is currently available
  let Loop = false;
  for (const slot of slotsData) {
    if (Loop) {
      if (slot.isAvailable) {
        // if clock is busy, break and return the time to the user
        for (let i = 0; i < slot.clock.length; i++) {
          if (!slot.clock[i].isAvailable) {
            res.status(201).json({
              message: `You can only park before ${slot.clock[i].time} today, if it is okay for you, press reserve`,
            });
            Loop = false;
            break;
          }
        }
        // check for the next days that are booked and return it to the user
        res.status(201).json({
          message: `You can only park before this date: ${slot.bookedDays[0].startDate} , if it is okay for you, press reserve`,
        });
      } else {
        break;
      }
    }
  }
};
const register = async (req, res) => {
  if (!req.body.PlateNumber) {
    res.status(400).json({ message: "plate number is required" });
  }
  const carPlate = req.body.PlateNumber;

  //If there is no space inside,dont register a new car
  if (!(await SlotModel.availableSpace())) {
    return res
      .status(500)
      .json({ message: "Garage is full!! cannot register." });
  }

  try {
    const data = await CarModel.register(carPlate);
    res.status(200).json({
      message: "Qr code and plate were saved to the db.",
      QrCodeGenerated: data.qrCode,
    });
  } catch (err) {
    res.status(400).json();
  }
};

const reserveByDay = async (req, res) => {
  //making sure the user does not submit empty inputs
  if (!req.body.startDate || !req.body.endDate) {
    return res.status(400).json({ message: "Dates are missing!" });
  }

  if (!req.body.slotNumber) {
    return res.status(400).json({ message: "slot number is missing!" });
  }

  //geting the data
  const { startDate, endDate, slotNumber } = req.body;

  // reserve checks availability by days
  const newBooking = await SlotModel.reserve(
    startDate,
    endDate,
    slotNumber,
    "reserveByDay"
  );

  if (newBooking === true) {
    res.status(200).json({ message: "Saved to db" });
    // we need to keep tracking of the dates in case someOne did not leave
  } else {
    res.status(400).json({ message: `Failed to save to db, ${newBooking} ` });
  }
};

// after a user chooses a date, this returns the available slots if any
const checkReservationAvailability = async (req, res) => {
  if (!req.body.startDate || !req.body.endDate) {
    return res.status(400).json({ message: "Dates are missing" });
  }
  const { startDate, endDate } = req.body;

  const allSlots = await SlotModel.getSlotsSchedule();
  const slots = await SlotModel.checkAvailability(
    allSlots,
    startDate,
    endDate,
    "allSlots"
  );

  res.status(200).json(slots);
};

const checkIn = async (req, res) => {
  try {
    if (!req.body.QrCode) {
      res.status(400).json({ message: "QR code is required" });
      res.end();
    }
    const qQrCode = req.body.QrCode;

    // Check if the QR code exists in the database
    const codeExist = await CarModel.findOne({ qrCode: qQrCode });
    if (!codeExist) {
      return res.status(400).json({ message: "Code is not valid" });
    }

    // Check if the car is already checked in
    if (codeExist.checkInTime !== null) {
      console.log("dick1");
      return res.status(400).json({ message: "Car is already checked in" });
    }

    // Check if the garage has available space
    if (!(await SlotModel.availableSpace())) {
      return res.status(201).json({ message: "Garage is full" });
    }

    // Park the car
    const park = await SlotModel.parkCar();
    if (park === 0) {
      console.log("dick2");
      return res.status(400).json({ message: "Car is already checked in" });
    }

    // Update the car's check-in status and slot
    await CarModel.findOneAndUpdate(
      { qrCode: qQrCode },
      { checkInTime: Date.now(), slot: park } //Date.now()
    );

    // slot whole day in hours will be marked as reserved
    await SlotModel.findOneAndUpdate(
      { number: park },
      { isAvailable: false, allHoursBusy: true }
    );

    // Send success message

    return res.status(200).json({ message: "Car successfully checked in" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to check in" });
  }
};

const reservedCheckIn = async (req, res) => {};

const scanCheckIn = async (req, res) => {
  //user already scanned the qr that redirected them to this url
  // we need to take the data from the url
  // the data is the platenumber
  const qrCode = req.params.qrCode;
};

const logs = async (req, res) => {
  try {
    const data = await CarModel.logs();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

const garage = async (req, res) => {
  try {
    const data = await CarModel.garage();
    if (data.length == 0) {
      res.status(201).json("Garage is empty now!");
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

const checkOut = async (req, res) => {
  if (!req.query.checkInTime || !req.query.plateNumber) {
    return res
      .status(400)
      .json({ message: "something is missing in ur request" });
  }
  const { checkInTime: qCheckInTime, plateNumber: qPlateNumber } = req.query;

  const dataExist = await CarModel.find({
    checkInTime: qCheckInTime,
    plateNumber: qPlateNumber,
  });
  if (dataExist.length == 0) {
    console.log(dataExist);
    return res.status(404).json({ message: "Car is not found in the db" });
  }

  try {
    const fee = await CarModel.fee(qCheckInTime, qPlateNumber);

    // if there was no document found thus no fee
    if (fee == "notFound") {
      return res.status(400).json({
        message: "Error processing payment, documents were not found",
      });
    } else if (fee == "noCharge") {
      const paidCar = await CarModel.findOneAndUpdate(
        { checkInTime: qCheckInTime, plateNumber: qPlateNumber },
        { isPaid: true, checkOutTime: Date.now() }
      );
      const { slot } = paidCar;
      await SlotModel.findOneAndUpdate({ number: slot }, { isAvailable: true });
      return res.status(200).json({
        url: `http://localhost:3000/free-hour`,
      });
    } else {
      //Pay with stripe
      const { url, id } = await stripe.stripePayment(
        fee,
        qCheckInTime,
        qPlateNumber
      );

      // update the db
      await CarModel.findOneAndUpdate(
        { checkInTime: qCheckInTime },
        { stripeId: id, checkOutTime: Date.now(), fee: fee }
      );

      res.status(200).json({ url });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong " + err });
  }
};

async function paymentSuccess(req, res) {
  if (!req.query.checkInTime || !req.query.plateNumber) {
    return res.status(405).json({ url: "http://localhost:3000" });
  }

  const qPlateNumber = req.query.plateNumber;
  const qCheckInTime = req.query.checkInTime;

  if (qPlateNumber.length !== 10 || qCheckInTime.length < 13) {
    return res
      .status(404)
      .json({ url: "http://localhost:3000", message: "invalid payment" });
  }

  //Main
  try {
    const { stripeId } = await CarModel.findOne({
      checkInTime: qCheckInTime,
      plateNumber: qPlateNumber,
    });

    if (!stripeId) {
      return res.status(404).json({ message: "No record for that payment" });
    }

    const { payment_status: status } = await stripe.findById(stripeId);

    if (status !== "paid") {
      return res.status(400).json({
        message:
          "it looks like your stripe payment did not succed! check again with stripe ",
      });
    }
    if (status == "paid") {
      return res.status(400).json({
        message:
          "it looks like you have paid already, wanna pay again? we wouldn'n mind ;)",
      });
    }

    // update the car payment status in the db
    const paidCar = await CarModel.findOneAndUpdate(
      { stripeId: stripeId },
      { isPaid: true }
    );

    // free slot in db
    const { slot } = paidCar;
    await SlotModel.findOneAndUpdate({ number: slot }, { isAvailable: true });

    return res
      .status(200)
      .json({ amount: paidCar.fee, message: "Your payment was successful" });
  } catch (e) {}
}

module.exports = {
  register,
  checkIn,
  logs,
  garage,
  scanCheckIn,
  checkOut,
  paymentSuccess,
  reserveByDay,
  checkReservationAvailability,
  reservedCheckIn,
};
