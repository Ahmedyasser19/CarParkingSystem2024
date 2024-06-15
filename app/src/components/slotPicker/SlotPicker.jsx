"use client";
import "./slotpicker.css";
import CarSlots from "./../garage/CarSlots";
import Image from "next/image";
import { useEffect, useState } from "react";

const SlotPicker = ({ doFetch }) => {
  const [Data, setData] = useState();

  async function getData() {
    const resp = await fetch("http://localhost:4300/api/check-reservation", {
      method: "get",
    });

    if (resp.status == 200) {
      const data = await resp.json();

      setData(data);
    }
  }
  useEffect(() => {
    if (doFetch) {
      getData();
    }
  }, [doFetch]);

  return (
    <div className="slotPickerWrapper">
      <h1>Choose a slot</h1>
      <div className="FlexRow">
        <div className="chooseASlot">
          <CarSlots takenSlots={["C1", "C2"]} />
          <Image src="/parkingSlots.png" alt="Parking slot" fill />
        </div>
        <div>availability: {Data}</div>
      </div>
    </div>
  );
};

export default SlotPicker;
