
import './CardList.css';

import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard';

export default function CardList({ movies, guestSessionId }) {
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return <div>Фильмы не найдены</div>;
  }

  return (
    <div className="card-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} guestSessionId={guestSessionId} />
      ))}
    </div>
  );
}

CardList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      poster_path: PropTypes.string,
      vote_average: PropTypes.number,
      overview: PropTypes.string,
      genre_ids: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  guestSessionId: PropTypes.string.isRequired,
};

CardList.defaultProps = {
  movies: [],
};