use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakePool {
    pub authority: Pubkey,
    pub total_sol: u64,
    pub total_shares: u64,
    pub mint: Pubkey,
    pub bump: u8,
}
