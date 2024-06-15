import { useState } from "react";

const CopyButton = ({ qrCodeString }) => {
  const [text, setText] = useState("copy");
  async function handleClick() {
    try {
      setText("copied");
      await navigator.clipboard.writeText(qrCodeString);

      setTimeout(() => {
        setText("copy");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
  return <button onClick={handleClick}>{text}</button>;
};

export default CopyButton;
