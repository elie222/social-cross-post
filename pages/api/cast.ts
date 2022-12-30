import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import { MerkleAPIClient } from "@standard-crypto/farcaster-js";

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const FC_SECRET = process.env.FC_SECRET;
const FC_SECRET_EXPIRES = process.env.FC_SECRET_EXPIRES;

// http://localhost:3000/api/cast
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!TWITTER_BEARER_TOKEN)
    throw new Error("No Twitter Bearer Token found in env vars");
  if (!FC_SECRET) throw new Error("No FC_SECRET found in env vars");
  if (!FC_SECRET_EXPIRES)
    throw new Error("No FC_SECRET_EXPIRES found in env vars");

  const appOnlyClient = new TwitterApi(TWITTER_BEARER_TOKEN);

  const timeline = await appOnlyClient.v2.userTimeline("158899715", {
    max_results: 5,
    since_id: "1602833256239755265",
    "tweet.fields": ["in_reply_to_user_id", "referenced_tweets"],
  });

  for await (const tweet of timeline) {
    console.log(JSON.stringify(tweet, null, 2));
    // can also just ignore all referenced tweets
    if (
      !tweet.in_reply_to_user_id &&
      !tweet.referenced_tweets?.find(
        (t) => t.type === "retweeted" || t.type === "quoted"
      )
    ) {
      const apiClient = new MerkleAPIClient({
        secret: FC_SECRET,
        expiresAt: parseInt(FC_SECRET_EXPIRES),
      });

      const message = tweet.text;

      apiClient.publishCast(message);

      return res.status(200).json({ message });
    }
  }

  res.status(200).json({ status: "no tweet found" });
}
