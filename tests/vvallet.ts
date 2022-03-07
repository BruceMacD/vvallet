import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import * as assert from 'assert'
import bs58 from 'bs58'

import { generateAliasKeypair } from '../app/src/utils/crypto'
import { Vvallet } from '../target/types/vvallet'

describe('vvallet', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env())

  // @ts-ignore
  const program = anchor.workspace.Vvallet as Program<Vvallet>

  // identity tests

  it('can register a new identity', async () => {
    let alias = "new_alias"
    let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

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
    let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

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

  it('can look up identity by alias', async () => {
    let alias = "id_by_alias"
    let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

    const ownerKeys = anchor.web3.Keypair.generate()
    const signature = await program.provider.connection.requestAirdrop(ownerKeys.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(signature)

    await program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: ownerKeys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [aliasKeys, ownerKeys], // wallet is automatically added as a signer
    })

    const lookupByAlias = await program.account.identity.all([
      {
        // offset comparator for owner alias
        memcmp: {
          offset:
            8 + // discriminator
            32 + // owner public key
            4, // alias string prefix
          bytes: bs58.encode(Buffer.from(alias)),
        },
      }
    ])

    assert.equal(lookupByAlias.length, 1)

    assert.equal(lookupByAlias[0].account.owner.toBase58(), ownerKeys.publicKey.toBase58())
    assert.equal(lookupByAlias[0].account.alias, alias)
  })

  it('can look up identity by owner public key', async () => {
    let alias = "id_by_owner"
    let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

    const ownerKeys = anchor.web3.Keypair.generate()
    const signature = await program.provider.connection.requestAirdrop(ownerKeys.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(signature)

    await program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: ownerKeys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [aliasKeys, ownerKeys], // wallet is automatically added as a signer
    })

    const lookupByOwner = await program.account.identity.all([
      {
        // offset comparator for owner alias
        memcmp: {
          offset: 8, // discriminator
          bytes: ownerKeys.publicKey.toBase58(),
        },
      }
    ])

    assert.equal(lookupByOwner.length, 1)

    assert.equal(lookupByOwner[0].account.owner.toBase58(), ownerKeys.publicKey.toBase58())
    assert.equal(lookupByOwner[0].account.alias, alias)
  })

  it('cannot register a new alias for a different key if not signed by owner', async () => {
    try {
      let alias = "register_by_diff_key_unsigned_alias"
      let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

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
      let aliasKeys = generateAliasKeypair(alias)

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
      let aliasKeys = generateAliasKeypair(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })
    } catch (err) {
      let ok = err.toString().includes('Alias is required')
      assert.ok(ok, 'it should not allow an empty alias to be registered')
      return
    }

    assert.fail('it should not be possible to register an empty')
  })

  it('cannot register a blank space alias', async () => {
    try {
      let alias = ' '
      let aliasKeys = generateAliasKeypair(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })
    } catch (err) {
      let ok = err.toString().includes('Alias is required')
      assert.ok(ok, 'it should not allow a blank space alias')
      return
    }

    assert.fail('it should not be possible to register a blank space alias')
  })

  it('cannot register an alias that is greater than 50 characters', async () => {
    try {
      let alias = 'x'.repeat(51)
      let aliasKeys = generateAliasKeypair(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })
    } catch (err) {
      let ok = err.toString().includes('Alias has a maximum length of 50 characters')
      assert.ok(ok, 'it should not allow an alias to be greater than 50 characters')
      return
    }

    assert.fail('it should not be possible to register an alias with greater than 50 characters')
  })

  it('can release an identity', async () => {
    // create the identity
    let alias = "alias_to_release"
    let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

    await program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [aliasKeys],
    })

    await program.account.identity.fetch(aliasKeys.publicKey)

    // release the identity
    await program.rpc.releaseIdentity({
      accounts: {
        identity: aliasKeys.publicKey,
        owner: program.provider.wallet.publicKey,
      },
    })

    const identity = await program.account.identity.fetchNullable(aliasKeys.publicKey)
    assert.ok(identity === null)
  })

  it('cannot release someone else\'s identity', async () => {
    let alias = "somones_alias_to_try_release"
    let aliasKeys: anchor.web3.Keypair = generateAliasKeypair(alias)

    const otherUser = anchor.web3.Keypair.generate()
    const airdrop = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(airdrop)

    await program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [aliasKeys, otherUser], // wallet is automatically added as a signer
    })

    await program.account.identity.fetch(aliasKeys.publicKey)

    try {
      await program.rpc.releaseIdentity({
        accounts: {
          identity: aliasKeys.publicKey,
          owner: otherUser.publicKey,
        },
      })
      assert.fail('should not be able to release someone else\'s identity.')
    } catch (error) {
      const notReleased = await program.account.identity.fetch(aliasKeys.publicKey)
      assert.equal(notReleased.alias, alias)
      assert.equal(notReleased.owner.toBase58(), otherUser.publicKey.toBase58())
    }
  })

  // proof tests

  it('can add a new proof', async () => {
    let kind = "github"
    let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
    let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

    await program.rpc.addProof(kind, proof, {
      accounts: {
        proof: proofKeys.publicKey,
        owner: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [proofKeys],
    })

    const createdProof = await program.account.proof.fetch(proofKeys.publicKey)

    assert.equal(createdProof.owner.toBase58(), program.provider.wallet.publicKey.toBase58())
    assert.equal(createdProof.kind, kind)
    assert.equal(createdProof.proof, proof)
  })

  it('can add a new proof for a different key if signed by owner', async () => {
    let kind = "github"
    let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
    let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

    const otherUser = anchor.web3.Keypair.generate()
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(signature)

    await program.rpc.addProof(kind, proof, {
      accounts: {
        proof: proofKeys.publicKey,
        owner: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [proofKeys, otherUser],
    })

    const createdProof = await program.account.proof.fetch(proofKeys.publicKey)

    assert.equal(createdProof.owner.toBase58(), otherUser.publicKey.toBase58())
    assert.equal(createdProof.kind, kind)
    assert.equal(createdProof.proof, proof)
  })

  it('can filter proofs by owner', async () => {
    let kind = "github"
    let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
    let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

    // this key needs to be unique for look up purposes in this test
    let ownerKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()
    const signature = await program.provider.connection.requestAirdrop(ownerKeys.publicKey, 1000000000)
    await program.provider.connection.confirmTransaction(signature)

    await program.rpc.addProof(kind, proof, {
      accounts: {
        proof: proofKeys.publicKey,
        owner: ownerKeys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [proofKeys, ownerKeys],
    })

    const matchingProofs = await program.account.proof.all([
      {
        // offset comparator for owner key
        memcmp: {
          offset: 8, // discriminator
          bytes: ownerKeys.publicKey.toBase58(),
        }
      }
    ])

    assert.equal(matchingProofs.length, 1)
    assert.equal(matchingProofs[0].account.owner.toBase58(), ownerKeys.publicKey.toBase58())
    assert.equal(matchingProofs[0].account.kind, kind)
    assert.equal(matchingProofs[0].account.proof, proof)
  })

  it('cannot add a new proof for a different key if not signed by owner', async () => {
    try {
      let kind = "github"
      let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      const otherUser = anchor.web3.Keypair.generate()
      const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
      await program.provider.connection.confirmTransaction(signature)

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Error: Signature verification failed')
      return
    }

    assert.fail('should not be able to create a proof for a different owner without their signature')
  })

  it('cannot add a new proof with an existing key', async () => {
    try {
      let kind = "github"
      let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })

      await program.account.proof.fetch(proofKeys.publicKey)

      // attempt to re-create
      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      let ok = err.toString().includes('Error processing Instruction')
      assert.ok(ok, 'it should not allow re-creating a proof')
      return
    }

    assert.fail('should not be able to re-create a proof')
  })

  it('cannot add an empty proof kind', async () => {
    try {
      let kind = ""
      let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Proof kind is required')
      return
    }

    assert.fail('should not be able to create a proof with no kind')
  })

  it('cannot add a blank space proof kind', async () => {
    try {
      let kind = ' '
      let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Proof kind is required')
      return
    }

    assert.fail('should not be able to create a proof with a blank space kind')
  })

  it('cannot add a proof kind with greater than 50 characters', async () => {
    try {
      let kind = 'x'.repeat(51)
      let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Proof kind has a maximum length of 50 characters')
      return
    }

    assert.fail('should not be able to create a proof kind with greater than 50 characters')
  })

  it('cannot add an empty proof', async () => {
    try {
      let kind = "github"
      let proof = ""
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Proof is required')
      return
    }

    assert.fail('should not be able to create an empty proof')
  })

  it('cannot add a blank space proof', async () => {
    try {
      let kind = 'github'
      let proof = ' '
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Proof is required')
      return
    }

    assert.fail('should not be able to create a proof with a blank space')
  })

  it('cannot add a proof with greater than 200 characters', async () => {
    try {
      let kind = 'github'
      let proof = 'x'.repeat(201)
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys],
      })
    } catch (err) {
      assert.equal(err.toString(), 'Proof has a maximum length of 200 characters')
      return
    }

    assert.fail('should not be able to create a proof greater than 200 characters')
  })

  it('can release a proof', async () => {
    let kind = "github"
    let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
    let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

    await program.rpc.addProof(kind, proof, {
      accounts: {
        proof: proofKeys.publicKey,
        owner: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [proofKeys],
    })

    await program.account.proof.fetch(proofKeys.publicKey)

    await program.rpc.releaseProof({
      accounts: {
        proof: proofKeys.publicKey,
        owner: program.provider.wallet.publicKey,
      },
    })

    const accountProof = await program.account.proof.fetchNullable(proofKeys.publicKey)
    assert.ok(accountProof === null)
  })

  it('cannot release someone else\'s proof', async () => {
    let kind = "github"
      let proof = "https://gist.github.com/BruceMacD/1234567abcdef"
      let proofKeys: anchor.web3.Keypair = anchor.web3.Keypair.generate()

      const otherUser = anchor.web3.Keypair.generate()
      const airdrop = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000)
      await program.provider.connection.confirmTransaction(airdrop)

      await program.rpc.addProof(kind, proof, {
        accounts: {
          proof: proofKeys.publicKey,
          owner: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [proofKeys, otherUser],
      })

      await program.account.proof.fetch(proofKeys.publicKey)

    try {
      await program.rpc.releaseProof({
        accounts: {
          proof: proofKeys.publicKey,
          owner: otherUser.publicKey,
        },
      })
      assert.fail('should not be able to release someone else\'s proof.')
    } catch (error) {
      const notReleased = await program.account.proof.fetch(proofKeys.publicKey)
      assert.equal(notReleased.owner.toBase58(), otherUser.publicKey.toBase58())
      assert.equal(notReleased.kind, kind)
      assert.equal(notReleased.proof, proof)
    }
  })
})
