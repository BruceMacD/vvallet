import { parseProfileLink, parseUsername } from './parser'

test('twitter profile from proof link', async () => {
  const proof = 'https://twitter.com/vvalletdotme/status/1488510691359268870'

  const profile = parseProfileLink('twitter', proof)

  expect(profile).toEqual('https://twitter.com/vvalletdotme')
})

test('twitter username from proof link', async () => {
  const proof = 'https://twitter.com/vvalletdotme/status/1488510691359268870'

  const user = parseUsername('twitter', proof)

  expect(user).toEqual('vvalletdotme')
})
