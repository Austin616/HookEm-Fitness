import React, { createContext, useContext, useState } from "react";

// Create the Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to access the context
export const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;