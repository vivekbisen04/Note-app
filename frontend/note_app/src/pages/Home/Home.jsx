import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [openAddModel, setOpenAddModel] = useState({
    isShow: false,
    type: "add",
    data: null,
  });
  const [userInfo,setUserInfo]=useState(null);
  const [userName,setUserName]=useState("");
  const [notes,setNotes]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate=useNavigate();


  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");
     console.log(response.data.user.fullName);

     setUserName(response.data.user.fullName);
    //  console.log(userName);
     
     
     
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user info", error); // Log the error for debugging
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/auth/login");
      }
    }
  };

  const getNotes = async () => {
    try {
      const response = await axiosInstance.get("/all-notes  ");
      // console.log(response.data.notes);
      // Fetch all notes from backend
      setNotes(response.data.notes); // Assuming the backend sends notes in `response.data.notes`
    } catch (error) {
      console.error("Error fetching notes", error);
      
    }
  };

const handleAddNote = async (newNoteData) => {
  try {
    const response = await axiosInstance.post("/add-note", newNoteData);
    setNotes((prevNotes) => [...prevNotes, response.data.note]); // Add the new note to the existing notes
    setOpenAddModel({ isShow: false, type: "add", data: null }); // Close the modal
  } catch (error) {
    console.error("Error adding note", error);
  }
};
const handleEditNote = (noteData) => {
  // Populate the form with the note data and change the modal type to "edit"
  setOpenAddModel({
    isShow: true,
    type: "edit",
    data: noteData,
  });
};
const handleDeleteNote = async (noteId) => {
  try {
    await axiosInstance.delete(`/delete-note/${noteId}`); // Correct endpoint
    // Filter out the deleted note from the local state
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

// const handlePinNote = async (noteId, isPinned) => {
//   try {
//     await axiosInstance.patch(`/notes/${noteId}/pin`, { isPinned });
//     setNotes((prevNotes) =>
//       prevNotes.map((note) =>
//         note._id === noteId ? { ...note, isPinned } : note
//       )
//     );
//   } catch (error) {
//     console.error("Error pinning/unpinning note", error);
//   }
// };

const refreshNotes = async () => {
  await getNotes(); // Re-fetch notes after adding a new one
};
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    
    getUserInfo();
    getNotes();
    return () => { 
    };
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        userName={userName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex-wrap justify-between mx-auto ml-20 mr">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {filteredNotes.map(
            (note) =>
              note._id && (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={
                    note.createdAt
                      ? new Date(note.createdAt).toISOString().slice(0, 7)
                      : "No Date Available"
                  }
                  content={note.content}
                  tags={note.tags}
                  isPinned={note.isPinned}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note._id)}
                  onPinNotes={() => {}}
                />
              )
          )}
        </div>
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddModel({
            isShow: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddModel.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          onClose={() => {
            setOpenAddModel({
              isShow: false,
              type: "add",
              data: null,
            });
          }}
          refreshNotes={refreshNotes}
          openAddModel={openAddModel}
        />
      </Modal>
    </>
  );
};

export default Home;
