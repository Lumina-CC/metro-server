import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import TransactionDetails from '../types/TransactionDetails';

export default async (req: Request, res: Response) => {
    const [results] = await sqlp.query(`SELECT * FROM transactions WHERE wallet_to=${escape(req.params.address)} OR wallet_from=${escape(req.params.address)} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
    const [countres] = await sqlp.query(`SELECT COUNT(*) FROM transactions WHERE wallet_to=${escape(req.params.address)} OR wallet_from=${escape(req.params.address)};`);
    const records = results as TransactionDetails[];


    res.send({
        count: records.length,
        total: countres[0][Object.keys(countres[0])[0]],
        addresses: records.map((record) => {
            return {
                id: record.uuid,
                from: record.wallet_from,
                to: record.wallet_to,
                value: record.amount,
                time: record.timestamp,
                name: record.name,
                metadata: record.metadata,
                sent_metaname: record.metaname,
                type: record.type,
            };
        }),
    });
};