import CoinbaseWalletCard from './components/connectorCards/CoinbaseWalletCard'
import GnosisSafeCard from './components/connectorCards/GnosisSafeCard'
import MetaMaskCard from './components/connectorCards/MetaMaskCard'
import NetworkCard from './components/connectorCards/NetworkCard'
import WalletConnectV2Card from './components/connectorCards/WalletConnectV2Card'
import ProviderExample from './components/ProviderExample'
import { MAINNET_CHAINS } from './chains'

const [mainnet, ...optionalChains] = Object.keys(MAINNET_CHAINS).map(Number)

export default function Home() {
  console.log({mainnet, optionalChains})
  return (
    <>
      <ProviderExample />
      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <MetaMaskCard />
        <WalletConnectV2Card />
        <CoinbaseWalletCard />
        {/* <NetworkCard /> */}
        {/* <GnosisSafeCard /> */}
      </div>
    </>
  )
}
