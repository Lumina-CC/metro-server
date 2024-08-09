import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import { validateName } from '../modules/nameValidator';
import { computeWalletAddress, hashPrivateKey } from '../modules/pkeyconv';
import WalletDetails from '../types/WalletDetails';
import NameDetails from '../types/NameDetails';
import { getWallet } from '../modules/getWallet';

export default async (req: Request, res: Response) => {
    if (!req.body.privatekey) {
        res.status(400).send({
            ok: false,
            authed: false,
            error: 'missing_privatekey',
        });
        return;
    };

    const namevalid = validateName(req.params.name);
    if (!namevalid.ok) {
        res.status(406).send({
            ok: false,
            error: 'invalid_name',
            reason: namevalid.reason,
        });
        return;
    };

    const [takenres] = await sqlp.query(`SELECT * FROM names WHERE address=${escape(req.params.name)};`);
    const taken = takenres as NameDetails[];

    if (taken.length > 0) {
        res.status(409).send({
            ok: false,
            error: 'name_taken',
        });
        return;
    };
    
    const walletinfo = await getWallet(req.body.privatekey);

    if (walletinfo) {
        if (walletinfo.balance < 500) {
            res.status(402).send({
                ok: false,
                error: 'insufficient_funds',
            });
            return;
        };

        const id = crypto.randomUUID();

        await sqlp.query(`
            INSERT INTO names (address, owner, original_owner) VALUES (${escape(req.params.name)}, ${escape(walletinfo.address)}, ${escape(walletinfo.address)});
            INSERT INTO namehistory (uuid, address, wallet_to, type) VALUES (${escape(id)}, ${escape(req.params.name)}, ${escape(walletinfo.address)}, 'purchase');
            INSERT INTO transactions (uuid, amount, wallet_to, wallet_from, type, state) VALUES (${escape(id)}, 500, ${escape(process.env.MASTERWALLET)}, ${escape(walletinfo.address)}, 'name_purchase', 'completed');
            UPDATE wallets SET balance = balance + 500, totalin = totalin + 500 WHERE address=${escape(process.env.MASTERWALLET)};
            UPDATE wallets SET balance = balance - 500, totalout = totalout - 500 WHERE address=${escape(walletinfo.address)};
        `);

        res.status(204).send({
            ok: true,
        });

    } else {
        res.status(401).send({
            ok: false,
            error: 'key_not_authorized',
        });
    };
};