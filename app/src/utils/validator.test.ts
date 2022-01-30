import { validateTweet } from "./validator"

test('valid proof', async () => {
    const result = await validateTweet("Verifying my decentralized identity: vvallet.me/im/bruce")
    expect(result).toBe(true)
})