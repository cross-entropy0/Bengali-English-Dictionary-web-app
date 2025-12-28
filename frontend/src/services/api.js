import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Search for words (autocomplete)
 */
export const searchWords = async (query, limit = 10) => {
  try {
    const response = await api.get('/search', {
      params: { q: query, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

/**
 * Lookup a word (English or Bengali)
 */
export const lookupWord = async (word) => {
  try {
    const response = await api.get(`/lookup/${encodeURIComponent(word)}`);
    return response.data;
  } catch (error) {
    console.error('Lookup error:', error);
    throw error;
  }
};

/**
 * Search English words
 */
export const searchEnglishWords = async (query, limit = 10) => {
  try {
    const response = await api.get('/search/english', {
      params: { q: query, limit }
    });
    return response.data;
  } catch (error) {
    console.error('English search error:', error);
    throw error;
  }
};

/**
 * Search Bengali words
 */
export const searchBengaliWords = async (query, limit = 10) => {
  try {
    const response = await api.get('/search/bengali', {
      params: { q: query, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Bengali search error:', error);
    throw error;
  }
};

export default api;
