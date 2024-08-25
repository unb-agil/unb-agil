import { useState, useRef } from 'react';

const FileUpload = () => {
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

      if (data.curriculumId) {
        localStorage.setItem('curriculumId', data.curriculumId);
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
