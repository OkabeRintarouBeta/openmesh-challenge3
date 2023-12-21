import { useState } from "react";

import styles from "./Tutorial.module.css";

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleTutorialVisibility = () => setIsTutorialVisible(!isTutorialVisible);

  if (!isTutorialVisible) {
    return (
      <div className={styles.tutorial}>
        <h2>First time visiting?</h2>
        <button onClick={toggleTutorialVisibility} className={styles.showButton}>
          Show Tutorial
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tutorial}>
      <h2>Welcome to the Tokenomics Visualizer Tutorial</h2>

      { currentStep === 1 && (
        <div className={styles.step}>
          <h3>Step 1: Build Your Pie Chart</h3>
          <p>This interactive pie chart helps visualize the distribution of a cryptocurrency's initial token supply.</p>
          <ol>
            <li>Click on the <strong>"Build Chart"</strong> button to open the form.</li>
            <li>Enter the <strong>initial supply</strong> of your chosen token (e.g., Ethereum).</li>
            <li>Add a <strong>Group</strong> to represent a category or stakeholder.</li>
            <li>Specify the <strong>percentage</strong> of the initial supply for this group.</li>
          </ol>
          <p>The pie chart updates dynamically as you input data.</p>
        </div>
      )}

      { currentStep === 2 && (
        <div className={styles.step}>
          <h3>Step 2: Explore the Interactive Tokenomics Graph</h3>
          <p>Our dynamic graph displays the latest Ethereum supply and price data.</p>
          <ol>
            <li><strong>Live Data:</strong> View current ETH supply & price.</li>
            <li><strong>Interactive Data Points:</strong> Hover over data points for details.</li>
            <li><strong>Integrated Distribution:</strong> See your pie chart data in the graph.</li>
            <li><strong>Flexible Date Ranges:</strong> Select week, month, year, or custom range.</li>
            <li><strong>Interactive Labels:</strong> Click labels to toggle data lines.</li>
          </ol>
        </div>
      )}

      <div className={styles.navigation}>
        { currentStep > 1 && <button onClick={prevStep}>Previous</button> }
        { currentStep < 2 && <button onClick={nextStep}>Next</button> }
        <button onClick={toggleTutorialVisibility}>
          Hide
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
