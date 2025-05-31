
import './MovieCard.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Tag } from 'antd';
import RateStars from '../RateStars/RateStars';

const { Text } = Typography;

// Функция для обрезки текста
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  const subString = text.substring(0, maxLength);
  const lastSpaceIndex = subString.lastIndexOf(' ');
  return `${subString.slice(0, lastSpaceIndex)}...`;
};

// Функция для цвета рейтинга
const getRatingColor = (popularity) => {
  if (popularity >= 7) return '#66E900';
  if (popularity >= 5) return '#E9D100';
  if (popularity >= 3) return '#E97E00';
  return '#E90000';
};

export default function MovieCard({ movie, guestSessionId }) {
  const { id, filmTitle, posterURL, releaseDate, overview, popularity, rating, genres } = movie;
  const overviewTruncated = truncateText(overview, 200);

  const inputClasses = ['card-popularity-count'];
  if (popularity >= 3 && popularity < 5) inputClasses.push('orange');
  if (popularity >= 5 && popularity < 7) inputClasses.push('yellow');
  if (popularity >= 7) inputClasses.push('green');

  const filmGenres = genres.map((genre) => (
    <Tag className="card-genres-tag" key={genre}>
      {genre}
    </Tag>
  ));

  return (
    <Card hoverable key={id} className="movie-card">
      <img className="card-img" alt={`poster ${filmTitle}`} src={posterURL} />

      <div className="card-movie-title">{filmTitle}</div>
      <span className={inputClasses.join(' ')}>{popularity}</span>

      <Text type="secondary" className="card-release-date">
        {releaseDate}
      </Text>
      <div className="card-tags">{filmGenres}</div>
      <Text className="card-overview">{overviewTruncated}</Text>
      <RateStars id={id} rating={rating} guestSessionId={guestSessionId} />
    </Card>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    filmTitle: PropTypes.string.isRequired,
    posterURL: PropTypes.string.isRequired,
    releaseDate: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    popularity: PropTypes.number,
    rating: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  guestSessionId: PropTypes.string.isRequired,
};