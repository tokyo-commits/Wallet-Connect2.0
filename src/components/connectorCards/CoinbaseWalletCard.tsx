import React, { useEffect, useState } from 'react'

import { coinbaseWallet, hooks } from '../../connectors/coinbaseWallet'
import { Card } from '../Card'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export default function CoinbaseWalletCard() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [error, setError] = useState(undefined)

  // // attempt to connect eagerly on mount
  // useEffect(() => {
  //   void coinbaseWallet.connectEagerly().then((res) => {
  //     console.log(res)
  //   }).catch((error) => {
  //     console.log('Failed to connect eagerly to coinbase'+error)
  //   })
  // }, [])

  return (
    <Card
      connector={coinbaseWallet}
      activeChainId={chainId}
      isActivating={isActivating}
      isActive={isActive}
      error={error}
      setError={setError}
      accounts={accounts}
      provider={provider}
      ENSNames={ENSNames}
    />
  )
}
