import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { MAINNET_CHAINS } from "../chains";

const [mainnet, ...optionalChains] = Object.keys(MAINNET_CHAINS).map(Number);

console.log(mainnet, optionalChains);
export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: "a6cc11517a10f6f12953fd67b1eb67e7",
        chains: [1],
        optionalChains: [1, 4, 5, 97, 56],
        showQrModal: true,
      },
    }),
);
