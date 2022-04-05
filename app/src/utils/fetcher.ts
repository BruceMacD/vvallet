import useSWR from 'swr'
import { Contract } from "@ethersproject/contracts"
import { namehash } from "@ethersproject/hash"
import { getDefaultProvider } from "@ethersproject/providers"

import { IdResponse } from 'types/identityAlias'
import {
  OwnerProof,
  ProofsResponse,
  ProofValidation,
  ProofValidationResponse,
  ValidateProofRequest,
} from 'types/ownerProof'
import { Tweet } from 'types/tweet'
import { validateENS, validateReddit } from './validator'
import { Constants } from 'types/constants'
import { RedditSubmission, SubmissionDetails } from 'types/redditSubmission'

export const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url)
  return parseFetcherResponse(res, url)
}

export const authorizedFetcher = async (url: string, token: string): Promise<any> => {
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: 'Bearer ' + token,
    }),
  })

  return parseFetcherResponse(res, url)
}

const parseFetcherResponse = async (res: Response, url: string): Promise<any> => {
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    const info = await res.json()
    ;(error as any).status = res.status

    console.warn(url, '\nAn error occured while fetching:\n', info)

    throw error
  }

  return res.json()
}

// external API fetchers

const ensContract = new Contract(
  "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41", // ENS resolver contract
  [
    "function addr(bytes32,uint256) view returns (bytes)",
    "function text(bytes32,string) view returns (string)",
    "function contenthash(bytes32) view returns (bytes)"
  ],
  getDefaultProvider()
)

export const fetchENSValidation = async (urn: string): Promise<any> => {
  const inputs = urn.split(":")

  const result: ProofValidation = {
    owner: "",
    proof: "",
    valid: false,
    byProxy: false,
    error: '',
  }

  if (inputs.length !== 3) {
    result.error = 'invalid ENS proof URN format, expected exactly 3 parts'
    return result
  }

  const owner = inputs[0]
  const alias = inputs[1]
  const ensAddr = inputs[2]

  result.owner = owner
  result.proof = ensAddr

  const ensDetails = await ensContract.text(namehash(ensAddr), "vvallet.me")
  result.valid = validateENS(ensDetails, alias)

  if (!result.valid) {
    result.error = 'proof ENS did not match the expected format'
  }

  return result
}

// https://twitter.com/${username}/status/${tweet_id}
const TWEET_URL_REGEX = '(.*twitter.com/)(.*)(/status/)([0-9]*)'
const TWEET_URL_GROUPS = 5

export const fetchTweet = async (url: string): Promise<Tweet> => {
  const groups = url.match(TWEET_URL_REGEX)

  let tweetId = ''
  if (groups !== null && groups.length == TWEET_URL_GROUPS) {
    tweetId = groups[4]
  } else {
    throw new Error('unexpected twitter proof URL format')
  }

  const apiUrl = 'https://api.twitter.com/2/tweets/' + tweetId + '?expansions=author_id'

  const token = process.env.TWITTER_BEARER_TOKEN
  if (token === undefined) {
    throw new Error('server twitter api token not configured')
  }

  const resp = await authorizedFetcher(apiUrl, token)

  return {
    authorId: resp.data.author_id,
    tweetId: resp.data.id,
    text: resp.data.text,
  }
}

export const fetchRedditValidation = async (urn: string): Promise<any> => {
  const inputs = urn.split(":")

  const result: ProofValidation = {
    owner: "",
    proof: "",
    valid: false,
    byProxy: false,
    error: '',
  }

  if (inputs.length !== 3) {
    result.error = 'invalid reddit proof URN format, expected exactly 3 parts'
    return result
  }

  const owner = inputs[0]
  const alias = inputs[1]
  const redditLink = inputs[2]

  result.owner = owner
  result.proof = redditLink

  // get the submission
  const redditSubmissions: RedditSubmission[] = await fetcher("https://" + redditLink + ".json")
  const submissionText: string = redditSubmissions[0].data.children[0].data.selftext
  
  // validate the fetched submission
  result.valid = validateReddit(submissionText, alias)

  if (!result.valid) {
    result.error = 'proof reddit post did not match the expected format'
  }

  return result
}

// vvallet API fetchers

export const useIdentity = (id: string): IdResponse => {
  const { data, error } = useSWR(`/api/im/${id}`, fetcher)

  return {
    identity: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useProofs = (owner: string): ProofsResponse => {
  const { data, error } = useSWR(`/api/proofs/${owner}`, fetcher)

  return {
    proofs: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useProofValidator = (proof: OwnerProof, alias: string): ProofValidationResponse => {
  switch (proof.kind) {
    case Constants.ENS:
      // need to stuff the proof and the expected value into the key with a urn, separate with ':'
      let { data: ensData, error: ensError } = useSWR(proof.owner + ":" + alias + ":" + proof.proof, fetchENSValidation)

      return {
        proofValidation: ensData,
        isLoading: !ensError && !ensData,
        error: ensError
      }
    
    case Constants.REDDIT:
      // clean up the proof link to stuff into the URN
      let proofLink = proof.proof

      if (proofLink.startsWith("https://")) {
        proofLink = proofLink.slice("https://".length)
      }

      if (proofLink.startsWith("http://")) {
        proofLink = proofLink.slice("http://".length)
      }

      if (proofLink.endsWith("/")) {
        proofLink = proofLink.slice(0, (proofLink.length - 1 ))
      }

      let { data: redditData, error: redditError } = useSWR(proof.owner + ":" + alias + ":" + proofLink, fetchRedditValidation)

      return {
        proofValidation: redditData,
        isLoading: !redditError && !redditData,
        error: redditError
      }
      
    default:
      // validate by proxy
      let req: ValidateProofRequest = { id: proof.id }
      const { data, error } = useSWR(`/api/${req.id}/valid`, fetcher)

      return {
        proofValidation: data,
        isLoading: !error && !data,
        error: error,
      }
  }
}
