import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type Tickers = {
    name: string;
    tweets: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export const tickersConverter: FirestoreDataConverter<Tickers> = {
    toFirestore(tickers) {
        return { ...tickers };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);

        return { ...data } as Tickers;
    }
};
