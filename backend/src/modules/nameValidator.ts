import { readFileSync } from 'fs';

const badwords = readFileSync('/home/container/badwords.txt').toString().split(/\r?\n|\r|\n/g);

export function validateName(address: string): {
    ok: boolean,
    reason?: string,
} {
    if (address.length > 32) {
        return {
            ok: false,
            reason: 'too_long',
        };
    };

    if (address.length < 2) {
        return {
            ok: false,
            reason: 'too_short',
        };
    };

    try {
        if (!(/^[a-zA-Z0-9]+/.exec(address)) || /^[a-zA-Z0-9]+/.exec(address)[0] !== address) {
            return {
                ok: false,
                reason: 'invalid_chars',
            };
        };
    } catch {
        return {
            ok: false,
            reason: 'invalid_chars',
        };
    };

    for (const phrase in badwords) {
        if (address.includes(phrase)) {
            return {
                ok: false,
                reason: 'filtered',
            };
        };
    };

    return {
        ok: true,
        reason: 'good',
    };
};