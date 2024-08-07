import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import NameHistoryRecord from '../types/NameHistoryRecord';

export default async (req: Request, res: Response) => {
    let orderBy: 'id' | 'address' | 'wallet_to' | 'wallet_from' | 'timestamp' = 'timestamp';
    if (req.query.orderBy) {
        if (['id', 'address', 'wallet_to', 'wallet_from', 'timestamp'].includes(req.query.orderBy as string)) {
            orderBy = req.query.orderBy as any;
        } else {
            res.status(406).send({
                ok: false,
                error: 'invalid_orderby_value',
            });
            return;
        };
    };
    let order: 'ASC' | 'DESC' = 'DESC';
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

    const [results] = await sqlp.query(`SELECT * FROM namehistory WHERE address=${escape(req.params.name)} ORDER BY ${orderBy} ${order} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
    const [countres] = await sqlp.query(`SELECT COUNT(*) FROM namehistory WHERE address=${escape(req.params.name)};`);
    const records = results as NameHistoryRecord[];

    res.send({
        ok: true,
        count: records.length,
        total: countres[0][Object.keys(countres[0])[0]],
        transactions: records.map((record) => {
            return {
                id: record.id,
                from: record.wallet_from,
                to: record.wallet_to,
                value: 0, // Added for compatbility, will prob remove later
                time: record.timestamp,
                name: record.address,
                type: record.type,
            };
        }),
    })
};