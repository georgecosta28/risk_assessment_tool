// src/context.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser, company, setCompany }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
