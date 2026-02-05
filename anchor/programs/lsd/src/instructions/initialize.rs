use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        seeds = [STAKE_POOL_SEED],
        bump,
        space = 8 + StakePool::INIT_SPACE
    )]
    pub stake_pool: Account<'info, StakePool>,

    #[account(
        init,
        payer = authority,
        seeds = [MINT_SEED],
        bump,
        mint::decimals = 9,
        mint::authority = stake_pool,
    )]
    pub mint: Account<'info, Mint>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn process_initialize(ctx: Context<Initialize>) -> Result<()> {
    let stake_pool = &mut ctx.accounts.stake_pool;
    stake_pool.total_sol = 0;
    stake_pool.total_shares = 0;
    stake_pool.authority = ctx.accounts.authority.key();
    stake_pool.mint = ctx.accounts.mint.key();
    stake_pool.bump = ctx.bumps.stake_pool;
    Ok(())
}
