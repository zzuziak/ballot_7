import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// Call this script to delegate your voting power to another address, passing 2 arguments: 
// 1: The Ballot address and the
// 2: The address you are delegating your voting power to

async function main() {
  const args = process.argv;
  const contractAddress = args[2];
  const delegateAddress = args[3];

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) {
    throw new Error("Private key missing");
  }
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const contract = new Ballot__factory(signer);
  console.log(`Attaching to ballot contract at address ${contractAddress} ...`);
  const deployedContract = contract.attach(contractAddress);
  console.log("Successfully attached");

  const signerVoter = await deployedContract.voters(signer.address);
  if (signerVoter.voted) {
    throw new Error("You have already voted");
  }

  const signerVotingWeight = await signerVoter.weight;
  if (signerVotingWeight.isNegative() || signerVotingWeight.isZero()) {
    throw new Error("You do not have voting rights");
  }
  
  console.log(`Delegating voting power to: ${delegateAddress} ...`);
  const tx = await deployedContract.connect(signer).delegate(delegateAddress);
  await tx.wait();
  
  console.log(`${signer.address} has successfully delegated voting power to ${delegateAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
