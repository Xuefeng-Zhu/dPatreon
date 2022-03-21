import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Mainnet, Kovan, Polygon, DAppProvider } from '@usedapp/core';

import './index.css';
import App from './App';
import { StateContextProvider } from './contexts/StateContextProvider';
import { Web3ContextProvider } from './contexts/Web3ContextProvider';

const dappConfig = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]:
      'https://poly-mainnet.gateway.pokt.network/v1/lb/6236c56be7d08b0039e933c9',
    [Mainnet.chainId]:
      'https://eth-mainnet.gateway.pokt.network/v1/lb/6236c56be7d08b0039e933c9',
    [Kovan.chainId]:
      'https://poa-kovan.gateway.pokt.network/v1/lb/6236c56be7d08b0039e933c9',
  },
};

const queryClient = new QueryClient();

const subgraphUri =
  'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai';
const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={dappConfig}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <Web3ContextProvider>
            <StateContextProvider>
              <App />
            </StateContextProvider>
          </Web3ContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
