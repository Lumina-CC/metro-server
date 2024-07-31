import { Request, Response } from 'express';
import { sqlp } from '../modules/db';
import { escape } from 'mysql2';
import WalletDetails from '../types/WalletDetails';

export default async (req: Request, res: Response) => {
    const [results] = await sqlp.query(`SELECT * FROM wallets WHERE address=${escape(req.params.address)};`);

    if (results && (results as any[]).length == 1) {
        const wallet = results[0] as WalletDetails;

        res.send({
            ok: true,
            address: {
                address: wallet.address,
                balance: wallet.balance,
                totalin: wallet.totalin,
                totalout: wallet.totalout,
                firstseen: wallet.firstSeen,
            },
        });
    } else {
        res.status(404).send({
            ok: false,
            error: 'address_not_found',
        });
    };
};