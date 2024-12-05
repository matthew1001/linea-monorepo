import { ethers } from "ethers";
import { abi as TestERC20Abi, bytecode as TestERC20Bytecode } from "./static-artifacts/TestERC20.json";
import { deployContractFromArtifacts } from "../common/helpers/deployments";
import { get1559Fees } from "../scripts/utils";
import { getRequiredEnvVar } from "../common/helpers/environment";

async function main() {
  const ORDERED_NONCE_POST_LINEAROLLUP = 4;
  const ORDERED_NONCE_POST_TOKENBRIDGE = 5;
  const ORDERED_NONCE_POST_L2MESSAGESERVICE = 3;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const chainId = (await provider.getNetwork()).chainId;
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  console.log(` -> Deploy ERC20 test contract to chain ${chainId}. Wallet nonce currently ${await wallet.getNonce()}`);

  const erc20Name = getRequiredEnvVar("TEST_ERC20_NAME");
  const erc20Symbol = getRequiredEnvVar("TEST_ERC20_SYMBOL");
  const erc20Supply = getRequiredEnvVar("TEST_ERC20_INITIAL_SUPPLY");

  const { gasPrice } = await get1559Fees(provider);

  let walletNonce;

  if (process.env.TEST_ERC20_L1 === "true") {
    if (!process.env.L1_NONCE) {
      walletNonce = await wallet.getNonce();
      console.log(`   -> Deploy L1 chain ${chainId} ERC20 test contract, using retrieved nonce value ${walletNonce}`);
    } else {
      walletNonce = parseInt(process.env.L1_NONCE) + ORDERED_NONCE_POST_LINEAROLLUP + ORDERED_NONCE_POST_TOKENBRIDGE;

      console.log(`   -> Deploy L1 chain ${chainId} ERC20 test contract, using forced nonce value ${walletNonce}`);
    }
  } else {
    if (!process.env.L2_NONCE) {
      walletNonce = await wallet.getNonce();
      console.log(`   -> Deploy L2 chain ${chainId} ERC20 test contract, using retrieved nonce value ${walletNonce}`);
    } else {
      walletNonce =
        parseInt(process.env.L2_NONCE) + ORDERED_NONCE_POST_L2MESSAGESERVICE + ORDERED_NONCE_POST_TOKENBRIDGE;
      console.log(`   -> Deploy L2 chain ${chainId} ERC20 test contract, using forced nonce value ${walletNonce}`);
    }
  }

  const testERC20 = await deployContractFromArtifacts(
    "Chain " + chainId + " ERC20",
    TestERC20Abi,
    TestERC20Bytecode,
    wallet,
    erc20Name,
    erc20Symbol,
    erc20Supply,
    {
      nonce: walletNonce,
      gasPrice,
    },
  );

  const testERC20Address = await testERC20.getAddress();

  console.log(` -> TestERC20 deployed to chain ${chainId}. Contract address=${testERC20Address} `);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
