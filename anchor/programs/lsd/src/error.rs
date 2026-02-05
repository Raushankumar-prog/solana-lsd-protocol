use anchor_lang::prelude::*;

#[error_code]
pub enum LsdError {
    #[msg("Calculation error occurred.")]
    CalculationError,
    #[msg("Amount must be greater than zero.")]
    AmountTooSmall,
    #[msg("Insufficient funds for this operation.")]
    InsufficientFunds,
}
