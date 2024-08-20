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
        <button type="button" style={styles.button} onClick={handleButtonClick}>
          <span style={styles.icon}>📄</span>
          <span>{selectedFile ? selectedFile.name : 'Selecionar Histórico'}</span>
        </button>
      </label>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
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
};

export default FileUpload;
