import axiosClient from "./axiosClient";

export const startStudy = (deckId) => {
  return axiosClient.post(`/api/study/start/${deckId}`);
};

export const endStudy = (sessionId, cardsLearned) => {
  return axiosClient.post(
    `/api/study/end/${sessionId}?cardsLearned=${cardsLearned}`
  );
};