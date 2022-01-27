import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchProofsByOwner, useReadOnlyVVallet } from 'lib/VVallet'
import { OwnerProof, ProofValidation } from 'types/ownerProof'

const connection = useReadOnlyVVallet()

export default async function ownerProofsHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProofValidation>,
) {
  const query = req.query['proof']
  const proof: string = query as string

  switch (req.method) {
    case 'GET':
      const proofValidation: ProofValidation = {
        owner: "me", // TODO: alias
        proof: "TODO",
        valid: false,
        byProxy: true
      } 
      // const resp = await fetchProofsByOwner(connection, owner)
      // TODO: handle not found error here to return 404
      res.status(200).json(proofValidation)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// const validate = async (proof: ValidateProofRequest): Promise<ProofValidation> => {
//   const result: ProofValidation = {
//     proof: proof.proof,
//     valid: false, // assume not valid until proven otherwise
//     byProxy: true
//   }

//   switch (proof.kind) {
//     case 'github':
//       result.valid = true
//       break
//   }

//   return result
// }
