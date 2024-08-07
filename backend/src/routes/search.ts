import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import NameDetails from '../types/NameDetails';
import TransactionDetails from '../types/TransactionDetails';
import WalletDetails from '../types/WalletDetails';

export default async (req: Request, res: Response) => {
    if (!req.query.q && !req.body) {
        res.status(422).send({
            ok: false,
            error: 'missing_parameter',
        });
        return;
    };

    const oq = escape(req.query.q || req.body);
    const q = oq.replace('.kst', '');

    const [walletResults] = await sqlp.query(`SELECT * FROM wallets WHERE address=${q} OR flare=${q};`);
    const walletrecords = walletResults as WalletDetails[];

    const [transactionResults] = await sqlp.query(`SELECT * FROM transactions WHERE uuid=${q};`);
    const transactionrecords = transactionResults as TransactionDetails[];

    const [nameResults] = await sqlp.query(`SELECT * FROM names WHERE address=${q};`);
    const namerecords = nameResults as NameDetails[];

    res.send({
        ok: true,
        query: {
            originalQuery: oq.slice(1, -1),
            matchAddress: (walletrecords.length > 0),
            matchName: (namerecords.length > 0),
            matchTransaction: (transactionrecords.length > 0),
            strippedName: q.slice(1, -1),
            hasID: (q.length == 36),
            cleanID: (q.length == 36) ? q : undefined,
        },
        matches: {
            exactAddress: (walletrecords.length > 0) ? {
                address: walletrecords[0].address,
                balance: walletrecords[0].balance,
                totalin: walletrecords[0].totalin,
                totalout: walletrecords[0].totalout,
                firstseen: walletrecords[0].firstSeen,
            } : false,
            exactName: (namerecords.length > 0) ? {
                name: namerecords[0].address,
                owner: namerecords[0].owner,
                original_owner: namerecords[0].original_owner,
                registered: namerecords[0].registered,
                updated: namerecords[0].updated,
            } : false,
            exactTransaction: (transactionrecords.length > 0) ? {
                id: transactionrecords[0].uuid,
                from: transactionrecords[0].wallet_from,
                to: transactionrecords[0].wallet_to,
                value: transactionrecords[0].amount,
                time: transactionrecords[0].timestamp,
                name: transactionrecords[0].name,
                metadata: transactionrecords[0].metadata,
                sent_metaname: transactionrecords[0].metaname,
                type: transactionrecords[0].type,
             } : false,
        },
    });
};