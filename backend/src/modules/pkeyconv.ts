import * as crypto from 'node:crypto';

export function computeWalletAddress(pkey: string) {
    try {
        // @ts-expect-error  -- Typings seem to be wrong here, .replace() can take no second argument to remove it
        return 'm' + crypto.createHash('sha512').update(pkey).digest('base64url').toString().toLowerCase().replace('-').replace('_').substring(0, 9);
    } catch {
        return 'mtcerrwall';
    };
};

export function hashPrivateKey(pkey: string) {
    return crypto.createHash('sha512').update(pkey + 'ThisIsAGlobalSaltForMetroSecurity').digest('hex');
};