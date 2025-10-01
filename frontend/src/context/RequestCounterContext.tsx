import { createContext, useState, useContext } from 'react';

type RequestCounterContextType = {
  requestsRemaining: number | null;
  setRequestsRemaining: React.Dispatch<React.SetStateAction<number | null>>;
};

const RequestCounterContext = createContext<RequestCounterContextType | undefined>(undefined);

export const RequestCounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(null);

  return (
    <RequestCounterContext.Provider value={{ requestsRemaining, setRequestsRemaining }}>
      {children}
    </RequestCounterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRequestCounter = () => {
  const context = useContext(RequestCounterContext);
  if (!context) {
    throw new Error('useRequestCounter must be used within a RequestCounterProvider');
  }
  return context;
};
