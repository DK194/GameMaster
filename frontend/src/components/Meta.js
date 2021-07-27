import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
}

Meta.defaultProps = {
  title: 'Game Master - All Things Games! 🎮',
  description: 'The best video games at the best prices!',
  keywords: 'games, video games, e-commerce, best video games, cheap video games'
}

export default Meta;
