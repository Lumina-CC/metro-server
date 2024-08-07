import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import TransactionDetails from '../types/TransactionDetails';

export default async (req: Request, res: Response) => {
    let orderBy: 'uuid' | 'from' | 'to' | 'value' | 'time' | 'name' | 'metaname' = 'uuid';
    if (req.query.orderBy) {
        if (['uuid', 'from', 'to', 'value', 'time', 'name', 'metaname'].includes(req.query.orderBy as string)) {
            orderBy = req.query.orderBy as any;
        } else {
            res.status(406).send({
                ok: false,
                error: 'invalid_orderby_value',
            });
            return;
        };
    };
    let order: 'ASC' | 'DESC' = 'ASC';
    if (req.query.order) {
        if (['ASC', 'DESC'].includes(req.query.order as string)) {
            order = req.query.order as any;
        } else {
            res.status(406).send({
                ok: false,
                error: 'invalid_order_value',
            });
            return;
        };
    };

    const [results] = await sqlp.query(`SELECT * FROM transactions WHERE name=${escape(req.params.name)} ORDER BY ${orderBy} ${order} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
    const [countres] = await sqlp.query(`SELECT COUNT(*) FROM transactions WHERE name=${escape(req.params.name)};`);
    const records = results as TransactionDetails[];

    res.send({
        ok: true,
        count: records.length,
        total: countres[0][Object.keys(countres[0])[0]],
        transactions: records.map((transaction) => {
            return {
                id: transaction.uuid,
                from: transaction.wallet_from,
                to: transaction.wallet_to,
                time: transaction.timestamp,
                name: transaction.name,
                metadata: transaction.metadata,
                sent_metaname: transaction.metaname,
                type: transaction.type,
            };
        }),
    });
};