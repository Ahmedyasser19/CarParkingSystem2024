var QRCode = require("qrcode");
const createSalt = require("../components/salt");

const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  stripeId: {
    type: String,
    default: "",
  },
  slot: {
    type: String,
    default: "-",
  },
  plateNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },

  qrCode: {
    type: String,
    required: true,
  },

  checkInTime: {
    type: Number,
    default: null,
  },

  checkOutTime: {
    type: Number,
    default: null,
  },

  parkingTime: {
    type: Number,
    default: null,
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  fee: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

//scan ur phone to login?
//qr code contains the api endpoing with the plate
//that does post request to the server
// then redirects to success when done

CarSchema.statics.register = async function (carPlate) {
  const salt = createSalt();
  const apiUrl = `http://localhost:4300/api/check-in?qrCode=${salt + carPlate}`;
  const qrCodeImage = await QRCode.toDataURL(apiUrl);

  const query = await this.create({
    plateNumber: carPlate,
    qrCode: qrCodeImage,
  });
  return query;
};

CarSchema.statics.checkIn = async function (qQrCode) {
  const query = await this.findOneAndUpdate(
    { qrCode: qQrCode },
    { checkInTime: Date.now() }
    // { new: true }
  );

  return query;
};

CarSchema.statics.logs = async function () {
  try {
    const logs = await this.find({ checkInTime: { $ne: null } });

    return logs.map(
      ({ plateNumber, checkInTime, checkOutTime, parkingTime, fee }) => {
        return { plateNumber, checkInTime, checkOutTime, parkingTime, fee };
      }
    );
  } catch (err) {
    return "An error occurred while fetching logs";
  }
};

CarSchema.statics.garage = async function () {
  //Logic: if the car is not paid then it's still inside
  // if the car does not have check in time, dont return it to front end
  const unpaidCars = await this.find({ isPaid: false });

  const mainData = unpaidCars
    .filter((car) => car.checkInTime !== null) // Filter out cars without checkInTime
    .map((car) => {
      const { slot, plateNumber, checkInTime } = car;
      return { slot, plateNumber, checkInTime };
    });

  return mainData;
};

CarSchema.statics.fee = async function (qcheckInTimeMs, qPlateNumber) {
  const doExist = await this.find({
    checkInTime: qcheckInTimeMs,
    plateNumber: qPlateNumber,
  });

  if (!doExist) {
    return "notFound";
  }

  let parkingTimeInMs = Date.now() - qcheckInTimeMs;
  const anHour = 60 * 60 * 1000;

  if (parkingTimeInMs < anHour) {
    return "noCharge";
  } else {
    let fee = calculateFee(parkingTimeInMs);
    return fee;
  }

  function calculateFee(parkingTimeInMs) {
    const aMinute = 60 * 1000; // 1 minute in milliseconds
    const feePerMinute = 0.0833; // Approximately $5 per hour, so $5 / 60 minutes

    // Calculate the fee based on the number of minutes, rounded up to the nearest minute
    const timeInMinutes = Math.ceil(parkingTimeInMs / aMinute);
    const fee = timeInMinutes * feePerMinute * 100; // Convert to cents

    return Math.round(fee); // Return the fee in cents
  }
};

module.exports =
  mongoose.models.CarModel || mongoose.model("CarModel", CarSchema);
