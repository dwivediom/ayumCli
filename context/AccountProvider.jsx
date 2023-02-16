import React, { useState } from "react";
import { createContext } from "react";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [authstatus, setauthstatus] = useState(false);
  const [thankmodal, setthankmodal] = useState(false);
  return (
    <AccountContext.Provider
      value={{
        authstatus,
        setauthstatus,
        thankmodal,
        setthankmodal,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
