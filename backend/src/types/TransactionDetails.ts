export default interface TransactionDetails {
    uuid: string,
    amount: number,
    wallet_to: string,
    wallet_from: string,
    timestamp: Date,
    metaname?: string,
    name?: string,
    metadata?: string,
    type: 'transfer' | 'name_purchase' | 'name_transfer';
};