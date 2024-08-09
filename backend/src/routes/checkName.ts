import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import { validateName } from '../modules/nameValidator';
import NameDetails from '../types/NameDetails';

export default async (req: Request, res: Response) => {
    const [results] = await sqlp.query(`SELECT * FROM names WHERE address=${escape(req.params.name)};`);
    let reason: string;

    if ((results as NameDetails[]).length != 0) {
        reason = 'taken';
    } else if (!validateName(req.params.name).ok) {
        reason = validateName(req.params.name).reason;
    };

    res.status((reason) ? 406 : 200).send({
        ok: true,
        available: (reason) ? false : true,
        reason,
    });
};