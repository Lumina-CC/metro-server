import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
    let limit = 50;
    let offset = 0;
    if (req.query.limit) {
        if (!parseInt(req.query.limit as string)) {
            res.status(406).send({
                ok: false,
                error: 'limit_not_number',
            });
            return;
        };
        if (parseInt(req.query.limit as string) < 0 || parseInt(req.query.limit as string) > 1000) {
            res.status(416).send({
                ok: false,
                error: 'too_much_requested',
            });
            return;
        };

        limit = parseInt(req.query.limit as string);
    };

    if (req.query.offset) {
        if (!parseInt(req.query.offset as string)) {
            res.status(406).send({
                ok: false,
                error: 'offset_not_number',
            });
            return;
        };

        offset = parseInt(req.query.offset as string);
    };

    res.locals.limit = limit;
    res.locals.offset = offset;

    next();
};