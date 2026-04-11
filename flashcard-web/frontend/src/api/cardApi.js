import axios from "axios";

const API_URL = "http://localhost:8080/api/cards";

export const getCards = (deckId) =>
  axios.get(`${API_URL}/deck/${deckId}`);

export const createCard = (card) => axios.post(API_URL, card);

export const deleteCard = (id) => axios.delete(`${API_URL}/${id}`);

export const updateCard = (id, card) => axios.put(`${API_URL}/${id}`, card);
