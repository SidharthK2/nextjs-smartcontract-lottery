import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div>
      Decentralized Raffle
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
