import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchIdentitiesByOwner, fetchIdentity, fetchProof, fetchProofsByOwner, useReadOnlyVVallet } from 'lib/VVallet'
import { OwnerProof, ProofValidation } from 'types/ownerProof'
import { authorizedFetcher, fetchTweet } from 'utils/fetcher'

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
      // TODO: need to specify alias in path
      const expectedOwner = await fetchIdentitiesByOwner(connection, toValidate.owner)
      // validate the proof
      const result: ProofValidation = await validate(toValidate)
      // TODO: handle not found error here to return 404
      res.status(200).json(result)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const validate = async (proof: OwnerProof): Promise<ProofValidation> => {
  const result: ProofValidation = {
    owner: proof.owner,
    proof: proof.proof,
    valid: false, // assume not valid until proven otherwise
    byProxy: true // always true if validating the proof using the API
  }

  console.log(proof)

  switch (proof.kind) {
    case 'twitter':
      const tweet = await fetchTweet("https://api.twitter.com/2/tweets/20?expansions=author_id")
      console.log(tweet)
      break
  }

  return result
}
