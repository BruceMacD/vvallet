import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchProofsByOwner, useReadOnlyVVallet } from 'contexts/VVallet'
import { OwnerProof } from 'types/ownerProof'

const connection = useReadOnlyVVallet()

export default async function ownerProofHandler(
  req: NextApiRequest,
  res: NextApiResponse<OwnerProof[]>,
) {
  const query = req.query['owner']
  const owner: string = query as string

  switch (req.method) {
    case 'GET':
      const resp: OwnerProof[] = await fetchProofsByOwner(connection, owner)
      res.status(200).json(resp)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
