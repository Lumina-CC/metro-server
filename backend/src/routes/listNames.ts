import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import NameDetails from '../types/NameDetails';

export default async (req: Request, res: Response) => {
    let orderBy: 'address' | 'owner' | 'original_owner' | 'registered' | 'updated' = 'registered';
    if (req.query.orderBy) {
        if (['address', 'owner', 'original_owner', 'registered', 'updated'].includes(req.query.orderBy as string)) {
            orderBy = req.query.orderBy as any;
        } else {
            res.status(406).send({
                ok: false,
                error: 'invalid_orderby_value',
            });
            return;
        };
    };
    let order: 'ASC' | 'DESC' = (req.path == '/names/new') ? 'DESC' : 'ASC';
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

    const [results] = await sqlp.query(`SELECT * FROM names${(req.path == '/names' || req.path == '/names/new') ? '' : ` WHERE ${(req.params.address.split(',').map((address) => `owner=${escape(address)}`).join(' OR '))}`} ORDER BY ${orderBy} ${order} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
    const [countres] = await sqlp.query(`SELECT COUNT(*) FROM names${(req.path == '/names' || req.path == '/names/new') ? '' : ` WHERE ${(req.params.address.split(',').map((address) => `owner=${escape(address)}`).join(' OR '))}`};`);
    const records = results as NameDetails[];

    res.send({
        ok: true,
        count: records.length,
        total: countres[0][Object.keys(countres[0])[0]],
        names: records.map((record) => {
            return {
                name: record.address,
                owner: record.owner,
                original_owner: record.original_owner,
                registered: record.registered,
                updated: record.updated,
                transferred: record.updated, // No record contents other than transferring, pass same value for compatibility
                a: null, // Does not serve a functional purpose in Krist, not being implemented in Metro. Returns for compatibility
                unpaid: 0, // don't even know why this is in Krist, but still returning it for compatibility. Might remove in the future.
            };
        }),
    });
};