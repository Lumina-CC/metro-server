import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import WalletDetails from '../types/WalletDetails';

export default (sort: string) => {
    return async (req: Request, res: Response) => {
        const [results] = await sqlp.query(`SELECT address, balance, totalin, totalout, firstseen FROM wallets ORDER BY ${sort} LIMIT ${res.locals.limit} OFFSET ${res.locals.offset};`);
        const records = results as WalletDetails[];

        const [countres] = await sqlp.query(`SELECT COUNT(address) FROM wallets;`);

        res.send({
            ok: true,
            count: records.length,
            total: countres[0][Object.keys(countres[0])[0]],
            addresses: records,
        });
    };
};