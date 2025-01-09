import React, { createContext, useContext, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

interface LoaderContextType {
  startLoading: () => void;
  completeLoading: () => void;
}
const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const loadingBarRef = useRef<any | null>(null);

  const startLoading = () => {
    loadingBarRef.current?.continuousStart();
  };

  const completeLoading = () => {
    loadingBarRef.current.complete();
  };

  return (
    <LoaderContext.Provider value={{ startLoading, completeLoading }}>
      <LoadingBar color="#ed7e0f" ref={loadingBarRef} />
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  return useContext(LoaderContext);
};
