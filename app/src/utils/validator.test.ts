import { Tweet } from 'types/tweet'
import { validateENS, validateTweet } from './validator'

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
