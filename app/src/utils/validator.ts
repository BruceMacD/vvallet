import { IdentityAlias } from 'types/identityAlias'
import { ProofValidation } from 'types/ownerProof'
import { Tweet } from 'types/tweet'

const PROFILE_LINK_REGEX = '(vvallet.me\/im\/)(.*)'
const PROFILE_LINK_GROUPS = 3

const TWEET_REGEX = '(Verifying my @vvalletdotme alias is )(.*)(: )'
const TWEET_GROUPS = 4

const validate = (proof: string, expectedOwner: string, expectedPattern: string, expectedGroups: number, aliasIndex: number): boolean => {
  const groups = proof.match(expectedPattern)
  
  if (groups !== null && groups.length === expectedGroups) {
    const claimedAlias = groups[aliasIndex]

    if (claimedAlias === expectedOwner) {
      return true
    }
  }

  return false
}

export const validateENS = (
  vvalletProfileLink: string,
  expectedOwner: string
): boolean => {
  return validate(vvalletProfileLink, expectedOwner, PROFILE_LINK_REGEX, PROFILE_LINK_GROUPS, 2)
}

export const validateTweet = async (
  tweet: Tweet,
  expectedOwner: IdentityAlias,
): Promise<boolean> => {
  return validate(tweet.text, expectedOwner.alias, TWEET_REGEX, TWEET_GROUPS, 2)
}

// validateProofHasExpectedOwner is used by clients to check that the validated proof has the owner they expect
// this removes some trust in the server
export const validateProofHasExpectedOwner = (
  proofValidation: ProofValidation,
  expectedOwner: string,
): boolean => {
  return proofValidation.owner === expectedOwner
}
