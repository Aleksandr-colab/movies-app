import React, { Component } from 'react';
import store from 'store';

import { Alert, Empty, Layout, Pagination, Space, Spin } from 'antd';
import { format, parseISO } from 'date-fns';
import { Context } from '../GenresContext/GenresContext';

import MovieDbService from '../../services/MovieDbService';
import Header from '../Header';
import Search from '../Search';
import CardList from '../CardList';

import './App.css';
import 'antd/dist/reset.css';
import outOfPosterImg from './Out_Of_Poster.jpg';

const { Content } = Layout;

export default class App extends Component {
  state = {
    movies: [],
    ratedFilm: [],
    genresList: [],
    isLoading: true,
    isError: false,
    notFound: false,
    searchQuery: '',
    numberPage: 1,
    totalPages: 0,
    guestSessionId: '',
    tabPane: '1',
  };

  componentDidMount() {
    if (!store.get('guestSessionId')) {
      this.createGuestSession();
    } else {
      this.setState({
        guestSessionId: store.get('guestSessionId'),
      });
    }

    this.getGenresList();
    this.loadInitialData();
  }

  loadInitialData = () => {
    const { tabPane } = this.state;
    if (tabPane === '1') {
      this.getPopularMovies(1);
    } else {
      this.getRatedMovies(1);
    }
  };

  getGenresList = () => {
    const callMovieDbService = new MovieDbService();

    callMovieDbService
      .getGenersList()
      .then((body) => {
        this.setState({ genresList: [...body.genres] });
      })
      .catch(() => {
        this.setState({ isLoading: false, isError: true });
      });
  };

  createGuestSession = () => {
    const callMovieDbService = new MovieDbService();

    callMovieDbService.guestSession().then((data) => {
      const sessionId = data.guest_session_id;
      store.set('guestSessionId', sessionId);

      this.setState(
        {
          guestSessionId: sessionId,
          isLoading: false,
        },
        () => {
          this.getRatedMovies(1);
        }
      );
    }).catch(() => {
      this.setState({ isLoading: false, isError: true });
    });
  };

  getPopularMovies = (page) => {
    const callMovieDbService = new MovieDbService();

    this.setState({
      movies: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    callMovieDbService.getPopularMovies(page)
      .then((item) => {
        const results = item.results || [];

        this.setState({
          totalPages: item.total_pages,
          numberPage: page,
          isLoading: false,
          notFound: !results.length,
          movies: results.map((elm) => this.createItem(elm)),
        });
      })
      .catch(() => {
        this.setState({ isLoading: false, isError: true });
      });
  };

  searchMovies = (page = 1) => {
    const { searchQuery } = this.state;
    const callMovieDbService = new MovieDbService();

    this.setState({
      movies: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    if (!searchQuery.trim()) {
      return this.getPopularMovies(page);
    }

    callMovieDbService.searchMovies(searchQuery, page)
      .then((item) => {
        const results = item.results || [];

        this.setState({
          totalPages: item.total_pages,
          numberPage: page,
          isLoading: false,
          notFound: !results.length,
          movies: results.map((elm) => this.createItem(elm)),
        });
      })
      .catch(() => {
        this.setState({ isLoading: false, isError: true });
      });
  };

  getRatedMovies = (page) => {
    const { guestSessionId } = this.state;
    const callMovieDbService = new MovieDbService();

    this.setState({
      ratedFilm: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    callMovieDbService.getRatedMovies(guestSessionId, page)
      .then((item) => {
        const results = item.results || [];

        this.setState({
          totalPages: item.total_pages,
          numberPage: page,
          isLoading: false,
          notFound: !results.length,
          ratedFilm: results.map((elm) => this.createItem(elm)),
        });
      })
      .catch(() => {
        this.setState({ isLoading: false, isError: true });
      });
  };

  createItem = (item) => {
    const releaseDate = item.release_date ? format(parseISO(item.release_date), 'MMMM dd, yyyy') : 'no release date';
    const filmTitle = item.title || 'Movie title not specified';
    const overview = item.overview || 'Movie overview not specified';
    const popularity = parseFloat(item.vote_average).toFixed(1); // 👈 Округляем до одного знака
    const rating = store.get(`${item.id}`) || item.rating || 0;
  
    let posterURL = outOfPosterImg;
    if (item.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/w500${item.poster_path}`; 
    }
  
    const genres = this.getGenresFilm(item.genre_ids);
  
    return {
      id: item.id,
      filmTitle,
      posterURL,
      releaseDate,
      overview,
      popularity: parseFloat(popularity), // можно оставить как число
      rating: parseFloat(rating).toFixed(1),
      genres,
    };
  };

  getGenresFilm = (genresIds) => {
    const { genresList } = this.state;
    if (!genresList.length || !genresIds) return [];

    return genresIds.map((genreId) => {
      const genre = genresList.find((g) => g.id === genreId);
      return genre ? genre.name : '';
    });
  };

  changeTab = (key) => {
    this.setState(
      {
        tabPane: key,
        numberPage: 1,
        notFound: false,
        isError: false,
      },
      () => {
        this.loadInitialData();
      }
    );
  };

  changePage = (page) => {
    this.setState({ numberPage: page }, () => {
      if (this.state.tabPane === '1') {
        this.getPopularMovies(page);
      } else {
        this.getRatedMovies(page);
      }
    });
  };

  searchQueryChange = (query) => {
    this.setState(
      {
        searchQuery: query,
        numberPage: 1,
      },
      () => {
        this.searchMovies(1);
      }
    );
  };

  render() {
    const { movies, ratedFilm, isLoading, isError, notFound, numberPage, totalPages, tabPane, guestSessionId } =
      this.state;

    const contextValue = { movies, ratedFilm, tabPane, guestSessionId };

    const error = isError ? (
      <Alert message="Error" description="Что-то пошло не так. Но мы скоро всё исправим :-)" type="error" showIcon />
    ) : null;

    const content = tabPane === '1' ? (
      <CardList movies={movies} guestSessionId={guestSessionId} />
    ) : (
      <CardList movies={ratedFilm} guestSessionId={guestSessionId} />
    );

    const spin = isLoading ? (
      <div style={{ minHeight: '300px' }}>
        <Spin spinning={isLoading} />
      </div>
    ) : null;

    const pagination = totalPages > 1 && !isLoading ? (
      <Pagination current={numberPage} total={totalPages} onChange={this.changePage} pageSize={20} />
    ) : null;

    const search = tabPane !== '2' ? <Search searchQueryChange={this.searchQueryChange} /> : null;

    return (
      <div className="container">
        <Layout>
          <Context.Provider value={contextValue}>
            <Content>
              <Header changeTab={this.changeTab} />
              {search}
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                {spin || content}
                {notFound && <Empty description="Фильмы не найдены" />}
                {error}
                {pagination}
              </Space>
            </Content>
          </Context.Provider>
        </Layout>
      </div>
    );
  }
}