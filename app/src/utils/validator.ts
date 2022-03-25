import { Contract } from "@ethersproject/contracts"
import { namehash } from "@ethersproject/hash"
import { getDefaultProvider } from "@ethersproject/providers"

import { IdentityAlias } from 'types/identityAlias'
import { ProofValidation } from 'types/ownerProof'
import { Tweet } from 'types/tweet'

const TWEET_REGEX = '(Verifying my @vvalletdotme alias is )(.*)(: )'
const TWEET_GROUPS = 4

export const validateTweet = async (
  tweet: Tweet,
  expectedOwner: IdentityAlias,
): Promise<boolean> => {
  const groups = tweet.text.match(TWEET_REGEX)

  if (groups !== null && groups.length === TWEET_GROUPS) {
    const claimedAlias = groups[2]

    if (claimedAlias === expectedOwner.alias) {
      return true
    }
  }
  return false
}

const ensContract = new Contract(
  "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41", // ENS resolver contract
  [
    "function addr(bytes32,uint256) view returns (bytes)",
    "function text(bytes32,string) view returns (string)",
    "function contenthash(bytes32) view returns (bytes)"
  ],
  getDefaultProvider()
)

export const validateENS = async (
  name: string
): Promise<boolean> => {
  const vvalletProfile = await ensContract.text(namehash(name), "vvallet.me");
  console.log("vvallet.me", vvalletProfile);
  return false
}

// validateProofHasExpectedOwner is used by clients to check that the validated proof has the owner they expect
// this removes some trust in the server
export const validateProofHasExpectedOwner = (
  proofValidation: ProofValidation,
  expectedOwner: string,
): boolean => {
  return proofValidation.owner === expectedOwner
}
