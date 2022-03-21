import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMap } from 'react-use';
import _ from 'lodash';

import { useWeb3Context } from './Web3ContextProvider';
import * as covalent from '../utils/covalent';
import * as nftport from '../utils/nftport';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { provider, signer } = useWeb3Context();
  const [loading, setLoading] = useState(false);

  return (
    <StateContext.Provider
      value={{
        loading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
