import axios from "axios";

const API_URL = "http://localhost:8080/api/decks";

export const getDecks = () => axios.get(API_URL);

export const createDeck = (deck) => axios.post(API_URL, deck);

export const deleteDeck = (id) => axios.delete(`${API_URL}/${id}`);

export const getDeckById = (id) => {
    return axios.get(`${API_URL}/${id}`);
}

