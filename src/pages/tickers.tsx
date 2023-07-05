import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useArrayDocument } from '@lib/hooks/useArrayDocument';
import { useRouter } from 'next/router';
import { Tickers } from '@lib/types/tickers';
import {
  tweetsCollection,
  getTickersDocument
} from '@lib/firebase/collections';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { Tweet } from '@components/tweet/tweet';
import { StatsEmpty } from '@components/tweet/stats-empty';
import { Loading } from '@components/ui/loading';
import type { ReactElement, ReactNode } from 'react';

export default function Ticker(): JSX.Element {
  const [tickersDoc, setTickersDoc] = useState<Tickers | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    query: { id }
  } = useRouter();

  const name = id?.toString().toUpperCase();

  useEffect(() => {
    getTickersDocument(name)
      .then((doc) => {
        setTickersDoc(doc);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ticker document:', error);
        setLoading(false);
      });
  }, [name]);
  
  const tweetIds = useMemo(
    () => tickersDoc?.tweets.filter((tweet) => tweet !== undefined) ?? [],
    [tickersDoc]
  );

  const { data: tweetData, loading: tweetLoading } = useArrayDocument(
    tweetIds,
    tweetsCollection,
    { includeUser: true }
  );

  const { back } = useRouter();

  return (
    <MainContainer>
      <SEO title={name + '/ CT'} />
      <MainHeader useActionButton action={back} className='flex items-center gap-6'>
        <div className='-mb-1 flex flex-col'>
          <h2 className='-mt-1 text-xl font-bold'>{name}</h2>
        </div>
      </MainHeader>
      <section className='mt-0.5'>
        {loading || tweetLoading ? (
          <Loading className='mt-5' />
        ) : !tweetIds.length ? (
          <StatsEmpty
            title={name}
            description='Nothing to see here... Looks like your shitcoin is going to zero. Liquidity removal is imminent.'
            imageData={{ src: '/assets/nothing.jpg', alt: 'No tickers' }}
          />
        ) : (
          <AnimatePresence mode='popLayout'>
            {tweetData?.slice().reverse().map((tweet) => (
                <Tweet {...tweet} key={tweet.id} />
            ))}
          </AnimatePresence>
        )}
      </section>
    </MainContainer>
  );
}

Ticker.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
