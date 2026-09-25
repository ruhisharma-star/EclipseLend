// Midnight Network Configuration & Preprod Contract Identifiers
export interface MidnightNetworkConfig {
  networkId: 'preprod' | 'testnet' | 'mainnet' | 'local-simulator';
  indexerUri: string;
  indexerWsUri: string;
  nodeUri: string;
  provingServerUri: string;
  contractAddress: string;
  contractName: string;
  explorerUrl: string;
}

export const MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: (process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK as any) || 'preprod',
  // Official Midnight Preprod Indexer & RPC endpoints
  indexerUri: process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_URI || 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWsUri: process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_WS_URI || 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  nodeUri: process.env.NEXT_PUBLIC_MIDNIGHT_NODE_URI || 'https://rpc.preprod.midnight.network',
  provingServerUri: process.env.NEXT_PUBLIC_MIDNIGHT_PROVING_SERVER_URI || 'http://localhost:6300',
  // Midnight Canonical Contract Address (Level-3 Private Underwriting Protocol on Preprod)
  contractAddress: process.env.NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS || '0x1cabc3aaed1c57db5eddcd1b24d7df1808ec7cb39ff266dfdfb14be93fe9e722',
  contractName: 'EclipseLendProtocol',
  explorerUrl: 'https://preprod.midnightexplorer.com/contracts',
};
