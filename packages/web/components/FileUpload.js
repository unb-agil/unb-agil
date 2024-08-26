import { useState, useRef, useContext } from 'react';
import CurriculumContext from '../contexts/CurriculumContext';

const FileUpload = () => {
  const { setCurriculumSigaaId } = useContext(CurriculumContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Nenhum arquivo selecionado');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/academic-history', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro na solicitação');
      }

      const data = await response.json();

      if (data.curriculumSigaaId) {
        const encodedSigaaId = encodeURIComponent(data.curriculumSigaaId);

        const workloadResponse = await fetch(`http://localhost:3000/curriculum/period-workload/${encodedSigaaId}`);
        
        if (!workloadResponse.ok) {
          throw new Error('Erro na solicitação de workload');
        }

        const workloadData = await workloadResponse.json();

        const { required, remaining } = data.workloads;
        
        const calculatePercentage = (required, remaining) => {
          if (required === 0) return 0;
          const completed = required - remaining;
          const percentage = (completed / required) * 100;
          return percentage > 100 ? 100 : percentage;
        };

        const totalPercentage = calculatePercentage(required.total, remaining.total);
        const mandatoryPercentage = calculatePercentage(required.mandatory, remaining.mandatory);
        const electivePercentage = calculatePercentage(required.elective, remaining.elective);

        localStorage.setItem('totalIntegrated', totalPercentage.toFixed(2));
        localStorage.setItem('mandatoryIntegrated', mandatoryPercentage.toFixed(2));
        localStorage.setItem('electiveIntegrated', electivePercentage.toFixed(2));
        localStorage.setItem('curriculumSigaaId', data.curriculumSigaaId);
        localStorage.setItem('minPeriodWorkload', workloadData.minPeriodWorkload);
        localStorage.setItem('maxPeriodWorkload', workloadData.maxPeriodWorkload);

        setCurriculumSigaaId(data.curriculumSigaaId);
        alert('Curriculum ID salvo com sucesso no localStorage!');
      } else {
        alert('Curriculum ID não encontrado na resposta');
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={styles.input}
          onChange={handleFileChange}
        />
        <button
          type="button"
          style={styles.button}
          onClick={handleButtonClick}
        >
          <span style={styles.icon}>📄</span>
          <span>{selectedFile ? selectedFile.name : 'Selecionar Histórico'}</span>
        </button>
      </label>
      <button
        type="button"
        style={styles.uploadButton}
        onClick={handleFileUpload}
      >
        Enviar
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '500px',
    height: '250px',
    border: '2px dashed #88e4dc',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  input: {
    display: 'none',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#08483c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    margin: '0 auto',
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  uploadButton: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#08483c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default FileUpload;
