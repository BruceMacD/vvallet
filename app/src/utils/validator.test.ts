import { MastodonProof } from 'types/mastodonProof'
import { Tweet } from 'types/tweet'
import { validateDNS, validateENS, validateMastodon, validateReddit, validateTweet } from './validator'

test('valid dns proof', async () => {
  const validDNSProof = '"vvallet.me/im/bruce"'
  const expectedOwner = 'bruce'

  const result = validateDNS(validDNSProof, expectedOwner)
  expect(result).toBe(true)
})

test('invalid dns proof, no quotes', async () => {
  const validDNSProof = 'vvallet.me/im/bruce'
  const expectedOwner = 'bruce'

  const result = validateDNS(validDNSProof, expectedOwner)
  expect(result).toBe(false)
})

test('invalid dns proof, wrong alias', async () => {
  const validDNSProof = 'vvallet.me/im/alice'
  const expectedOwner = 'bruce'

  const result = validateDNS(validDNSProof, expectedOwner)
  expect(result).toBe(false)
})

test('valid ens proof', async () => {
  const validENSProof = 'vvallet.me/im/bruce'
  const expectedOwner = 'bruce'

  const result = validateENS(validENSProof, expectedOwner)
  expect(result).toBe(true)
})

test('invalid ens proof', async () => {
  const validENSProof = 'vvallet.me/im/bob'
  const expectedOwner = 'bruce'

  const result = validateENS(validENSProof, expectedOwner)
  expect(result).toBe(false)
})

test('invalid ens proof followed by valid ens proof', async () => {
  const validENSProof = 'vvallet.me/im/bob vvallet.me/im/bruce'
  const expectedOwner = 'bruce'

  const result = validateENS(validENSProof, expectedOwner)
  expect(result).toBe(false)
})

test('valid ens proof followed by invalid ens proof', async () => {
  const validENSProof = 'vvallet.me/im/bruce vvallet.me/im/bob'
  const expectedOwner = 'bruce'

  const result = validateENS(validENSProof, expectedOwner)
  expect(result).toBe(false)
})

test('valid mastodon proof', async () => {
  const mastodonProof: MastodonProof = {
    username: 'bmacd',
    content: '<p>Verifying my @vvalletdotme alias is bruce: vvallet.me/im/bruce</p>'
  }

  const expectedOwner = {
    owner: 'some public key value',
    alias: 'bruce',
  }

  const result = await validateMastodon(mastodonProof, expectedOwner)
  expect(result).toBe(true)
})

test('invalid mastodon proof', async () => {
  const mastodonProof: MastodonProof = {
    username: 'bmacd',
    content: '<p>Verifying my @vvalletdotme alias is bob: vvallet.me/im/bob</p>'
  }

  const expectedOwner = {
    owner: 'some public key value',
    alias: 'bruce',
  }

  const result = await validateMastodon(mastodonProof, expectedOwner)
  expect(result).toBe(false)
})

test('valid reddit proof with link', async () => {
  const validPost = 'This post connects my Reddit account to my decentralized identity: [vvallet.me/im/bruce](https://vvallet.me/im/bruce)'
  const expectedOwner = 'bruce'

  const result = await validateReddit(validPost, expectedOwner)
  expect(result).toBe(true)
})

test('valid reddit proof with no link', async () => {
  const validPost = 'This post connects my Reddit account to my decentralized identity: vvallet.me/im/bruce'
  const expectedOwner = 'bruce'

  const result = await validateReddit(validPost, expectedOwner)
  expect(result).toBe(true)
})

test('invalid reddit proof', async () => {
  const invalidPost = 'This post connects my Reddit account to my decentralized identity: vvallet.me/im/bob'
  const expectedOwner = 'bruce'

  const result = await validateReddit(invalidPost, expectedOwner)
  expect(result).toBe(false)
})

test('invalid reddit proof link', async () => {
  const invalidPost = 'This post connects my Reddit account to my decentralized identity: [vvallet.me/im/bob](https://vvallet.me/im/bruce)'
  const expectedOwner = 'bruce'

  const result = await validateReddit(invalidPost, expectedOwner)
  expect(result).toBe(false)
})

test('valid twitter proof', async () => {
  const validTweet =
    'Verifying my @vvalletdotme alias is bruce: http://vvallet.me/im/bruce'
  const tweet: Tweet = {
    authorId: 'bruce',
    tweetId: 'abc',
    text: validTweet,
  }

  const expectedOwner = {
    owner: 'some public key value',
    alias: 'bruce',
  }

  const result = await validateTweet(tweet, expectedOwner)
  expect(result).toBe(true)
})

test('invalid twitter proof', async () => {
  const invalidTweet =
    'Verifying my @vvalletdotme alias is alice: http://vvallet.me/im/alice'
  const tweet: Tweet = {
    authorId: 'bruce',
    tweetId: 'abc',
    text: invalidTweet,
  }
  const expectedOwner = {
    owner: 'some public key value',
    alias: 'bruce',
  }

  const result = await validateTweet(tweet, expectedOwner)
  expect(result).toBe(false)
})

test('invalid twitter proof followed by valid proof', async () => {
  const invalidTweet =
    'Verifying my @vvalletdotme alias is alice: http://vvallet.me/im/alice Verifying my @vvalletdotme bruce is alice: http://vvallet.me/im/bruce'
  const tweet: Tweet = {
    authorId: 'bruce',
    tweetId: 'abc',
    text: invalidTweet,
  }
  const expectedOwner = {
    owner: 'some public key value',
    alias: 'bruce',
  }

  const result = await validateTweet(tweet, expectedOwner)
  expect(result).toBe(false)
})

test('valid twitter proof followed by invalid proof', async () => {
  const invalidTweet =
    'Verifying my @vvalletdotme alias is alice: http://vvallet.me/im/alice Verifying my @vvalletdotme bruce is alice: http://vvallet.me/im/bruce'
  const tweet: Tweet = {
    authorId: 'alice',
    tweetId: 'abc',
    text: invalidTweet,
  }
  const expectedOwner = {
    owner: 'some public key value',
    alias: 'alice',
  }

  const result = await validateTweet(tweet, expectedOwner)
  expect(result).toBe(false)
})
