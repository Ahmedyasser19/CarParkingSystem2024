const mongoose = require("mongoose");
const SlotsSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    bookedDays: [
      {
        startDate: {
          type: String,
          required: true,
          default: null,
        },
        endDate: {
          type: String,
          required: true,
          default: null,
        },
      },
    ],

    clock: [
      {
        time: {
          type: String,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
    allHoursBusy: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

// checks if there are any available slots in the garage
SlotsSchema.statics.availableSpace = async function () {
  const available = await this.exists({ isAvailable: true });
  if (available) {
    return true;
  } else {
    return false;
  }
};

SlotsSchema.statics.parkCar = async function () {
  try {
    const parkingSlot = await this.findOneAndUpdate(
      { isAvailable: true },
      { isAvailable: false },
      { new: true }
    );
    return parkingSlot.number;
  } catch (err) {
    return 0;
  }
};

SlotsSchema.statics.getSlotsSchedule = async function () {
  const slots = await this.find().select("number bookedDays -_id");

  return slots;
};

// this functions takes an array of slots or one slot to check
// it's availability in the db before reservation

SlotsSchema.statics.checkAvailabilityByDays = async function (
  slots,
  startDate,
  endDate,
  option
) {
  // returns true if there is available space and no clash
  const startTime = new Date(startDate);
  const endTime = new Date(endDate);

  switch (option) {
    case "oneSlot":
      const { bookedDays } = await this.findOne({
        number: slots,
      });
      if (bookedDays.length == 0) {
        return true;
      }

      for (const bookedDay of bookedDays) {
        let dbStartTime = new Date(bookedDay.startDate);
        let dbEndTime = new Date(bookedDay.endDate);
        if (overLapping(startTime, endTime, dbStartTime, dbEndTime)) {
          return false;
        }
      }

      return true;

    case "allSlots":
      if (slots.length == 0) {
        return true;
      }
      let filteredSlots = [];

      for (const slot of slots) {
        let isAvailable = true;
        for (const bookedDay of slot.bookedDays) {
          let dbStartTime = new Date(bookedDay.startDate);
          let dbEndTime = new Date(bookedDay.endDate);
          if (overLapping(startTime, endTime, dbStartTime, dbEndTime)) {
            isAvailable = false;
            break;
          } else {
            isAvailable = true;
          }
        }
        filteredSlots.push({ number: slot.number, isAvailable });
      }
      return filteredSlots;
  }

  function overLapping(startTime, endTime, dbStartTime, dbEndTime) {
    return (
      (dbStartTime <= endTime && dbEndTime >= startTime) ||
      (dbStartTime >= startTime && dbStartTime <= endTime) ||
      (dbEndTime >= startTime && dbEndTime <= endTime)
    );
  }
};

SlotsSchema.statics.reserve = async function (
  startDate,
  endDate,
  slotNumber,
  reserveBy
) {
  const availabileSlots = await this.checkAvailabilityByDays(
    slotNumber,
    startDate,
    endDate,
    "oneSlot"
  );

  if (availabileSlots) {
    switch (reserveBy) {
      case "reserveByDay":
        const newBooking = {
          startDate: startDate,
          endDate: endDate,
        };

        try {
          await this.findOneAndUpdate(
            { number: slotNumber },
            { $push: { bookedDays: newBooking } }
          );

          //call event to sort the array of dates
          return true;
        } catch (err) {
          return false;
        }

      case "reserveByHour":

      default:
        break;
    }
  } else {
    return "Clash of dates, this date cannot be saved to the db";
  }
};

const SlotsModel =
  mongoose.models.SlotsModel || mongoose.model("SlotsModel", SlotsSchema);

const createData = async () => {
  // loop 12 times for eact slot
  for (let i = 0; i < 12; i++) {}

  const slotNumbers = [
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
  ];

  for (const number of slotNumbers) {
    const existingSlot = await SlotsModel.findOne({ number });
    if (!existingSlot) {
      let clockObjs = [];
      for (let i = 0; i < 24; i++) {
        let hour = i < 10 ? "0" + i : "" + i;
        clockObjs.push({ time: hour, isAvailable: true });
      }
      await SlotsModel.create({ number, clock: clockObjs });
    }
  }
};

createData();

module.exports = SlotsModel;
