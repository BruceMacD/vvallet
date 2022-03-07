import { IdentityAlias } from 'types/identityAlias'
import { OwnerProof, ProofValidation } from 'types/ownerProof'
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

// validateProofHasExpectedOwner is used by clients to check that the validated proof has the owner they expect
// this removes some trust in the server
export const validateProofHasExpectedOwner = (
  proofValidation: ProofValidation,
  expectedOwner: string,
): boolean => {
  return proofValidation.owner === expectedOwner
}
