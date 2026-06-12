import { api } from '../api';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

export const getTMDBImage = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/500x750/0a0a0f/00ffcc?text=No+Image';
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export const fetchTMDB = async (endpoint: string) => {
  const key = await api.getSetting('TMDB_API_KEY');
  if (!key) {
    throw new Error('No TMDB API Key found. Please add it in Settings.');
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB Error: ${res.status}`);
  }
  return res.json();
};

export const getTrending = async (type: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB(`/trending/${type}/${timeWindow}`);
  return data.results;
};

export const getPopular = async (type: 'movie' | 'tv' = 'movie'): Promise<TMDBMovie[]> => {
  const data = await fetchTMDB(`/${type}/popular`);
  return data.results;
};

export const getDetails = async (id: number | string, type: 'movie' | 'tv' = 'movie') => {
  return await fetchTMDB(`/${type}/${id}?append_to_response=credits,videos`);
};
