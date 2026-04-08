import axios from "axios";

const API_URL = "http://localhost:8080/api/cards";

export const getCards = () => axios.get(API_URL);

export const createCard = (card) => axios.post(API_URL, card);

export const deleteCard = (id) => axios.delete(`${API_URL}/${id}`);

