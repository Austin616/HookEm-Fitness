import React, { createContext, useContext, useState } from "react";

// Create the Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const handleSignOut = () => {
    // Handle sign out logic (you can reset userId or clear auth state here)
    setUserId(null);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, handleSignOut }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to access the context
export const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;