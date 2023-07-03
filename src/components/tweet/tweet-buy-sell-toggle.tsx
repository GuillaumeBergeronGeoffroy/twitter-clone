import React, { useState, MouseEvent } from 'react';
import { manageBuySell } from '@lib/firebase/utils';

export function TweetBuySellToggle({viewTweet, userId, tweetId, tweetIsBuy, tweetIsSell, totalBuys = 0, totalSells = 0}: {viewTweet: boolean, userId: string, tweetId: string, tweetIsBuy: boolean, tweetIsSell: boolean, totalBuys?: number, totalSells?: number}) {
  const [selected, setSelected] = useState<string>('');

  const totalVotes = totalBuys + totalSells;

  const computePercentage = (part: number, total: number): number => {
    if (total === 0) {
      return 0;
    }
    return Math.round((part / total) * 100);
  };

  const buyPercentage = computePercentage(totalBuys, totalVotes);
  const sellPercentage = computePercentage(totalSells, totalVotes);

  const handleBuyClick = async (event: MouseEvent): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();
    if(!tweetIsBuy) {
      const buy = manageBuySell('buy', userId, tweetId);
      await buy();
    }
  };

  const handleSellClick = async (event: MouseEvent): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();
    if(!tweetIsSell) {
      const sell = manageBuySell('sell', userId, tweetId);
      await sell();
    }
  };

  return (
    <div style={{ height: '2.5rem' }} onClick={(event) => event.stopPropagation()} className={`flex border border-gray-400 rounded-lg overflow-hidden buy-sell ${viewTweet ? 'buy-sell-top' : ''}`}>
      { !(tweetIsBuy || tweetIsSell) ? (
        <>
          <div
            className={`flex-1 text-center py-2 cursor-pointer 
                        ${selected === 'BUY' ? 'bg-green-500 text-white' : 'hover:bg-green-500'}`}
              onClick={handleBuyClick}
            >
            BUY
          </div>
          <div
            className={`flex-1 text-center py-2 cursor-pointer 
                        ${selected === 'SELL' ? 'bg-red-500 text-white' : 'hover:bg-red-500'}`}
            onClick={handleSellClick}
          >
            SELL
          </div>
        </>
      ) : (
        <>
          <span className='py-2 bg-green-500' style={{ width: `${buyPercentage}%`, display: 'inline-block', textAlign: 'center', color: 'white', minWidth: `${buyPercentage > 0 ? '2.5rem' : 0}` }}>
          {buyPercentage}% ({totalBuys})
          </span>
          <span className='py-2' style={{ width: `${sellPercentage}%`, background: '#d90429', display: 'inline-block', textAlign: 'center', color: 'white', minWidth: `${sellPercentage > 0 ? '2.5rem' : 0}` }}>
            {sellPercentage}% ({totalSells})
          </span>
        </>
      )}
    </div>
  );
}
