import { Request, Response } from 'express';
import { computeWalletAddress } from '../modules/pkeyconv';

export default async (req: Request, res: Response) => {
    if (!req.body.privatekey) {
        res.status(400).send({
            ok: false,
            authed: false,
            error: 'missing_privatekey',
        });
        return;
    };

    res.send({
        ok: true,
        address: computeWalletAddress(req.body.privatekey),
    });
};