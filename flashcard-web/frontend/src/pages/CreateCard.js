import React, { useState } from "react";
import { createCard } from "../api/cardApi";

function CreateCard() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCard({ front, back });
    alert("Created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Front"
        value={front}
        onChange={(e) => setFront(e.target.value)}
      />
      <input
        placeholder="Back"
        value={back}
        onChange={(e) => setBack(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateCard;