use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("FWs57YWEkULEPu7a3VSUoFQMyatrqoNrDu1CeBwiejQe");

const MAX_ALIAS_LENGTH: usize = 50; // 50 chars * 4 bytes each
const MAX_IPFS_LENGTH: usize = 53; // 50 chars * 4 bytes each

const MAX_PROOF_KIND_LENGTH: usize = 50; // 50 chars * 4 bytes each
const MAX_PROOF_LENGTH: usize = 200; // 200 chars * 4 bytes each

#[program]
pub mod vvallet {
    use super::*;

    // register adds an alias for a specified owner
    pub fn register(ctx: Context<RegisterIdentity>, alias: String) -> ProgramResult {
        let id: &mut Account<Identity> = &mut ctx.accounts.identity;

        // check if alias was already registered
        if id.alias != "" {
            return Err(ErrorCode::AliasNotAvailable.into())
        }

        let alias = alias.trim().to_string();

        if alias.chars().count() == 0 {
            return Err(ErrorCode::AliasRequired.into())
        }

        if alias.chars().count() > MAX_ALIAS_LENGTH {
            return Err(ErrorCode::AliasTooLong.into())
        }

        let owner: &Signer = &ctx.accounts.owner;
        
        id.owner = *owner.key;
        id.alias = alias;

        Ok(())
    }

    pub fn release_identity(_ctx: Context<ReleaseIdentity>) -> ProgramResult {
        // handled by anchor close constraint
        Ok(())
    }

    // addProof creates a proof that can be validated by a client to show account ownership
    pub fn add_proof(ctx: Context<RegisterProof>, kind: String, proof: String) -> ProgramResult {
        let new_proof: &mut Account<Proof> = &mut ctx.accounts.proof;

        let kind = kind.trim().to_string();
        let proof = proof.trim().to_string();

        if kind.chars().count() == 0 {
            return Err(ErrorCode::ProofKindRequired.into())
        }

        if kind.chars().count() > MAX_PROOF_KIND_LENGTH {
            return Err(ErrorCode::ProofKindTooLong.into())
        }

        if proof.chars().count() == 0 {
            return Err(ErrorCode::ProofRequired.into())
        }

        if proof.chars().count() > MAX_PROOF_LENGTH {
            return Err(ErrorCode::ProofTooLong.into())
        }

        let owner: &Signer = &ctx.accounts.owner;
        
        new_proof.owner = *owner.key;
        new_proof.kind = kind;
        new_proof.proof = proof;

        Ok(())
    }

    pub fn release_proof(_ctx: Context<ReleaseProof>) -> ProgramResult {
        // handled by anchor close constraint
        Ok(())
    }
}

const DISCRIMINATOR_SIZE: usize = 8;

const PUBLIC_KEY_SIZE: usize = 32; // the owner of the account/proof
const STRING_LENGTH_PREFIX: usize = 4; // stores the size of the string
const MAX_ALIAS_SIZE: usize = MAX_ALIAS_LENGTH * 4; // max characters * 4 bytes each
const MAX_IPFS_SIZE: usize = MAX_IPFS_LENGTH * 4; // max characters * 4 bytes each

const MAX_PROOF_KIND_SIZE: usize = MAX_PROOF_KIND_LENGTH * 4; // max characters * 4 bytes each
const MAX_PROOF_SIZE: usize = MAX_PROOF_LENGTH * 4; // max characters * 4 bytes each

#[derive(Accounts)]
pub struct RegisterIdentity<'info> {
    #[account(init, payer = owner, space = Identity::LEN)]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReleaseIdentity<'info> {
    #[account(mut, has_one = owner, close = owner)]
    pub identity: Account<'info, Identity>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Identity {
    pub owner: Pubkey,
    pub alias: String, // max size 50 chars, should be validated client-side to match the correct hash
    pub ipfs: String, // not used at this time
}

impl Identity {
    const LEN: usize = DISCRIMINATOR_SIZE
        + PUBLIC_KEY_SIZE // owner
        + STRING_LENGTH_PREFIX + MAX_ALIAS_SIZE // alias
        + STRING_LENGTH_PREFIX + MAX_IPFS_SIZE; // ipfs hash
}

#[derive(Accounts)]
pub struct RegisterProof<'info> {
    #[account(init, payer = owner, space = Proof::LEN)]
    pub proof: Account<'info, Proof>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ReleaseProof<'info> {
    #[account(mut, has_one = owner, close = owner)]
    pub proof: Account<'info, Proof>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Proof {
    pub owner: Pubkey,
    pub kind: String, // max size 50 chars, used by client to validate proof
    pub proof: String, // max size 200 chars, a link to the proof
}

impl Proof {
    const LEN: usize = DISCRIMINATOR_SIZE
        + PUBLIC_KEY_SIZE // owner
        + STRING_LENGTH_PREFIX + MAX_PROOF_KIND_SIZE // kind
        + STRING_LENGTH_PREFIX + MAX_PROOF_SIZE; // proof
}

#[error]
pub enum ErrorCode {
    #[msg("Alias already registered")]
    AliasNotAvailable,
    #[msg("Alias is required")]
    AliasRequired,
    #[msg("Alias has a maximum length of 50 characters")]
    AliasTooLong,
    #[msg("Proof kind is required")]
    ProofKindRequired,
    #[msg("Proof kind has a maximum length of 50 characters")]
    ProofKindTooLong,
    #[msg("Proof is required")]
    ProofRequired,
    #[msg("Proof has a maximum length of 200 characters")]
    ProofTooLong,
}