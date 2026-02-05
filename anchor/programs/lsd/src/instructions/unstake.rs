use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Burn};
use crate::state::*;
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [STAKE_POOL_SEED], bump = stake_pool.bump)]
    pub stake_pool: Account<'info, StakePool>,

    #[account(mut, seeds = [MINT_SEED], bump)]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn process_unstake(ctx: Context<Unstake>, shares: u64) -> Result<()> {
    let token_program = &ctx.accounts.token_program;
    let cpi_accounts = Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(token_program.to_account_info(), cpi_accounts);
    token::burn(cpi_ctx, shares)?;

    let (amount_to_return, _) = {
            let stake_pool = &ctx.accounts.stake_pool;
            let amount = (shares as u128)
            .checked_mul(stake_pool.total_sol as u128)
            .ok_or(LsdError::CalculationError)?
            .checked_div(stake_pool.total_shares as u128)
            .ok_or(LsdError::CalculationError)? as u64;
            (amount, stake_pool.bump)
    };

    {
        let stake_pool = &mut ctx.accounts.stake_pool;
        stake_pool.total_sol = stake_pool.total_sol.checked_sub(amount_to_return).ok_or(LsdError::CalculationError)?;
        stake_pool.total_shares = stake_pool.total_shares.checked_sub(shares).ok_or(LsdError::CalculationError)?;
    }

    let stake_pool_info = ctx.accounts.stake_pool.to_account_info();
    let user_info = ctx.accounts.user.to_account_info();
    
    **stake_pool_info.try_borrow_mut_lamports()? -= amount_to_return;
    **user_info.try_borrow_mut_lamports()? += amount_to_return;

    Ok(())
}
