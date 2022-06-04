import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchAllIdentities, useReadOnlyVVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'

const connection = useReadOnlyVVallet()

export default async function identityHandler(
  req: NextApiRequest,
  res: NextApiResponse<IdentityAlias[]>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const identities = await fetchAllIdentities(connection)
        res.status(200).json(identities)
      } catch (err: any) {
        res.status(500).end(err.message)
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
