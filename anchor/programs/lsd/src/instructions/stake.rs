use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [STAKE_POOL_SEED], bump = stake_pool.bump)]
    pub stake_pool: Account<'info, StakePool>,

    #[account(mut, seeds = [MINT_SEED], bump)]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn process_stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
    let shares = {
        let stake_pool = &ctx.accounts.stake_pool;
        if stake_pool.total_shares == 0 || stake_pool.total_sol == 0 {
            amount
        } else {
            (amount as u128)
                .checked_mul(stake_pool.total_shares as u128)
                .ok_or(LsdError::CalculationError)?
                .checked_div(stake_pool.total_sol as u128)
                .ok_or(LsdError::CalculationError)? as u64
        }
    };

    if shares == 0 {
        return err!(LsdError::AmountTooSmall);
    }

    let system_program = &ctx.accounts.system_program;
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.user.to_account_info(),
        to: ctx.accounts.stake_pool.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(system_program.to_account_info(), cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, amount)?;

    let token_program = &ctx.accounts.token_program;
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.stake_pool.to_account_info(),
    };
    let seeds = &[
        STAKE_POOL_SEED,
        &[ctx.accounts.stake_pool.bump],
    ];
    let signer = &[&seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(token_program.to_account_info(), cpi_accounts, signer);
    token::mint_to(cpi_ctx, shares)?;

    let stake_pool = &mut ctx.accounts.stake_pool;
    stake_pool.total_sol = stake_pool.total_sol.checked_add(amount).ok_or(LsdError::CalculationError)?;
    stake_pool.total_shares = stake_pool.total_shares.checked_add(shares).ok_or(LsdError::CalculationError)?;

    Ok(())
}
