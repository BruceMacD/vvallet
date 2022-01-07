import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Vvallet } from '../target/types/vvallet';
import * as assert from "assert";
import nacl from 'tweetnacl';

describe('vvallet', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env())

  const program = anchor.workspace.Vvallet as Program<Vvallet>

  it('can register a new identity', async () => {
    var alias = "new_alias"
    var aliasKeys: anchor.web3.Keypair = createAliasKey(alias)

    await program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [aliasKeys], // wallet is automatically added as a signer
    })

    const createdIdentity = await program.account.identity.fetch(aliasKeys.publicKey)

    assert.equal(createdIdentity.owner.toBase58(), program.provider.wallet.publicKey.toBase58())
    assert.equal(createdIdentity.alias, alias)
  })

  it('can register a new alias for a different key if signed by owner', async () => {
    var alias = "register_by_diff_key_signed_alias"
    var aliasKeys: anchor.web3.Keypair = createAliasKey(alias)

    const otherUser = anchor.web3.Keypair.generate()
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(signature)

    await program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [aliasKeys, otherUser], // wallet is automatically added as a signer
    })

    const createdIdentity = await program.account.identity.fetch(aliasKeys.publicKey)

    assert.equal(createdIdentity.owner.toBase58(), otherUser.publicKey.toBase58())
    assert.equal(createdIdentity.alias, alias)
  })

  it('cannot register a new alias for a different key if not signed by owner', async () => {
    try {
      var alias = "register_by_diff_key_unsigned_alias"
      var aliasKeys: anchor.web3.Keypair = createAliasKey(alias)

      const otherUser = anchor.web3.Keypair.generate()
      const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
      await program.provider.connection.confirmTransaction(signature)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })

      const createdIdentity = await program.account.identity.fetch(aliasKeys.publicKey)

      assert.equal(createdIdentity.owner.toBase58(), program.provider.wallet.publicKey.toBase58())
      assert.equal(createdIdentity.alias, alias)

    } catch (err) {
      assert.equal(err.toString(), 'Error: Signature verification failed')
      return
    }

    assert.fail('should not be able to register an alias for a different owner without their signature')
  })

  it('cannot register an existing alias', async () => {
    try {
      var alias = "existing_alias"
      var aliasKeys = createAliasKey(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })

      let differentOwner: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: differentOwner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys, differentOwner], // wallet is automatically added as a signer
      })
    } catch (err) {
      let ok = err.toString().includes('failed to send transaction')
      assert.ok(ok, 'it should not allow an alias already in use')
      return
    }

    assert.fail('it should not be possible to register a duplicate alias')
  })
})

const seedLength = 32

const createAliasKey = function (alias: string): anchor.web3.Keypair {
  let aliasHash: number = cyrb53(alias)

  let seedHash = aliasHash.toString()
  for (let i = seedHash.length; i < seedLength; i++) {
    seedHash += "0"
  }

  var enc = new TextEncoder(); // always utf-8
  var seed: Uint8Array = enc.encode(seedHash)

  if (seed.byteLength != 32) {
    throw 'unexpected alias seed hash byte length, expected 32, but was ' + seed.byteLength
  }

  return anchor.web3.Keypair.fromSeed(seed)
}

// TODO: move somewhere else
const cyrb53 = function (str: string, seed: number = 0): number {
  let h1: number = 0xdeadbeef ^ seed, h2: number = 0x41c6ce57 ^ seed

  for (let i = 0, ch: number; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}
