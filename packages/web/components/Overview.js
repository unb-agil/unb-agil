import React, { useState, useEffect } from 'react';

const Overview = () => {
  const [totalIntegrated, setTotalIntegrated] = useState(0);
  const [mandatoryIntegrated, setMandatoryIntegrated] = useState(0);
  const [electiveIntegrated, setElectiveIntegrated] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(100);

  useEffect(() => {
    const total = localStorage.getItem('totalIntegrated') || 0;
    const mandatory = localStorage.getItem('mandatoryIntegrated') || 0;
    const elective = localStorage.getItem('electiveIntegrated') || 0;
    const min = localStorage.getItem('minPeriodWorkload') || 0;
    const max = localStorage.getItem('maxPeriodWorkload') || 100;

    setTotalIntegrated(total);
    setMandatoryIntegrated(mandatory);
    setElectiveIntegrated(elective);
    setSliderMin(min);
    setSliderMax(max);
    setSliderValue(min);
  }, []);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleProcessClick = () => {
    console.log('Processar', sliderValue);
  };

  const handleCancelClick = () => {
    setSliderValue(sliderMin);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <h3>Visão Geral</h3>
        <p>Total integralizado: {totalIntegrated}%</p>
        <p>Obrigatórias integralizadas: {mandatoryIntegrated}%</p>
        <p>Optativas integralizadas: {electiveIntegrated}%</p>
      </div>
      <div style={styles.rightSection}>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={sliderValue}
          onChange={handleSliderChange}
          style={styles.slider}
        />
        <div style={styles.sliderValue}>{sliderValue}</div>
        <div style={styles.buttonContainer}>
          <button onClick={handleCancelClick} style={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={handleProcessClick} style={styles.processButton}>
            Processar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #87E1DF',
    borderRadius: '10px',
    padding: '20px',
    width: '80%',
    margin: '20px auto',
  },
  leftSection: {
    textAlign: 'left',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    marginBottom: '10px',
  },
  sliderValue: {
    marginBottom: '10px',
    fontSize: '18px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    border: '2px solid #023535',
    color: '#023535',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  processButton: {
    backgroundColor: '#023535',
    color: '#fff',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
  },
};

export default Overview;
