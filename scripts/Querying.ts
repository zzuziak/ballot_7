import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];
  //const proposal = args[3];

  // Use the goerli testnet provider
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  //Create my wallet
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing enviroment: private key missing");
  const wallet = new ethers.Wallet(privateKey);

  //Connect the wallet to the provider
  const signer = wallet.connect(provider);
  console.log("The signer is: " + signer.address);

  const ballotFactory = new Ballot__factory(signer);

  //Attach an address to the contract
  console.log(`Attaching to ballot contract at address ${contractAddress} ...`);
  const deployedContract = await ballotFactory.attach(contractAddress);
  console.log("Successfully attached");

  //Call the winningProposal function for show the winner
  const Winner = await deployedContract.winningProposal();
  console.log("The Winner is:" + Winner);
  //Call the winnerName function for show the winner name
  const WinnerName = await deployedContract.winnerName();
  console.log("Winner Name:" + WinnerName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
