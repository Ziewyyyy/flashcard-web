import axiosClient from "./axiosClient";

const API_URL = "/api/cards";

export const getCards = (deckId) =>
  axiosClient.get(`${API_URL}/deck/${deckId}`);

export const createCard = (card) =>
  axiosClient.post(API_URL, card);

export const deleteCard = (id) =>
  axiosClient.delete(`${API_URL}/${id}`);

export const updateCard = (id, card) =>
  axiosClient.put(`${API_URL}/${id}`, card);

export const getStudyCards = (deckId) =>
  axiosClient.get(`${API_URL}/deck/${deckId}/study`);