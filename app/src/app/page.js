import QrGenerator from "@/components/qrGenerator/QrGenerator";
import styles from "./page.module.css";
import Image from 'next/image'
export default function Home() {

 


  return (
    <main>
      <div className="mainImageContainer">
      <Image src="/car.gif" alt="my gif" fill />
      </div>

      <QrGenerator />

       

    </main>
  );
}
