"use client";
import Image from "next/image";
import "./page.css";
import { useEffect, useState } from "react";

const ParkingLogsPage = () => {
  const [garageData, setGarageData] = useState([]);

  async function getGarageData() {
    try {
      const response = await fetch("http://localhost:4300/api/logs", {
        method: "get",
      });
      const data = await response.json();

      if (response.status(200)) {
        setGarageData(data);
      }
    } catch (err) {
      console.log("");
    }
  }

  function transformTime(ms) {
    const totalMinutes = Math.floor(ms / (1000 * 60)); // Total minutes
    const hours = Math.floor(totalMinutes / 60); // Total hours
    const minutes = totalMinutes % 60; // Remaining minutes

    return `${hours}H ${minutes}M `;
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
            <th>No</th>
            <th>Plate number</th>
            <th>Day in</th>
            <th>Day out</th>
            <th>Park time</th>
            <th>Fee</th>
          </tr>
        </thead>
        {data.map((item, index) => {
          let { plateNumber, checkInTime, checkOutTime, parkingTime, fee } =
            item;

          let parkTime = transformTime(parkingTime);
          let timeIn = formatDateTime(checkInTime);
          let timeOut = formatDateTime(checkOutTime);
          <tbody>
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{plateNumber}</td>
              <td>{timeIn}</td>
              <td>{timeOut}</td>
              <td>{parkTime}</td>
              <td>{fee}$</td>
            </tr>
          </tbody>;
        })}
      </table>
    );
  }

  useEffect(() => {
    getGarageData();
  }, []);

  return (
    <div className="logsContainer">
      <div className="tableClass">{fillTable(garageData)}</div>
    </div>
  );
};

export default ParkingLogsPage;
