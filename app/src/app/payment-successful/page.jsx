"use client";
import { useEffect, useState } from "react";

const Page = () => {
  const [text, setText] = useState("");

  async function success() {
    //get the time and car plate from the url
    const urlParams = new URLSearchParams(window.location.search);
    const checkInTime = urlParams.get("checkInTime");
    const plateNumber = urlParams.get("plateNumber");

    if (!checkInTime || !plateNumber) {
      setText("unAuthorized, redirecting...");
      redirectAfterSomeTime(2, "http://localhost:3000/");
      return;
    }

    const response = await fetch(
      `http://localhost:4300/api/payment-successful?checkInTime=${checkInTime}&plateNumber=${plateNumber}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      setText("Server returned an error status: " + response.status);
      return;
    }

    const data = await response.json();

    if (response.status == 405) {
      setText("unAuthorized, redirecting...");
      redirectAfterSomeTime(2, data.url);
    } else if (response.status == 404) {
      setText(data.message + " redirecting...");
      redirectAfterSomeTime(2, data.url);
    } else if (response.status == 400) {
      setText(data.message);
    } else if (response.status == 200) {
      setText(data.message + ". charged: " + data.amount);
    }
  }

  function redirectAfterSomeTime(time, url) {
    time = time * 1000; //making it seconds
    setTimeout(() => {
      window.location.href = url;
    }, time);
  }
  useEffect(() => {
    success();
  });

  return <div>{text}</div>;
};

export default Page;
