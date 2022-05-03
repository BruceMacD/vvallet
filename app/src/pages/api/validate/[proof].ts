import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchIdentitiesByOwner, fetchProof, useReadOnlyVVallet } from 'contexts/VVallet'
import { OwnerProof, ProofValidation } from 'types/ownerProof'
import { fetchMastodonPost, fetchTweet } from 'utils/fetcher'
import { IdentityAlias } from 'types/identityAlias'
import { validateMastodon, validateTweet } from 'utils/validator'
import { Constants } from 'types/constants'

const connection = useReadOnlyVVallet()

export default async function ownerProofsHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProofValidation>,
) {
  const query = req.query['proof']
  const proof: string = query as string // public key of the proof account to validate

  switch (req.method) {
    case 'GET':
      // get proof for specifed ID
      const toValidate = await fetchProof(connection, proof)

      const expectedOwners = await fetchIdentitiesByOwner(connection, toValidate.owner)

      if (expectedOwners.length == 0) {
        res.status(404).end(`Owner for ${proof} not found`)
      }

      if (expectedOwners.length > 1) {
        res.status(500).end(`Multiple identities found for ${proof} owner`)
      }

      try {
        const result: ProofValidation = await validate(toValidate, expectedOwners[0])
        res.status(200).json(result)
      } catch (err: any) {
        const result: ProofValidation = {
          owner: toValidate.owner,
          proof: toValidate.proof,
          valid: false, // assume not valid until proven otherwise
          byProxy: true, // always true if validating the proof using the API
          error: err.message,
        }
        res.status(200).json(result)
      }

      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const validate = async (
  proof: OwnerProof,
  expectedOwner: IdentityAlias,
): Promise<ProofValidation> => {
  const result: ProofValidation = {
    owner: proof.owner,
    proof: proof.proof,
    valid: false, // assume not valid until proven otherwise
    byProxy: true, // always true if validating the proof using the API
    error: '',
  }

  switch (proof.kind) {
    case Constants.MASTODON:
      const post = await fetchMastodonPost(proof.proof)
      result.valid = await validateMastodon(post, expectedOwner)

      if (!result.valid) {
        result.error = 'mastodon proof did not match the expected format'
      }

      break
    case Constants.TWITTER:
      const tweet = await fetchTweet(proof.proof)
      result.valid = await validateTweet(tweet, expectedOwner)

      if (!result.valid) {
        result.error = 'proof tweet did not match the expected format'
      }

      break
  }

  return result
}
