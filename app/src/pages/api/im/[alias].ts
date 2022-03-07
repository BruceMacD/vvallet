import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchIdentity, useReadOnlyVVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'

const connection = useReadOnlyVVallet()

export default async function aliasHandler(
  req: NextApiRequest,
  res: NextApiResponse<IdentityAlias>,
) {
  const query = req.query['alias']
  const alias: string = query as string

  switch (req.method) {
    case 'GET':
      try {
        const idAlias = await fetchIdentity(connection, alias)
        res.status(200).json(idAlias)
      } catch (err: any) {
        if (err.message.includes('Account does not exist')) {
          res.status(404).end(err.message)
        } else {
          res.status(500).end(err.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
