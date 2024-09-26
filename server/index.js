const express = require("express");
const app = express();
const cors = require("cors");

// connecting to db
require("./connections/db");
const Users = require("./models/user.model");
const Note=require("./models/note.model.js") // Importing the User model
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const {authenticateToken} =require('./utilities.js')

// Registration Route
app.post("/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already registered with this email" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new Users({
      fullName,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "THIS_IS_JWT_SECRET_KEY",
      {
        expiresIn: "1h",
      }
    );

    // Return the user and token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
const JWT_SECRET_KEY = process.env.JWT_SECRET || "THIS_IS_JWT_SECRET_KEY";
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Return success response with JWT token
    res.status(200).json({
      message: "Login successful",
      token, // Return the JWT token
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Add Note Route with Validation
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags, isPined } = req.body;

  // Validate required fields
  if (!title || !content) {
    return res
      .status(400)
      .json({
        error:
          "All fields must be filled. Title and content are required, and isPined must be a boolean.",
      });
  }

  try {
    // Create a new note
    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      isPined,
      userID: req.userId,
    });

   
    await newNote.save();

    res.status(201).json({
      message: "Note added successfully",
      note: newNote,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get("/user", authenticateToken, async (req, res) => {
  const userId = req.userId; // Get the authenticated user ID from the token

  try {
    // Find the user by their userId
    const user = await Users.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User details retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Edit Note Route
app.put("/edit-note/:noteID", authenticateToken, async (req, res) => {
  const { title, content, tags, isPined } = req.body;
  const noteID = req.params.noteID;

  const userId = req.userId; // Ensure you are using the correct user ID from the token

  // Validate required fields (optional, based on your requirements)
  if (!title && !content && tags === undefined && isPined === undefined) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update." });
  }

  try {
    // Find the note by ID and user ID
    const updatedNote = await Note.findOne({ _id: noteID, userID: userId });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Update the note properties only if provided
    if (title) updatedNote.title = title;
    if (content) updatedNote.content = content;
    if (tags !== undefined) updatedNote.tags = tags; // Check for undefined
    if (typeof isPined === "boolean") updatedNote.isPined = isPined; // Ensure isPined is boolean

    // Save the updated note
    await updatedNote.save();

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get("/all-notes", authenticateToken, async (req, res) => {
  const userId = req.userId; // Extract user ID from the token

  try {
    // Find all notes belonging to the authenticated user
    const userNotes = await Note.find({ userID: userId }).sort({isPined: -1});

    if (!userNotes.length) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    res.status(200).json({
      message: "Notes retrieved successfully",
      notes: userNotes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.delete("/delete-note/:noteID", authenticateToken, async (req, res) => {
  const noteID = req.params.noteID;
  const userId = req.userId; // Get the authenticated user ID from the token

  try {
    // Find the note by ID and ensure it belongs to the user
    const note = await Note.findOne({ _id: noteID, userID: userId });

    if (!note) {
      return res.status(404).json({
        error: "Note not found or you are not authorized to delete this note",
      });
    }

    // Delete the note
    await Note.findByIdAndDelete(noteID);

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/pin-note/:noteID", authenticateToken, async (req, res) => {
  const noteID = req.params.noteID;
  const userId = req.userId; // Get the authenticated user ID from the token
  const { isPined } = req.body; // isPined should be passed in the request body

  // Validate the request
  if (typeof isPined !== "boolean") {
    return res
      .status(400)
      .json({ error: "isPined must be a boolean value (true or false)" });
  }

  try {
    // Find the note by ID and ensure it belongs to the authenticated user
    const note = await Note.findOne({ _id: noteID, userID: userId });

    if (!note) {
      return res.status(404).json({
        error: "Note not found or you are not authorized to update this note",
      });
    }

    // Update the isPined field
    note.isPined = isPined;
    await note.save();

    res.status(200).json({
      message: `Note ${isPined ? "pinned" : "unpinned"} successfully`,
      note,
    });
  } catch (error) {
    console.error("Error updating pin status:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});







// Start the server
app.listen(8000, () => {
  console.log("Server is started on port->> 8000");
});
