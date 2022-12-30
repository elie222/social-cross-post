import type { NextApiRequest, NextApiResponse } from "next";
import { MerkleAPIClient } from "@standard-crypto/farcaster-js";
import { Wallet } from "ethers";

const FC_MNEMONIC = process.env.FC_MNEMONIC;

// fetch the bearer token and log it
// http://localhost:3000/api/secret
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!FC_MNEMONIC) throw new Error("No mnemonic found in env vars");
  const wallet = Wallet.fromMnemonic(FC_MNEMONIC);

  const client = new MerkleAPIClient(wallet);

  const EXPIRY_DURATION_MS = 31536000000; // 1 year
  const bearerToken = await client.createAuthToken(EXPIRY_DURATION_MS);
  console.log(bearerToken);

  res.status(200).json({ sucess: "See server logs for bearer token" });
}
