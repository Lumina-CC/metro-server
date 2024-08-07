import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import TransactionDetails from '../types/TransactionDetails';

export default async (req: Request, res: Response) => {
    let orderBy: 'id' | 'from' | 'to' | 'value' | 'timestamp' | 'name' | 'metaname' = 'timestamp';
    if (req.query.orderBy) {
        if (['id', 'from', 'to', 'value', 'timestamp', 'name', 'metaname'].includes(req.query.orderBy as string)) {
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

    const [results] = await sqlp.query(`SELECT * FROM transactions WHERE ${req.params.address.split(',').map((address) =>  `wallet_to=${escape(address)} OR wallet_from=${escape(address)}`).join(' OR ')} ORDER BY ${orderBy} ${order} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
    const [countres] = await sqlp.query(`SELECT COUNT(*) FROM transactions WHERE ${req.params.address.split(',').map((address) =>  `wallet_to=${escape(address)} OR wallet_from=${escape(address)}`).join(' OR ')};`);
    const records = results as TransactionDetails[];


    res.send({
        ok: true,
        count: records.length,
        total: countres[0][Object.keys(countres[0])[0]],
        transactions: records.map((record) => {
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