import { ethers } from "hardhat";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
let ballotContract: Ballot;

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
    const args = process.argv;
    const proposals = args.slice(2)
    if (proposals.length <= 0) throw new Error("Missing parameters: proposals");

    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic || mnemonic.length <= 0) throw new Error("Missing env variable: mnemonic seed")

    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const lastBlock = await provider.getBlock("latest");
    // console.log({provider})
    // const signers = await ethers.getSigners();
    // console.log(signers[0])
    // console.log(signers[0].connect(provider).getBalance());
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    // or new ethers.Wallet(private_key)
    const signer = wallet.connect(provider)
    const balance = await signer.getBalance();
    console.log(balance)
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(proposals)
    );
    await ballotContract.deployTransaction.wait();
  console.log(`The ballot contract was deployed at the address ${ballotContract.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});