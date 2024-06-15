"use client";
import Image from "next/image";

import "./page.css";
import { useEffect, useState } from "react";
import CarSlots from "@/components/garage/CarSlots";

const ParkingLogsPage = () => {
  const [garageData, setGarageData] = useState([]);
  const anHour = 60 * 60 * 1000;
  let setTakenSlots = []; // will be used to pass the taken slots to print the images of the cars in the garage
  async function getGarageData() {
    try {
      const response = await fetch("http://localhost:4300/api/garage", {
        method: "get",
      });
      console.log("fetched");
      const data = await response.json();

      if (response.status == 200 && data) {
        setGarageData(data);
      }
    } catch (err) {}
  }

  function transformTime(ms) {
    const totalMinutes = Math.floor(ms / (1000 * 60)); // Total minutes
    const hours = Math.floor(totalMinutes / 60); // Total hours
    const minutes = totalMinutes % 60; // Remaining minutes

    return `${hours}H ${minutes}M `;
  }

  function calculateFee(parkingTimeInMs) {
    const aMinute = 60 * 1000; // 1 minute in milliseconds
    const feePerMinute = 0.0833; // Approximately $5 per hour, so $5 / 60 minutes

    // Calculate the fee based on the number of minutes, rounded up to the nearest minute
    const timeInMinutes = Math.ceil(parkingTimeInMs / aMinute);
    const fee = timeInMinutes * feePerMinute;

    return fee.toFixed(2); // Return the fee rounded to 2 decimal places
  }

  function formatDateTime(milliseconds) {
    const date = new Date(milliseconds);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  function fillTable(data) {
    return (
      <table>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Plate number</th>
            <th>Time in</th>
            <th>Park time</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            let { plateNumber, checkInTime, slot } = item;
            const paymentUrl = `http://localhost:4300/api/check-out?checkInTime=${checkInTime}&plateNumber=${plateNumber}`;
            setTakenSlots = [...setTakenSlots, slot];
            let parkingTimeInMs = Date.now() - checkInTime;
            let parkTime = transformTime(parkingTimeInMs);
            let timeIn = formatDateTime(checkInTime);
            let fee;
            if (parkingTimeInMs > anHour) {
              fee = calculateFee(parkingTimeInMs);
            } else {
              fee = 0;
            }

            const handleClick = async () => {
              try {
                const response = await fetch(paymentUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                });

                if (response.ok) {
                  const data = await response.json();

                  window.open(data.url, "_blank");
                  getGarageData();
                }
              } catch (e) {
                console.log(e);
              }
            };

            return (
              <tr key={index}>
                <td>{slot}</td>
                <td>{plateNumber}</td>
                <td>{timeIn}</td>
                <td>{parkTime}</td>
                <td className="hover" onClick={handleClick}>
                  <p className="success">Pay {fee}$</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  useEffect(() => {
    getGarageData();
  }, []);

  return (
    <div className="logsContainer">
      <div className="tableClass">{fillTable(garageData)}</div>
      <div className="parkingSlot">
        <CarSlots takenSlots={setTakenSlots} />
        <Image src="/parkingSlots.png" alt="Parking slot" fill />
      </div>
    </div>
  );
};

export default ParkingLogsPage;
