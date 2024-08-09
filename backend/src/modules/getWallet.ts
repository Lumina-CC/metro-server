import { escape } from 'mysql2';
import WalletDetails from '../types/WalletDetails';
import { sqlp } from './db';
import { computeWalletAddress, hashPrivateKey } from './pkeyconv';

export async function getWallet(pkey: string): Promise<WalletDetails | null> {
    if (pkey.length != 192) return null;

    const [walletsres] = await sqlp.query(`SELECT * FROM wallets WHERE address=${escape(computeWalletAddress(pkey))};`);
    const wallets = walletsres as WalletDetails[];

    if (wallets.length === 1) {
        const wallet = wallets[0];
        if (wallet.locked) {
            return null;
        };

        if (wallet.pkeyhash === hashPrivateKey(pkey)) {
            return wallet;
        } else {
            return null;
        };
    } else if (wallets.length === 0) {
        await sqlp.query(`INSERT INTO wallets (address, pkeyhash) VALUES (${escape(computeWalletAddress(pkey))}, ${escape(hashPrivateKey(pkey))});`);
        const [walletsres2] = await sqlp.query(`SELECT * FROM wallets WHERE address=${escape(computeWalletAddress(pkey))};`);
        return (walletsres as WalletDetails[])[0];
    };

    return null;
};