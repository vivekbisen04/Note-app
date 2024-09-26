import React, { useState,useEffect } from "react";
import TagInputs from "../../components/Inputs/TagInputs";
import { MdClose } from "react-icons/md";

import axiosInstance from "../../utils/axiosInstance";
import { MdOutlinePushPin} from "react-icons/md";

const AddEditNotes = ({ onClose, refreshNotes, openAddModel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  // const [pin, setPin] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = openAddModel.type === "edit";
  const noteData = openAddModel.data; // Data of the note being edited

  useEffect(() => {
    if (isEditMode && noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags);
    }
  }, [isEditMode, noteData]);

  const handleSaveNote = async () => {
    const notePayload = { title, content, tags };

    try {
      if (isEditMode) {
        // Make API call to update the note
        const response = await axiosInstance.put(
          `/edit-note/${noteData._id}`,
          notePayload
        );
        console.log("Note updated:", response);
      } else {
        // Make API call to add a new note
        const response = await axiosInstance.post("/add-note", notePayload);
        console.log("Note added:", response);
      }

      if (refreshNotes) {
        refreshNotes(); // Refresh notes after adding or editing
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error(
        isEditMode ? "Error updating note" : "Error adding note",
        error
      );
      setError("Failed to save note. Please try again.");
    }
  };

  // const handleAddNote = async () => {
  //   try {
  //     const response = await axiosInstance.post("/add-note", {
  //       title,
  //       content,
  //       tags,
  //     });
  //     console.log("Note added:", response);
  //     if (response.data && response.data.notes) {
  //       refreshNotes(), onClose();
  //     }

  //     if (refreshNotes) {
  //       refreshNotes(); // Call the function to refresh notes
  //     }

  //     // Clear the form only after adding the note successfully
  //     setTitle("");
  //     setContent("");
  //     setTags([]);
  //     onClose();
  //   } catch (error) {
  //     console.log("Error adding note:", error);
  //     setError("Failed to add note. Please try again.");
  //   }
  // };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute top-3 right-3 hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value);
          }}
          placeholder="Gym"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-500 outline-none bg-slate-50 p-2 rounded "
          placeholder="Content"
          value={content}
          onChange={({ target }) => {
            setContent(target.value);
          }}
          rows={10}
        />
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInputs tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className=" btn-primary font-medium mt-5 p-3"
        onClick={handleSaveNote}
      >
        {isEditMode ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
