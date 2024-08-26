import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { sqlp } from '../modules/db';
import TransactionDetails from '../types/TransactionDetails';

export default async (req: Request, res: Response) => {
    if (!req.params.transaction) {
        res.status(400).send({
            ok: false,
            error: 'no_transaction_id',
        });
        return;
    };


    const [transactionsres] = await sqlp.query(`SELECT * FROM transactions WHERE uuid=${escape(req.params.transaction)} LIMIT 2`);
    const transactions = transactionsres as TransactionDetails[];

    if (transactions.length == 1) {
        const transaction = transactions[0];

        res.send({
            ok: true,
            transaction: {
                id: transaction.uuid,
                from: transaction.wallet_from,
                to: transaction.wallet_to,
                value: transaction.amount,
                time: transaction.timestamp,
                name: transaction.name,
                metadata: transaction.metadata,
                sent_metaname: transaction.metaname,
                status: transaction.state,
                type: transaction.type,
            },
        });
    } else {
        res.status(404).send({
            ok: false,
            error: 'transaction_not_found',
            id: req.params.transaction,
        })
    };
};