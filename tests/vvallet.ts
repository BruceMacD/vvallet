import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Vvallet } from '../target/types/vvallet'
import * as assert from "assert"
import { createHash } from "crypto"

describe('vvallet', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env())

  const program = anchor.workspace.Vvallet as Program<Vvallet>

  it('can register a new identity', async () => {
    let alias = "new_alias"
    let aliasKeys: anchor.web3.Keypair = createAliasKey(alias)

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
    let alias = "register_by_diff_key_signed_alias"
    let aliasKeys: anchor.web3.Keypair = createAliasKey(alias)

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
      let alias = "register_by_diff_key_unsigned_alias"
      let aliasKeys: anchor.web3.Keypair = createAliasKey(alias)

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
      let alias = "existing_alias"
      let aliasKeys = createAliasKey(alias)

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

  it('cannot register an empty alias', async () => {
    try {
      let alias = ""
      let aliasKeys = createAliasKey(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })
    } catch (err) {
      console.log(err)
      let ok = err.toString().includes('Alias is required')
      assert.ok(ok, 'it should not allow an empty alias to be registered')
      return
    }

    assert.fail('it should not be possible to register an empty')
  })

  it('cannot register an an alias that is greater than 50 characters', async () => {
    try {
      let alias = 'x'.repeat(51)
      let aliasKeys = createAliasKey(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })
    } catch (err) {
      console.log(err)
      let ok = err.toString().includes('Alias has a maximum length of 50 characters')
      assert.ok(ok, 'it should not allow an alias to be greater than 50 characters')
      return
    }

    assert.fail('it should not be possible to register an alias with greater than 50 characters')
  })
})

const createAliasKey = function (alias: string): anchor.web3.Keypair {
  let hash: Uint8Array = createHash("sha256").update(alias).digest()
  return anchor.web3.Keypair.fromSeed(hash)
}
