import { Constants } from '../types/constants'
import { parseProfileLink, parseUsername } from './parser'

test('website from DNS proof link', async () => {
  const proof = 'example.com'

  const profile = parseProfileLink(Constants.DNS, proof)

  expect(profile).toEqual('https://example.com')
})

test('reddit profile from proof link', async () => {
  const proof = 'example.com'

  const profile = parseProfileLink(Constants.DNS, proof)

  expect(profile).toEqual('https://example.com')
})

test('twitter profile from proof link', async () => {
  const proof = 'https://www.reddit.com/user/bmacd1/comments/tvc57p/vvalletme_proof/'

  const profile = parseProfileLink(Constants.REDDIT, proof)

  expect(profile).toEqual('https://reddit.com/user/bmacd1')
})

test('mastdon username from proof link', async () => {
  const proof = 'https://mastodon.social/@bmacd/108121125227719604'

  const user = parseUsername(Constants.MASTODON, proof)

  expect(user).toEqual('bmacd')
})

test('reddit username from proof link', async () => {
  const proof = 'https://www.reddit.com/user/bmacd1/comments/tvc57p/vvalletme_proof/'

  const user = parseUsername(Constants.REDDIT, proof)

  expect(user).toEqual('bmacd1')
})

test('twitter username from proof link', async () => {
  const proof = 'https://twitter.com/vvalletdotme/status/1488510691359268870'

  const user = parseUsername(Constants.TWITTER, proof)

  expect(user).toEqual('vvalletdotme')
})
