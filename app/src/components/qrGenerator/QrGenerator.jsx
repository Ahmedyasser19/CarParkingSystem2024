"use client";
import CopyButton from "./copyButton/CopyButton";
import "./qrGenerator.css";
import { useEffect, useState } from "react";

const QrGenerator = () => {
  const [qrStatus, setQrStatus] = useState(0); //0: not visable - 1: printing - 2: printed - 3: failed
  const [inputTextPlate, setInputTextPlate] = useState("");
  const [BtnTextPlate, setBtnTextPlate] = useState("register");
  const [generatedCount, setgeneratedCount] = useState(0);
  const [failedCount, setfailedCount] = useState(0);
  const [btnWait, setBtnWait] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [qrImgSrc, setQrImgSrc] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQrStatus(0);

    if (activeTab == 0) {
      let fetchLink = "http://localhost:4300/api/register";
      setBtnWait(true);
      setBtnTextPlate(`Try again in 3`);
      let countdown = 2;
      const countdownInterval = setInterval(() => {
        setBtnTextPlate(`Try again in ${countdown}`);
        countdown--;
        if (countdown < 0) {
          clearInterval(countdownInterval);
          setBtnWait(false);
          setBtnTextPlate("register");
        }
      }, 1000);

      try {
        const response = await fetch(fetchLink, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ PlateNumber: inputTextPlate }),
        });
        const data = await response.json();

        setQrImgSrc(data.QrCodeGenerated);

        setQrStatus(2);
        setgeneratedCount(generatedCount + 1);
      } catch (error) {
        setQrStatus(3);
        setfailedCount(failedCount + 1);
      }
    } else if (activeTab == 1) {
      let fetchLink = "http://localhost:4300/api/check-in";
      setQrStatus(4);
      try {
        const response = await fetch(fetchLink, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ QrCode: inputTextPlate }),
        });

        if (response.status == 200) {
          setQrStatus(5); // Car successfully checked in
        } else if (response.status === 400) {
          setQrStatus(6); // Car is already checked in
        } else if (response.status === 201) {
          setQrStatus(7); // full
        } else if (response.status === 400) {
          setQrStatus(8); // qr code required
        }
      } catch (error) {
        setQrStatus(3); // Failed to check in
        setfailedCount(failedCount + 1);
      }
    }
  };

  const PrintQrStatus = () => {
    switch (qrStatus) {
      case 0:
        return null;

      case 1:
        return <p>Printing</p>;

      case 2:
        return <p className="success">Printed</p>;

      case 3:
        return <p className="fail">Failed</p>;

      case 4:
        return <p>checking-in</p>;
      case 5:
        return <p className="success">Successfully checked-in</p>;
      case 6:
        return <p className="fail">Code is not valid</p>;
      case 7:
        return <p className="fail">Garage is full</p>;
      case 8:
        return <p className="fail">QR code is required</p>;

      default:
        return null;
    }
  };

  useEffect(() => {
    setQrStatus(0);
    setInputTextPlate("");
  }, [activeTab]);

  const tabMenu = [{ title: "Register" }, { title: "Check-in" }];
  function mainTabs() {
    return (
      <div className="tabs">
        {tabMenu.map((tab, index) => (
          <p
            key={index}
            className={index === activeTab ? "activeTab2" : ""}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="QrGenerator">
      {mainTabs()}
      <div className="GeneratorText1">
        <p>Status : </p>
        {PrintQrStatus()}
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          placeholder={activeTab == 0 ? "car plate" : "qr code"}
          name="plateNumber"
          onChange={(e) => setInputTextPlate(e.target.value)}
          value={inputTextPlate}
        />

        {activeTab == 0 ? (
          <button
            className={
              inputTextPlate.length !== 10 || btnWait
                ? "buttonDisabled"
                : "buttonEnabled"
            }
            disabled={inputTextPlate.length !== 10 || btnWait}
          >
            {BtnTextPlate}
          </button>
        ) : (
          <button
            className={`${
              inputTextPlate.length < 10 ? "buttonDisabled" : "buttonEnabled"
            } ${qrStatus === 2 ? "success" : qrStatus === 3 ? "fail" : ""}`}
            disabled={inputTextPlate.length < 10}
          >
            check-in
          </button>
        )}
      </form>
      <div className="GeneratorText2">
        <p>
          Generated : <span className="success">{generatedCount} </span>
        </p>
        <p>
          Failed : <span className="fail">{failedCount} </span>
        </p>
      </div>

      {generatedCount != 0 ? (
        <div className="generatedQrCode">
          <img src={qrImgSrc} />
          <CopyButton qrCodeString={qrImgSrc} />
        </div>
      ) : null}
    </div>
  );
};

export default QrGenerator;
