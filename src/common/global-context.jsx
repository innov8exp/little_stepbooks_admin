import { createContext, useState, useContext } from "react";
import { GenerateMenu } from "./config";

const defaultGlobalData = {
  activeMenuItem: undefined,
  menuData: GenerateMenu(),
};

const GlobalContext = createContext([defaultGlobalData, () => {}]);

export const useGlobalData = () => {
  return useContext(GlobalContext);
};

const GlobalContextProvider = (children) => {
  const [globalData, setGlobalData] = useState(defaultGlobalData);

  return (
    <GlobalContext.Provider value={[globalData, setGlobalData]}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
