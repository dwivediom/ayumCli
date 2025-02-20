import React, { useState } from "react";

const emojis = ["😡", "😞", "😐", "😊", "😍"];
const labels = ["Terrible", "Bad", "Okay", "Good", "Excellent"];

const EmojiRating = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Rate your experience</h2>
      <div className="flex space-x-4">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`text-3xl transition-transform transform hover:scale-125 ${
              selected === index ? "scale-150" : ""
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="mt-2 text-lg font-medium text-gray-700">
          {labels[selected]}
        </p>
      )}
    </div>
  );
};

export default EmojiRating;
