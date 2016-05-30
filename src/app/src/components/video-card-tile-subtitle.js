'use strict';

const React = require('react');

const Price = require('./price');

module.exports = ({ videoCard }) => {
  const result = videoCard.ResellerVideoCards.reduce(
    (acc, resellerVideoCard) => {
      const probe = resellerVideoCard.Probes.reduce(
        (acc, probe) => {
          if (!acc) return probe;
          if (probe.inStock && !acc.inStock) return probe;
          if (probe.price < acc.price) return probe;
          return acc;
        }, null
      );
      if (!probe) return acc;
      if (!acc) return { resellerVideoCard, probe };
      if (probe.inStock && !acc.probe.inStock) return { resellerVideoCard, probe };
      if (probe.price < acc.probe.price) return { resellerVideoCard, probe };
      return acc;
    }, null
  );
  if (!result) return <span>Non disponible</span>;
  return (
    <a href={result.resellerVideoCard.url}>
      {result.probe.inStock ? 'En stock' : 'Hors stock'} à partir de&nbsp;
      <b><Price value={result.probe.price} /></b>
    </a>
  );
};
