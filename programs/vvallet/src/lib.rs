use anchor_lang::prelude::*;

declare_id!("CKpJLxvCJkjR7rFngDQm5MXiq1exBvDvcj94usqFJkZ3");

#[program]
pub mod vvallet {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
