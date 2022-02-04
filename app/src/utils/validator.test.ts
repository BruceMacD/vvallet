import { Tweet } from "types/tweet"
import { validateTweet } from "./validator"

test('valid proof', async () => {
    const validTweet = "Verifying my @vvalletdotme alias is bruce: http://vvallet.me/im/bruce"
    const tweet: Tweet = {
        authorId: "bruce",
        tweetId: "abc",
        text: validTweet
    }

    const expectedOwner = {
        owner: "some public key value",
        alias: "bruce"
    }

    const result = await validateTweet(tweet, expectedOwner)
    expect(result).toBe(true)
})

test('invalid proof', async () => {
    const invalidTweet = "Verifying my @vvalletdotme alias is alice: http://vvallet.me/im/alice"
    const tweet: Tweet = {
        authorId: "bruce",
        tweetId: "abc",
        text: invalidTweet
    }
    const expectedOwner = {
        owner: "some public key value",
        alias: "bruce"
    }

    const result = await validateTweet(tweet, expectedOwner)
    expect(result).toBe(false)
})

test('invalid proof followed by valid proof', async () => {
    const invalidTweet = "Verifying my @vvalletdotme alias is alice: http://vvallet.me/im/alice Verifying my @vvalletdotme bruce is alice: http://vvallet.me/im/bruce"
    const tweet: Tweet = {
        authorId: "bruce",
        tweetId: "abc",
        text: invalidTweet
    }
    const expectedOwner = {
        owner: "some public key value",
        alias: "bruce"
    }

    const result = await validateTweet(tweet, expectedOwner)
    expect(result).toBe(false)
})

test('valid proof followed by invalid proof', async () => {
    const invalidTweet = "Verifying my @vvalletdotme alias is alice: http://vvallet.me/im/alice Verifying my @vvalletdotme bruce is alice: http://vvallet.me/im/bruce"
    const tweet: Tweet = {
        authorId: "alice",
        tweetId: "abc",
        text: invalidTweet
    }
    const expectedOwner = {
        owner: "some public key value",
        alias: "alice"
    }

    const result = await validateTweet(tweet, expectedOwner)
    expect(result).toBe(false)
})