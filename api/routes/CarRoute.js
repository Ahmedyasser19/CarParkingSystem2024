const router = require("express").Router();

const {
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
} = require("../controllers/CarControllers");

// creates a qr code for a car
// simulates the machine that prints out qr codes
router.post("/register", register);

// second way of regestering
router.post("/reserve", reserveByDay);
router.post("/reserve-check-in", reservedCheckIn);

/* check-in is when a car scans the qr code and the gates
open for it to enter the garage.

Here where we will start counting time for the car.

logic: take the qr code from the user to indicate whih car 
has entered and associated time for it */
router.post("/check-in", checkIn);
router.post("/scanCheck-in/:qrCode", scanCheckIn);

//all qr codes that have entered or still inside the garage
router.get("/logs", logs);

//only the cars that are currently inside the garage
router.get("/garage", garage);

router.post("/check-out", checkOut);
router.post("/payment-successful", paymentSuccess);

router.post("/check-reservation", checkReservationAvailability);

module.exports = router;
