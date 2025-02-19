import { collection, query, where, doc, getDoc } from 'firebase/firestore';
import { userConverter } from '@lib/types/user';
import { tweetConverter } from '@lib/types/tweet';
import { bookmarkConverter } from '@lib/types/bookmark';
import { statsConverter } from '@lib/types/stats';
import { tickersConverter } from '@lib/types/tickers';
import { db } from './app';
import type { CollectionReference } from 'firebase/firestore';
import type { Tickers } from '@lib/types/tickers';
import type { Bookmark } from '@lib/types/bookmark';
import type { Stats } from '@lib/types/stats';

export async function getTickersDocument(id: string): Promise<Tickers | null> {
  const docRef = doc(db, 'tickers', id).withConverter(tickersConverter);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? docSnap.data() as Tickers : null;
}

export const tickersCollection = collection(db, 'tickers').withConverter(
  tickersConverter
);

export const usersCollection = collection(db, 'users').withConverter(
  userConverter
);

export const tweetsCollection = collection(db, 'tweets').withConverter(
  tweetConverter
);

export function userBookmarksCollection(
  id: string
): CollectionReference<Bookmark> {
  return collection(db, `users/${id}/bookmarks`).withConverter(
    bookmarkConverter
  );
}

export function userStatsCollection(id: string): CollectionReference<Stats> {
  return collection(db, `users/${id}/stats`).withConverter(statsConverter);
}
