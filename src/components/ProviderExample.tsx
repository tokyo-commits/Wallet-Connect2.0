import React from 'react';
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect } from '@web3-react/walletconnect'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { hooks as walletConnectV2Hooks, walletConnectV2 } from '../connectors/walletConnectV2'
import { getName } from '../utils';
import Web3 from 'web3';
import boneABI from "./connectorCards/erc20ABI.json";

const connectors: [MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
]

function Child () {
  const { connector, provider, account } = useWeb3React()
  // const web3 = new Web3(provider);
  // console.log(`Priority Connector is: ${getName(connector)}`)
  // console.log(provider)

  // const getBalance = async () => {
  //   // @ts-ignore
  //   const web3 = new Web3(provider?.provider);
  //   const instance = new web3.eth.Contract(boneABI, '0xBC071C64eD8F536011c78e847755680740d6b73C');
  //   const balance = await instance.methods
  //     .balanceOf()
  //     .call({ from: account });
  //   console.log(balance);
  // };
  // getBalance();
  return null
}

export default function Web3ProviderNew({children}:any) {
  return (
    <Web3ReactProvider connectors={connectors}>
      {children}
    </Web3ReactProvider>
  )
}
