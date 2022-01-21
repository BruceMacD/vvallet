import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchIdentity, useReadOnlyVVallet } from 'lib/VVallet'
import { IdentityAlias } from 'types/identityAlias'

const connection = useReadOnlyVVallet()

export default async function aliasHandler(
  req: NextApiRequest,
  res: NextApiResponse<IdentityAlias>,
) {
  const query = req.query['alias']
  const alias: string = query as string

  const idAlias = await fetchIdentity(connection, alias)

  switch (req.method) {
    case 'GET':
      // TODO: handle not found error here to return 404
      res.status(200).json(idAlias)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
