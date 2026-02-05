use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;
use crate::error::*;

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(mut, seeds = [STAKE_POOL_SEED], bump = stake_pool.bump)]
    pub stake_pool: Account<'info, StakePool>,

    pub system_program: Program<'info, System>,
}

pub fn process_distribute_rewards(ctx: Context<DistributeRewards>, amount: u64) -> Result<()> {
    let system_program = &ctx.accounts.system_program;
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.admin.to_account_info(),
        to: ctx.accounts.stake_pool.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(system_program.to_account_info(), cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, amount)?;

    let stake_pool = &mut ctx.accounts.stake_pool;
    stake_pool.total_sol = stake_pool.total_sol.checked_add(amount).ok_or(LsdError::CalculationError)?;

    Ok(())
}
