import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInputs = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  // Update input value on change
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  // Add new tag to the list
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]); // Add the new tag
      setInputValue(""); // Reset input value after adding
    }
  };

  // Handle "Enter" key to add tag
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag(); // Trigger tag addition on Enter
    }
  };

  // Remove tag from the list
  const handleCloseTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove)); // Filter out the tag to remove
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full"
            >
              #{tag}
              <button
                className="text-red-500"
                onClick={() => handleCloseTag(tag)}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add tags"
          value={inputValue} // Correctly bind input value
          onChange={handleInput} // Handle input changes
          onKeyDown={handleKeyDown} // Handle key press
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-600"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-blue-600 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInputs;
