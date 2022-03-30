import { Constants } from "../types/constants"

// get a root link to a profile from a given proof
export const parseProfileLink = (kind: string, proof: string): string => {
  switch (kind) {
    case Constants.TWITTER:
      return twitterProfileFromProof(proof)
  }

  return ''
}

const twitterProfileFromProof = (proof: string): string => {
  const parts = proof.split('/status/')
  return parts[0]
}

export const parseUsername = (kind: string, proof: string): string => {
  switch (kind) {
    case Constants.TWITTER:
      return twitterUsernameFromProof(proof)
    case Constants.ENS:
      return proof
  }

  return ''
}

const TWITTER_USERNAME_REGEX = '(.*twitter.com)/(.*)/(status)'

const twitterUsernameFromProof = (proof: string): string => {
  const groups = proof.match(TWITTER_USERNAME_REGEX)

  if (groups !== null && groups.length >= 3) {
    return groups[2]
  }

  return ''
}
