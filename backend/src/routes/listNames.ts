import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import NameDetails from '../types/NameDetails';

export default async (req: Request, res: Response) => {
    const [results] = await sqlp.query(`SELECT * FROM names WHERE owner=${escape(req.params.address)} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
    const [countres] = await sqlp.query(`SELECT COUNT(*) FROM names WHERE owner=${escape(req.params.address)};`);
    const records = results as NameDetails[];

    res.send({
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
            };
        }),
    });
};