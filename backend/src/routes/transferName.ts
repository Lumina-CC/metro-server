import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import { getWallet } from '../modules/getWallet';
import NameDetails from '../types/NameDetails';
import * as crypto from 'node:crypto';
import WalletDetails from '../types/WalletDetails';

export default async (req: Request, res: Response) => {
    if (!req.body.privatekey) {
        res.status(400).send({
            ok: false,
            error: 'missing_privatekey',
        });
        return;
    };
    if (!req.body.address) {
        res.status(400).send({
            ok: false,
            error: 'missing_address',
        });
        return;
    };

    const walletinfo = await getWallet(req.body.privatekey);

    if (walletinfo) {
        const [nameresults] = await sqlp.query(`SELECT * FROM names WHERE address=${escape(req.params.name)};`);
        const names = nameresults as NameDetails[];
        
        if (names.length != 1) {
            res.status(404).send({
                ok: false,
                error: 'name_not_found',
            });
            return;
        };

        const name = names[0];
        if (name.owner != walletinfo.address) {
            res.status(401).send({
                ok: false,
                error: 'not_name_owner',
            });
            return;
        };

        if (walletinfo.address == req.body.address) {
            res.status(422).send({
                ok: false,
                error: 'source_and_dest_identical',
            });
            return;
        };

        const [walletresults] = await sqlp.query(`SELECT * FROM wallets WHERE address=${escape(req.body.address)};`);
        const walletrecords = walletresults as WalletDetails[];

        if (walletrecords.length == 0) {
            res.status(422).send({
                ok: false,
                error: 'wallet_not_created',
            });
            return;
        };


        const id = crypto.randomUUID();

        await sqlp.query(`UPDATE names SET owner=${escape(req.body.address)}, transferred=CURRENT_TIMESTAMP() WHERE address=${escape(req.params.name)};`);
        await sqlp.query(`INSERT INTO namehistory (uuid, address, wallet_to, wallet_from, type) VALUES (${escape(id)}, ${escape(name.address)}, ${escape(req.body.address)}, ${escape(walletinfo.address)}, 'transfer');`);

        res.status(204).send({
            ok: true,
            name: req.params.name,
            address: req.params.name + '.mtc',
            owner: req.body.address,
            original_owner: name.original_owner,
            registered: name.registered,
            updated: new Date(),
            record: id,
        });
    } else {
        res.status(401).send({
            ok: false,
            error: 'key_not_authorized',
        });
        return;
    };
};