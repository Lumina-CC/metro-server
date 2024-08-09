import { Request, Response } from 'express';
import { sqlp } from '../modules/db';
import * as crypto from 'node:crypto';
import { escape } from 'mysql2';
import { hashPrivateKey, computeWalletAddress } from '../modules/pkeyconv';
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
    
    const walletinfo = await getWallet(req.body.privatekey);

    if (walletinfo) {
        const address = computeWalletAddress(req.body.privatekey);
        res.send({
            ok: true,
            authed: true,
            address,
        });
    } else {
        res.send({
            ok: true,
            authed: false,
        });
    };
};