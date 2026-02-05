use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod state;
pub mod instructions;

use instructions::*;

declare_id!("HTzFDPRGYAjwtYqx4ah8VRUCqedbC9dbs66a1k8tyDNh");

#[program]
pub mod lsd {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::process_initialize(ctx)
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        instructions::stake::process_stake(ctx, amount)
    }

    pub fn unstake(ctx: Context<Unstake>, shares: u64) -> Result<()> {
        instructions::unstake::process_unstake(ctx, shares)
    }

    pub fn distribute_rewards(ctx: Context<DistributeRewards>, amount: u64) -> Result<()> {
        instructions::distribute_rewards::process_distribute_rewards(ctx, amount)
    }
}
