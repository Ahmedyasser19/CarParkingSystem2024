"use client";
import "./reservePage.css";
import MultistepBar from "@/components/MultistepBar/MultistepBar";
import DateRangePicker from "@/components/dateRangePicker/DateRangePicker";
import SlotPicker from "@/components/slotPicker/SlotPicker";
import { useState } from "react";
const page = () => {
  const [step, setStep] = useState(0);
  const [Nextprop, setNextProp] = useState(false);

  function handleBackClick() {
    setStep(0);
    setNextProp(false);
  }
  async function handleNextClick() {
    setStep(1);
    setNextProp(true);
  }
  return (
    <div className="reserve-page-wrapper">
      {/* left side step counter */}
      <MultistepBar stepCouter={step} />

      {/* right side pages */}
      <div className="stepsContents">
        {/* step 1 */}
        <div className={`${step == 1 ? "hideMe" : ""}`}>
          <DateRangePicker />
        </div>

        {/* step 2 */}
        <div className={`${step == 0 ? "hideMe" : ""}`}>
          <SlotPicker doFetch={Nextprop} />
        </div>

        {/* buttons */}
        <div className="navButtons">
          {step == 1 && <button onClick={handleBackClick}>Back</button>}

          {step == 0 && <button onClick={handleNextClick}>Next</button>}
        </div>
      </div>
    </div>
  );
};

export default page;
