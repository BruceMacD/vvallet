import { generateAliasKeypair } from "./crypto"

test('alias key is consistent', async() => {
    const alias = 'bruce'

    const generated = await generateAliasKeypair(alias)

    const regenerated = await generateAliasKeypair(alias)

    expect(generated.publicKey).toEqual(regenerated.publicKey)
})

test('alias key differs based on seed', async() => {
    const generated = await generateAliasKeypair('bruce')
    const regenerated = await generateAliasKeypair('alice')

    expect(generated.publicKey).not.toEqual(regenerated.publicKey)
})