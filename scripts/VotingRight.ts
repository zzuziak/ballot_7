import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];
  const giveRightsToAddress = args[3];

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
  console.log(`Giving voting rights to address ${giveRightsToAddress} ...`);
  await deployedContract.giveRightToVote(giveRightsToAddress);
  console.log(`${giveRightsToAddress} can now vote`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
