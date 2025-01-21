import { createContext, ReactNode, useContext, useState } from 'react';
import { AcademicHistory } from '@unb-agil/academic-history';
import { Component } from '@/models/entities';

interface AcademicHistoryContextType {
  academicHistory: AcademicHistory | null;
  recommendation: Component[][] | null;
  setAcademicHistory: (academicHistory: AcademicHistory | null) => void;
  setRecommendation: (recommendation: Component[][] | null) => void;
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
  const [recommendation, setRecommendation] = useState<Component[][] | null>(
    null,
  );

  return (
    <AcademicHistoryContext.Provider
      value={{
        academicHistory,
        recommendation,
        setAcademicHistory,
        setRecommendation,
      }}
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
