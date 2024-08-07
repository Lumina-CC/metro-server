import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
    res.send({
        ok: true,
        name_cost: 500,
    });
};