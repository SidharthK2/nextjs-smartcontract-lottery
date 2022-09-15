import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    setEntranceFee(entranceFeeFromCall, "ether");
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    setNumPlayers(numPlayersFromCall);
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      const onWinnerPicked = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const raffle = new ethers.Contract(raffleAddress, abi, provider);
        raffle.on("WinnerPicked", (winnerAddress) => {
          setRecentWinner(winnerAddress);
        });
      };
      onWinnerPicked();
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };
  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  return (
    <div className="text-blue-600">
      Hi from lottery entrance
      {raffleAddress ? (
        <div>
          <button
            className="bg-green-300 rounded-lg p-1 hover:bg-green-400"
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}>
            Enter Raffle
          </button>
          <br />
          Entrance Fee: {ethers.utils.formatUnits(entranceFee)} ETH <br />
          Number of players: {numPlayers} <br />
          Recent Winner: {recentWinner}
        </div>
      ) : (
        <div>No Raffle Address detected</div>
      )}
    </div>
  );
}
