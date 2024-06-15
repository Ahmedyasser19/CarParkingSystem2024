"use client";

import "./multistepBar.css";

const MultistepBar = ({ stepCouter }) => {
  function printSteps() {
    const steps = ["Time setup", "slot picker", "Checkout", "Next Steps"];
    return steps.map((step, index) => {
      let stepNumber = index + 1;
      return (
        <div
          key={index}
          className={`progress-bar-steps 
        ${
          stepCouter == index || stepCouter > index
            ? "steps-in-progress"
            : " steps-success "
        }`}
        >
          <div
            className={`step-pic 
          ${
            stepCouter == index || stepCouter > index
              ? " steps-in-progress2"
              : "steps-in-progress3 "
          }
          `}
          >
            {stepNumber}
          </div>
          <div>
            <div className="step-light">step {stepNumber}</div>
            <div>{step}</div>
          </div>
        </div>
      );
    });
  }
  return <div className="progress-bar">{printSteps()}</div>;
};

export default MultistepBar;
