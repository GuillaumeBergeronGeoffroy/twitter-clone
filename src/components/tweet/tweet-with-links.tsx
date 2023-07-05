import React, { MouseEvent } from 'react';
import Linkify from 'react-linkify';
import Link from 'next/link';

interface Props {
  text: string;
}

export const TweetWithLinks: React.FC<Props> = ({ text }) => {
  // Separates the text into segments based on the specified regex
  const parts = text.split(/(\$\w+)/g);

  const handleCustomClick = (event: MouseEvent<HTMLSpanElement>, part: string) => {
    event.stopPropagation();
    // in time i would like to display overlay with ticker price and stats and most recent tweets
    // Do something with the custom link click
    // alert(`You clicked ${part}`);
  };

  const linkifyDecorator = (href: string, text: string, key: number) => (
    <a onClick={(event) => {event.stopPropagation();}} href={href} target='_blank' rel='noreferrer' key={key} className='text-main-accent no-underline underline-hover'>
      {text}
    </a>
  );

  return (
    <Linkify componentDecorator={linkifyDecorator}>
      {parts.map((part, index) => {
        if (/\$\w+/.test(part)) {
          // Render the matching segments as a clickable link
          return (
            <Link key={index} href={'/tickers?id=' + part}>
              <span className='text-main-accent cursor-pointer no-underline underline-hover' onClick={(event) => handleCustomClick(event, part)}>
                {part}
              </span>
            </Link>
          );
        } else {
          // Render non-matching segments as plain text
          return part;
        }
      })}
    </Linkify>
  );
};
