import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  doc,
  query
} from 'firebase/firestore';
import { useAuth } from '@lib/context/auth-context';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { tickersCollection, usersCollection } from '@lib/firebase/collections';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from './aside-trends';
import { ToolTip } from '@components/ui/tooltip';

export function AsideTickers(): JSX.Element {
  const { randomSeed } = useAuth();

  const { data: adminData, loading: adminLoading } = useDocument(
    doc(usersCollection, 'FBmqXKR7FmeNSN3GRAnUH0tFOJq2'),
    { allowNull: true }
  );

  const { data: tickersData, loading: tickersLoading } = useCollection(
    query(
      tickersCollection
    ),
    { allowNull: true }
  );

  let filteredTickersData = [];
  if(!tickersLoading) {
    // Filter out tickersData with no tweets or !tweets.length
    filteredTickersData = tickersData.filter(ticker => ticker.tweets && ticker.tweets.length > 0);

    // Sort by tweets.length and createdAt
    filteredTickersData.sort((a, b) => {
      if (a.tweets.length !== b.tweets.length) {
        return b.tweets.length - a.tweets.length;
      }
      return (b.updatedAt ? b.updatedAt.toDate().getTime() : 0) - (a.updatedAt ? a.updatedAt.toDate().getTime() : 0);
    });

    if(filteredTickersData.length > 0) {
      const latestUpdatedTicker = filteredTickersData.reduce((latest, ticker) => {
        if (!ticker.updatedAt || (latest.updatedAt && latest.updatedAt.toMillis() > ticker.updatedAt.toMillis())) {
          return latest;
        }
        return ticker;
      }, filteredTickersData[0]);
    
      latestUpdatedTicker.latest = true;
    }

    // if createdAt is < 1 day ago, set new 
    filteredTickersData.forEach(ticker => {
      if(ticker.createdAt && ticker.createdAt.toMillis() > Date.now() - 1000 * 60 * 60 * 24) {
        ticker.new = true;
      }
    });

}

    


  return (
    <section className='hover-animation rounded-2xl bg-main-sidebar-background' style={{     position: 'sticky',
      top: '20px' }}>
      {adminLoading || tickersLoading ? (
        <Loading className='flex h-52 items-center justify-center p-4' />
      ) : filteredTickersData ? (
        <motion.div className='inner:px-4 inner:py-3' {...variants}>
          <h2 className='text-xl font-bold text-center'>🔥 TOP TICKERS 🔥</h2>
          {/* {adminData && <UserCard {...adminData} />} */}
          {filteredTickersData?.map((tickerData, i) => (
            <Link key={i} href={`/tickers?id=${tickerData.name}`}>
              <div className='width-100 flex items-center justify-between cursor-pointer accent-tab hover-animation
              hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'>
                  <span className='text-bold text-left flex' style={{width:'50px'}}>
                    {i == 0 ? '🏆' : (i == 1 ? '🥈' : (i == 2 ? '🥉' : ''))}
                    {tickerData.latest ?
                    (<span style={{marginLeft:'5px'}}>
                      🕒
                    </span>) : (<></>)}
                    {tickerData.new ?
                    (<span style={{marginLeft:'5px'}}>
                      🆕
                    </span>) : (<></>)}
                  </span>
                  <a className='text-center text-main-text text-lg text-main-accent cursor-pointer no-underline underline-hover'>{tickerData.name}</a>
                  <span className='text-bold text-right' style={{width:'50px'}}>
                    {tickerData.tweets.length} 🔥
                  </span>
              </div>
              
            </Link>
          ))}
          {/* <Link href='/people'>
            <a
              className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'
            >
              Show more
            </a>
          </Link> */}
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}
