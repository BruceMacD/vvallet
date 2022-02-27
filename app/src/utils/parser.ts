// get a root link to a profile from a given proof
export const parseProfileLink = (kind: string, proof: string): string => {
  switch (kind) {
    case 'twitter':
      return twitterProfileFromProof(proof)
  }

  return ''
}

const twitterProfileFromProof = (proof: string): string => {
  const parts = proof.split('/status/')
  console.log(parts)
  return parts[0]
}

export const parseUsername = (kind: string, proof: string): string => {
  switch (kind) {
    case 'twitter':
      return twitterUsernameFromProof(proof)
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
