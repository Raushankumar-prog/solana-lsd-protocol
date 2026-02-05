// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import LsdIDL from '../target/idl/lsd.json'
import type { Lsd } from '../target/types/lsd'

// Re-export the generated IDL and type
export { Lsd, LsdIDL }

// The programId is imported from the program IDL.
export const LSD_PROGRAM_ID = new PublicKey(LsdIDL.address)

// This is a helper function to get the Lsd Anchor program.
export function getLsdProgram(provider: AnchorProvider, address?: PublicKey): Program<Lsd> {
    return new Program({ ...LsdIDL, address: address ? address.toBase58() : LsdIDL.address } as Lsd, provider)
}

// This is a helper function to get the program ID for the Lsd program depending on the cluster.
export function getLsdProgramId(cluster: Cluster) {
    switch (cluster) {
        case 'devnet':
        case 'testnet':
            // This is the program ID for the Lsd program on devnet and testnet.
            // You can manually set this after deploying to devnet.
            return new PublicKey('HTzFDPRGYAjwtYqx4ah8VRUCqedbC9dbs66a1k8tyDNh')
        case 'mainnet-beta':
        default:
            return LSD_PROGRAM_ID
    }
}
