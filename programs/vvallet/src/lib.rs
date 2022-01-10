use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("CKpJLxvCJkjR7rFngDQm5MXiq1exBvDvcj94usqFJkZ3");

#[program]
pub mod vvallet {
    use super::*;
    pub fn register(ctx: Context<RegisterIdentity>, alias: String) -> ProgramResult {
        let id: &mut Account<Identity> = &mut ctx.accounts.identity;

        // check if alias was already registered
        if id.alias != "" {
            return Err(ErrorCode::AliasNotAvailable.into())
        }

        let owner: &Signer = &ctx.accounts.owner;

        if alias.chars().count() == 0 {
            return Err(ErrorCode::AliasRequired.into())
        }

        if alias.chars().count() > 50 {
            return Err(ErrorCode::AliasTooLong.into())
        }
        
        id.owner = *owner.key;
        id.alias = alias;
        // TODO: IPFS hash

        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterIdentity<'info> {
    #[account(init, payer = owner, space = Identity::LEN)]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[account]
pub struct Identity {
    pub owner: Pubkey,
    pub alias: String, // max size 50 chars, should be validated client-side to match the correct hash
    // TODO: IPFS hash
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string
const MAX_ALIAS_LENGTH: usize = 50 * 4; // 50 chars * 4 bytes each

impl Identity {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH
        + STRING_LENGTH_PREFIX + MAX_ALIAS_LENGTH; // alias
}

#[error]
pub enum ErrorCode {
    #[msg("Alias already registered")]
    AliasNotAvailable,
    #[msg("Alias is required")]
    AliasRequired,
    #[msg("Alias has a maximum length of 50 characters")]
    AliasTooLong,
}