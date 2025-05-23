import { createContext, useState, useContext } from 'react';

const RequestCounterContext = createContext<any>(null);

export const RequestCounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(null);

  return (
    <RequestCounterContext.Provider value={{ requestsRemaining, setRequestsRemaining }}>
      {children}
    </RequestCounterContext.Provider>
  );
};

export const useRequestCounter = () => useContext(RequestCounterContext);
