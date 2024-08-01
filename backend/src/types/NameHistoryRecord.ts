export default interface NameHistoryRecord {
    id: string,
    address: string,
    wallet_to: string,
    wallet_from: string,
    timestamp: Date,
    type: 'transfer' | 'purchase',
};