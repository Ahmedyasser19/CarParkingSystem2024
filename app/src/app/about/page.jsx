const AboutPage = () => {
  return (
    <p>
      Logic:
      <br />
      <br /> Getting inside: When a car wants to enter our garage, it
      "registers" by clicking on the " generate" button in the "Home Page". This
      simulates a user clicking on the real machine that prints a paper to enter
      the garage. This paper contains a unique id for each car. A car gets 1
      hour free parking then it will start to be charged 6$ per hour.
      <br />
      After registering -Getting a paper from the machine with the qr code
      printed on it-, the user scans the machine for the gates to open. we
      simulate this by pressing "check-in" button in the "Home page"
      <br />
      <br />
      Inside of the garage: There will be scensors that are connected to a light
      bulb to indicate the available slots inside of the garage. Red means the
      garage is not available and green means it's available to park in it.
      <br />
      <br />
      payment: When a car wants to leave the garage, each should input his
      papaer id into the payment machine (the website in our case simualtes
      that) where it will calculate for him how much is he charged.
      <br />
      <br />
      functions: <br />
      1. simulate the id machine with a button in the front end User clicks on a
      button on the front end to simulate the machine printing out a recipt for
      the car.
      <br />
      <br />
      Thebackend shall:
      <br /> create unique id, create qr code for the machine to scan when the
      car tries to enter, check in date and time, check out date and time, total
      amount of money based on the given equation
      <br />
      <br />
      2. Front end shall:
      <br /> display all the slots available <br />
      <br />
      3. Front end can manually control checking in and out by removing cars
      from there slots (as a admin)
    </p>
  );
};

export default AboutPage;
