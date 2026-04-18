import axiosClient from "./axiosClient";

const API_URL = "/api/decks";

export const getDecks = () => axiosClient.get(API_URL);

export const createDeck = (deck) => axiosClient.post(API_URL, deck);

export const deleteDeck = (id) => axiosClient.delete(`${API_URL}/${id}`);

export const getDeckById = (id) => {
    return axiosClient.get(`${API_URL}/${id}`);
}