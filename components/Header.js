import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="text-2xl text-blue-600">
      Decentralized Raffle
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
