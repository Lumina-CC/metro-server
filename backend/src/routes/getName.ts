import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import NameDetails from '../types/NameDetails';

export default async (req: Request, res: Response) => {
    const [results] = await sqlp.query(`SELECT * FROM names WHERE address=${escape(req.params.name)};`);
    const records = results as NameDetails[];

    if (records.length == 1) {
        const record = records[0];
        res.send({
            ok: true,
            name: {
                name: record.address,
                address: record.address + '.mtc',
                owner: record.owner,
                original_owner: record.original_owner,
                registered: record.registered,
                updated: record.updated,
            },
        });
    } else {
        res.status(404).send({
            ok: false,
            error: 'name_not_found',
            name: req.params.name,
            address: req.params.name + '.mtc',
        })
    };
};