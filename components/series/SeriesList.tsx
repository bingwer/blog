import React from 'react';
import SeriesItem from './SeriesItem';

function SeriesList() {
  return (
    <ol className="relative grid gap-3 md:grid-cols-2">
      {[1, 2, 3, 4, 5].map(key => (
        <SeriesItem key={key} />
      ))}
    </ol>
  );
}

export default SeriesList;
