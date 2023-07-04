import React, { MouseEvent } from 'react';
import Linkify from 'react-linkify';

interface Props {
  text: string;
}

export const TweetWithLinks: React.FC<Props> = ({ text }) => {
  // Separates the text into segments based on the specified regex
  const parts = text.split(/(\$\w+)/g);

  const handleCustomClick = (event: MouseEvent<HTMLSpanElement>, part: string) => {
    event.preventDefault();
    event.stopPropagation();
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
            <span className='text-main-accent cursor-pointer no-underline underline-hover' key={index} onClick={(event) => handleCustomClick(event, part)}>
              {part}
            </span>
          );
        } else {
          // Render non-matching segments as plain text
          return part;
        }
      })}
    </Linkify>
  );
};
