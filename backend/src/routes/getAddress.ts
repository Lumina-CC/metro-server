import { Request, Response } from 'express';
import { sqlp } from '../modules/db';
import { escape } from 'mysql2';
import WalletDetails from '../types/WalletDetails';

export default async (req: Request, res: Response) => {
    const [results] = await sqlp.query(`SELECT wallets.address, wallets.balance, wallets.totalin, wallets.totalout, wallets.firstSeen${(req.query.fetchNames) ? ', COUNT(names.address) AS names' : ''} FROM wallets
    ${(req.query.fetchNames) ? 'RIGHT JOIN names ON wallets.address=names.owner' : ''}
    WHERE ${req.params.address.split(',').map((address) => `address=${escape(address)}`).join(' OR ')};`);

    if (req.path.includes('/lookup/addresses/')) {
        const wallets = results as WalletDetails[];
        const notFound = req.params.address.split(',').length - wallets.length;

        res.status((notFound > 0) ? 206 : 200).send({
            ok: true,
            found: wallets.length,
            notFound,
            addresses: wallets.map((wallet) => {
                return {
                    address: wallet.address,
                    balance: wallet.balance,
                    totalin: wallet.totalin,
                    totalout: wallet.totalout,
                    firstseen: wallet.firstSeen,
                    names: (wallet.names) ? wallet.names : undefined,
                };
            }),
        });

    } else {
        if (results && (results as any[]).length > 0) {
            const wallet = results[0] as WalletDetails;
            
            res.send({
                ok: true,
                address: {
                    address: wallet.address,
                    balance: wallet.balance,
                    totalin: wallet.totalin,
                    totalout: wallet.totalout,
                    firstseen: wallet.firstSeen,
                    names: (req.query.fetchNames) ? wallet.names : undefined,
                },
            });
        } else {
            res.status(404).send({
                ok: false,
                error: 'address_not_found',
            });
        };
    };
};