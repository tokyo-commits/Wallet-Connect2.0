import type { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import type { Web3ReactHooks } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import boneABI from "./connectorCards/erc20ABI.json"

function useBalances(
  provider?: ReturnType<Web3ReactHooks["useProvider"]>,
  accounts?: string[]
): BigNumber[] | undefined {
  const [balances, setBalances] = useState<BigNumber[] | undefined>();

  useEffect(() => {
    if (provider && accounts?.length) {
      let stale = false;
      // const lib = provider?.provider

      console.log({ accounts }); // lib.provider
      // getBalance()
      void Promise.all(
        accounts.map((account) => provider.getBalance(account))
      ).then((balances) => {
        if (stale) return;
        setBalances(balances);
      });

      return () => {
        stale = true;
        setBalances(undefined);
      };
    }
  }, [provider, accounts]);

  // const getBalance = async () => {
  //   // @ts-ignore
  //   const web3 = new Web3(provider?.provider);
  //   const instance = new web3.eth.Contract(boneABI, '0xBC071C64eD8F536011c78e847755680740d6b73C');
  //   const balance = await instance.methods
  //     .balanceOf(accounts[0])
  //     .call({ from: accounts[0] });
  //   console.log(balance);
  // };

  return balances;
}

export function Accounts({
  accounts,
  provider,
  ENSNames,
}: {
  accounts: ReturnType<Web3ReactHooks["useAccounts"]>;
  provider: ReturnType<Web3ReactHooks["useProvider"]>;
  ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>;
}) {
  const balances = useBalances(provider, accounts);

  if (accounts === undefined) return null;

  return (
    <div>
      Accounts:{" "}
      <b>
        {accounts.length === 0
          ? "None"
          : accounts?.map((account, i) => (
              <ul
                key={account}
                style={{
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ENSNames?.[i] ?? account}
                {balances?.[i] ? ` (Ξ${formatEther(balances[i])})` : null}
              </ul>
            ))}
      </b>
    </div>
  );
}
