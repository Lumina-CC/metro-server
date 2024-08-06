import { Request, Response } from 'express';
import { sqlp } from '../modules/db';
import * as crypto from 'node:crypto';
import { escape } from 'mysql2';
import { hashPrivateKey, computeWalletAddress } from '../modules/pkeyconv';

export default async (req: Request, res: Response) => {
    if (!req.body.privatekey) {
        res.status(400).send({
            ok: false,
            authed: false,
            error: 'missing_privatekey',
        });
        return;
    };
    const pkeyhash = hashPrivateKey(req.body.privatekey);

    const [result] = await sqlp.query(`SELECT COUNT(*) FROM wallets WHERE pkeyhash=${escape(pkeyhash)}`);

    if (result[0][Object.keys(result[0])[0]] == 1) {
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