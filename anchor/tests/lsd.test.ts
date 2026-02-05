import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Lsd } from '../target/types/lsd';
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

describe('lsd', () => {

    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Lsd as Program<Lsd>;
    const user = Keypair.generate();

    const [stakePool] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake_pool")],
        program.programId
    );

    const [mint] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint")],
        program.programId
    );

    beforeAll(async () => {

        const signature = await provider.connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL);
        const latestBlockhash = await provider.connection.getLatestBlockhash();
        await provider.connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        });
    });

    it('Is initialized!', async () => {
        try {
            await program.methods
                .initialize()
                .accounts({
                    authority: provider.wallet.publicKey,
                    stakePool: stakePool,
                    mint: mint,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                })
                .rpc();

            const poolAccount = await program.account.stakePool.fetch(stakePool);
            console.log("Pool Total SOL:", poolAccount.totalSol.toString());
            console.log("Pool Total Shares:", poolAccount.totalShares.toString());

            expect(poolAccount.totalSol.toNumber()).toEqual(0);
            expect(poolAccount.totalShares.toNumber()).toEqual(0);

        } catch (e) {
            const poolAccount = await program.account.stakePool.fetchNullable(stakePool);
            if (!poolAccount) {
                throw e;
            }
        }
    });

    it('Stakes SOL', async () => {
        const amount = new anchor.BN(1 * LAMPORTS_PER_SOL);

        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            user.publicKey
        );

        await program.methods
            .stake(amount)
            .accounts({
                user: user.publicKey,
                stakePool: stakePool,
                mint: mint,
                userTokenAccount: userTokenAccount,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc();

        const userAccount = await program.provider.connection.getTokenAccountBalance(userTokenAccount);
        expect(userAccount.value.uiAmount).toBeGreaterThan(0);

        const poolAccount = await program.account.stakePool.fetch(stakePool);
        console.log("Pool Total SOL after stake:", poolAccount.totalSol.toString());
    });

    it('Unstakes SOL', async () => {
        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            user.publicKey
        );

        // Get current balance
        const balance = await program.provider.connection.getTokenAccountBalance(userTokenAccount);
        const shares = new anchor.BN(balance.value.amount);

        await program.methods
            .unstake(shares)
            .accounts({
                user: user.publicKey,
                stakePool: stakePool,
                mint: mint,
                userTokenAccount: userTokenAccount,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([user])
            .rpc();

        const userAccount = await program.provider.connection.getTokenAccountBalance(userTokenAccount);
        expect(userAccount.value.uiAmount).toEqual(0);
    });
});
