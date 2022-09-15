import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="text-2xl m-2 p-2 text-blue-600">
      Decentralized Raffle
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
