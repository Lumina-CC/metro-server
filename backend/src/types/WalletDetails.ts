export default interface WalletDetails {
    address: string,
    pkeyhash: string,
    balance: number,
    firstSeen: Date,
    totalin: number,
    totalout: number,
    locked: boolean,
    flare: string,
    names?: number,
};