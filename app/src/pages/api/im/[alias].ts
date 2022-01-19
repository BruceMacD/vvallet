// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Provider, Program } from '@project-serum/anchor'
import bs58 from 'bs58'

import { fetchIdentities, useReadOnlyVVallet } from 'lib/VVallet'

type Data = {
  name: string
}

const connection = useReadOnlyVVallet()

export default function aliasHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query['alias']
  const alias: string = query as string

  // TODO: testing here
  fetchIdentities(connection)

  switch (req.method) {
    case 'GET':
      res.status(200).json({ name: alias })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
