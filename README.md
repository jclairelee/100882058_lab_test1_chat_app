# COMP 3133 – Lab Test 1 – Chat Application

Student ID: 100882058  
Course: COMP 3133  
Semester: Winter 2026

---

## Project Overview

This is a real-time chat application built using:

- Express
- Socket.io
- MongoDB (Mongoose)
- HTML5
- Bootstrap
- Fetch API
- localStorage

The application supports user authentication, room-based messaging, private messaging, typing indicators and MongoDB message persistence.

---

## Features

### Authentication

- Signup with unique username validation
- Login with credential verification
- Session stored using localStorage
- Logout functionality

### Room-Based Chat

- Join predefined rooms
- Leave rooms
- Real-time messaging with Socket.io
- Messages stored in MongoDB
- Chat history loads when rejoining a room

### Private Messaging (1-to-1)

- Select another user to start private chat
- Real-time private messaging
- Private messages stored in MongoDB
- Private chat history loads on open

### Typing Indicator

- Displays “User is typing...” in private chat
- Real-time typing updates using Socket.io

---

## Setup Instructions

1. Install dependencies:
   npm install

2. Create file:
   server/.env

3. Add the following inside .env:
   MONGO_URI=your_mongodb_connection_string  
   PORT=3000

4. Start the server:
   npm run dev

5. Open in browser:
   http://localhost:3000/signup.html

---

## MongoDB Collections

- users
- groupmessages
- privatemessages

---

## Submission

Screenshots demonstrating functionality are included in the submitted PDF/DOCX file.

All requirements have been implemented.
