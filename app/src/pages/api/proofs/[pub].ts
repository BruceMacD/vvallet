import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchProof, useReadOnlyVVallet } from 'contexts/VVallet'
import { OwnerProof } from 'types/ownerProof'

const connection = useReadOnlyVVallet()

export default async function proofsHandler(
  req: NextApiRequest,
  res: NextApiResponse<OwnerProof>,
) {
  const query = req.query['pub'] // the public key that the proof is registered with
  const publicKey: string = query as string

  switch (req.method) {
    case 'GET':
      try {
        const proof = await fetchProof(connection, publicKey)
        res.status(200).json(proof)
      } catch (err: any) {
          console.log(err)
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
