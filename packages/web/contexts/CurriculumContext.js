import { createContext, useState, useEffect } from 'react';

const CurriculumContext = createContext();

export const CurriculumProvider = ({ children }) => {
  const [curriculumSigaaId, setCurriculumSigaaId] = useState(null);

  useEffect(() => {
    const storedSigaaId = localStorage.getItem('curriculumSigaaId');
    setCurriculumSigaaId(storedSigaaId);
  }, []);

  return (
    <CurriculumContext.Provider value={{ curriculumSigaaId, setCurriculumSigaaId }}>
      {children}
    </CurriculumContext.Provider>
  );
};

export default CurriculumContext;
