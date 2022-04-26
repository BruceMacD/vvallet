import { Constants } from "../types/constants"

// get a root link to a profile from a given proof
export const parseProfileLink = (kind: string, proof: string): string => {
  switch (kind) {
    case Constants.DNS:
      return "https://" + getFormattedProofLink(proof)
    case Constants.REDDIT:
      return redditProfileFromProof(proof)
    case Constants.TWITTER:
      return twitterProfileFromProof(proof)
  }

  return ''
}

const redditProfileFromProof = (proof: string): string => {
  return "https://reddit.com/user/" + redditUsernameFromProof(proof)
}

const twitterProfileFromProof = (proof: string): string => {
  const parts = proof.split('/status/')
  return parts[0]
}

export const parseUsername = (kind: string, proof: string): string => {
  switch (kind) {
    case Constants.DNS:
      return proof
    case Constants.ENS:
      return proof
    case Constants.MASTODON:
      return mastodonUsernameFromProof(proof)
    case Constants.REDDIT:
      return redditUsernameFromProof(proof)
    case Constants.TWITTER:
      return twitterUsernameFromProof(proof)
  }

  return ''
}

const MASTODON_USERNAME_REGEX = '(.*mastodon.social\/web\/@)(.*)\/(.*)'

const mastodonUsernameFromProof = (proof: string): string => {
  const groups = proof.match(MASTODON_USERNAME_REGEX)

  if (groups !== null && groups.length >= 3) {
    return groups[2]
  }

  return ''
}

const REDDIT_USERNAME_REGEX = '(.*reddit.com\/user)\/(.*)\/comments'

const redditUsernameFromProof = (proof: string): string => {
  const groups = proof.match(REDDIT_USERNAME_REGEX)

  if (groups !== null && groups.length >= 3) {
    return groups[2]
  }

  return ''
}

const TWITTER_USERNAME_REGEX = '(.*twitter.com)\/(.*)\/(status)'

const twitterUsernameFromProof = (proof: string): string => {
  const groups = proof.match(TWITTER_USERNAME_REGEX)

  if (groups !== null && groups.length >= 3) {
    return groups[2]
  }

  return ''
}

// parseFormattdProofLink returns a URL in a standard expected format without protocol or trailing slashes
export const getFormattedProofLink = (proofLink: string): string => {
  if (proofLink.startsWith("https://")) {
    proofLink = proofLink.slice("https://".length)
  }

  if (proofLink.startsWith("http://")) {
    proofLink = proofLink.slice("http://".length)
  }

  if (proofLink.endsWith("/")) {
    proofLink = proofLink.slice(0, (proofLink.length - 1 ))
  }

  return proofLink
}
