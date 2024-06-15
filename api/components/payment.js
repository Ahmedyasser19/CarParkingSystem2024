const CarModel = require("../models/CarModel");
const stripe = require("stripe")(process.env.STRIPE_Secret_key);

async function stripePayment(reqFee, reqCheckInTime, reqPlate) {
  const result = await CarModel.find({
    checkInTime: reqCheckInTime,
    plateNumber: reqPlate,
  });

  const { checkInTime, plateNumber } = result[0];

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Parking Time",
          },
          unit_amount: reqFee,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000/payment-successful?checkInTime=${checkInTime}&plateNumber=${plateNumber}`,
  });

  return session;
}

async function findById(qId) {
  const data = await stripe.checkout.sessions.retrieve(qId);
  return data;
}
//4242 4242 4242 4242 success
//4000000000009995 fail

module.exports = { stripePayment, findById };
