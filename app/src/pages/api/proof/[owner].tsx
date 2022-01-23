import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchProofsByOwner, useReadOnlyVVallet } from 'lib/VVallet'
import { IdentityAlias, OwnerProof } from 'types/identityAlias'

const connection = useReadOnlyVVallet()

export default async function ownerProofsHandler(
  req: NextApiRequest,
  res: NextApiResponse<OwnerProof>,
) {
  const query = req.query['owner']
  const owner: string = query as string

  console.log(owner)
  //   switch (req.method) {
  //     case 'GET':
  //       const idAlias = await fetchIdentity(connection, alias)
  //       // TODO: handle not found error here to return 404
  //       res.status(200).json(idAlias)
  //       break
  //     default:
  //       res.setHeader('Allow', ['GET'])
  //       res.status(405).end(`Method ${req.method} Not Allowed`)
  //   }
}
