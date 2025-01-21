import { createContext, ReactNode, useContext, useState } from 'react';
import { AcademicHistory } from '@unb-agil/academic-history';

interface AcademicHistoryContextType {
  academicHistory: AcademicHistory | null;
  setAcademicHistory: (academicHistory: AcademicHistory | null) => void;
}

const AcademicHistoryContext = createContext<
  AcademicHistoryContextType | undefined
>(undefined);

export const AcademicHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [academicHistory, setAcademicHistory] =
    useState<AcademicHistory | null>(null);

  return (
    <AcademicHistoryContext.Provider
      value={{ academicHistory, setAcademicHistory }}
    >
      {children}
    </AcademicHistoryContext.Provider>
  );
};

export const useAcademicHistoryContext = () => {
  const context = useContext(AcademicHistoryContext);

  if (context === undefined) {
    throw new Error(
      'useAcademicHistoryContext must be used within a AcademicHistoryContextProvider',
    );
  }
  return context;
};
