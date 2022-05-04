import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchIdentitiesByOwner, useReadOnlyVVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'

const connection = useReadOnlyVVallet()

export default async function keyIdentitiesHandler(
  req: NextApiRequest,
  res: NextApiResponse<IdentityAlias[]>,
) {
  const query = req.query['pub'] // the public key to look up the identity for
  const publicKey: string = query as string

  switch (req.method) {
    case 'GET':
      const identities = await fetchIdentitiesByOwner(connection, publicKey)
      res.status(200).json(identities)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
