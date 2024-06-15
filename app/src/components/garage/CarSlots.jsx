import carImg from "../../../public/car.png";
import Image from "next/image";
import "./carSlots.css";
const CarSlots = ({ takenSlots }) => {
  const cars = takenSlots.map((slot) => {
    switch (slot) {
      case "C1":
        return <Image className="C1" src={carImg} width={60} height={60} />;
      case "C2":
        return <Image className="C2" src={carImg} width={60} height={60} />;
      case "C3":
        return <Image className="C3" src={carImg} width={60} height={60} />;
      case "C4":
        return <Image className="C4" src={carImg} width={60} height={60} />;
      case "C5":
        return <Image className="C5" src={carImg} width={60} height={60} />;
      case "C6":
        return <Image className="C6" src={carImg} width={60} height={60} />;
      case "B1":
        return <Image className="B1" src={carImg} width={60} height={60} />;

      case "B2":
        return <Image className="B2" src={carImg} width={60} height={60} />;
      case "B3":
        return <Image className="B3" src={carImg} width={60} height={60} />;
      case "B4":
        return <Image className="B4" src={carImg} width={60} height={60} />;
      case "B5":
        return <Image className="B5" src={carImg} width={60} height={60} />;
      case "B6":
        return <Image className="B6" src={carImg} width={60} height={60} />;

      default:
        return null;
    }
  });
  return <div className="carSlots">{cars}</div>;
};

export default CarSlots;
