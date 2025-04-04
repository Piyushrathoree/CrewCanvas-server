# CrewCanvas Server

This repository contains the server-side code for the CrewCanvas application. The server is built using Node.js, Express, and MongoDB. It handles user authentication, team space management, canvas operations, chat functionality, task management, and note-taking.

## Table of Contents

- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [TeamSpace Routes](#teamspace-routes)
    - [Canvas Routes](#canvas-routes)
    - [Chat Routes](#chat-routes)
    - [Task Routes](#task-routes)
    - [Note Routes](#note-routes)
- [Example Requests](#example-requests)

## Project Structure

```
server/
├── controllers/
│   ├── canvas.controller.js
│   ├── chat.controller.js
│   ├── note.controller.js
│   ├── task.controller.js
│   ├── teamSpace.controller.js
│   └── user.controller.js
├── database/
│   └── db.js
├── middlewares/
│   └── user.middleware.js
├── models/
│   ├── canvas.model.js
│   ├── chat.model.js
│   ├── note.model.js
│   ├── task.model.js
│   ├── teamSpace.model.js
│   └── user.model.js
├── routes/
│   └── user.route.js
├── .env.example
├── .gitignore
├── app.js
├── index.js
└── package.json
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_uri
DB_NAME=your_database_name
```

## Installation

1. Clone the repository:
        ```bash
        git clone https://github.com/yourusername/CrewCanvas.git
        cd CrewCanvas/server
        ```

2. Install dependencies:
        ```bash
        npm install
        ```

3. Set up environment variables:
        ```bash
        cp .env.example .env
        # Edit .env file with your values
        ```

4. Start the server:
        ```bash
        npm run dev
        ```

## Usage

The server will be running at `http://localhost:5000`. You can use tools like Postman to test the API endpoints.

## API Endpoints

### User Routes

- **Register User**
    - `POST /api/v1/register`
    - Request Body:
        ```json
        {
            "email": "user@example.com",
            "name": {
                "firstName": "John",
                "lastName": "Doe"
            },
            "password": "password123",
            "picture": "profile_picture_url"
        }
        ```

- **Login User**
    - `POST /api/v1/login`
    - Request Body:
        ```json
        {
            "email": "user@example.com",
            "password": "password123"
        }
        ```

- **Logout User**
    - `POST /api/v1/logout`

### TeamSpace Routes

- **Create TeamSpace**
    - `POST /api/v1/teamspace`
    - Request Body:
        ```json
        {
            "projectName": "Project Alpha",
            "OwnerId": "user_id",
            "canvas": "canvas_id",
            "chat": "chat_id"
        }
        ```

- **Get TeamSpace**
    - `GET /api/v1/teamspace/:teamSpaceId`

- **Add Member**
    - `POST /api/v1/teamspace/:teamSpaceId/member`
    - Request Body:
        ```json
        {
            "userId": "user_id",
            "role": "member"
        }
        ```

- **Remove Member**
    - `DELETE /api/v1/teamspace/:teamSpaceId/member/:userId`

- **Delete TeamSpace**
    - `DELETE /api/v1/teamspace/:teamSpaceId`

### Canvas Routes

- **Get Canvas by TeamSpace**
    - `GET /api/v1/canvas/:teamSpaceId`

- **Update Canvas Data**
    - `PUT /api/v1/canvas/:teamSpaceId`
    - Request Body:
        ```json
        {
            "data": {
                "shapes": [],
                "background": "white"
            }
        }
        ```

### Chat Routes

- **Get Chat by TeamSpace**
    - `GET /api/v1/chat/:teamSpaceId`

- **Add Message to Chat**
    - `POST /api/v1/chat/:teamSpaceId`
    - Request Body:
        ```json
        {
            "content": "Hello, team!"
        }
        ```

- **Delete Message**
    - `DELETE /api/v1/chat/:teamSpaceId/:messageId`

- **Delete Whole Chat**
    - `DELETE /api/v1/chat/:teamSpaceId`

### Task Routes

- **Create Task**
    - `POST /api/v1/task`
    - Request Body:
        ```json
        {
            "taskName": "Design Homepage",
            "taskDescription": "Create a responsive homepage design",
            "taskAssignedTo": "user_id"
        }
        ```

- **Get Task**
    - `GET /api/v1/task/:taskId`

- **Get Tasks from TeamSpace**
    - `GET /api/v1/task/teamspace/:teamSpaceId`

- **Update Task**
    - `PUT /api/v1/task/:taskId`
    - Request Body:
        ```json
        {
            "taskName": "Design Homepage",
            "taskDescription": "Update the homepage design"
        }
        ```

- **Delete Task**
    - `DELETE /api/v1/task/:taskId`

- **Toggle Task Status**
    - `PATCH /api/v1/task/:taskId/status`

### Note Routes

- **Create Note**
    - `POST /api/v1/note/:teamSpaceId`
    - Request Body:
        ```json
        {
            "title": "Meeting Notes",
            "content": "Discussed project milestones and deadlines."
        }
        ```

- **Get Note by ID**
    - `GET /api/v1/note/:noteId`

- **List Notes by TeamSpace**
    - `GET /api/v1/note/teamspace/:teamSpaceId`

- **Update Note**
    - `PUT /api/v1/note/:noteId`
    - Request Body:
        ```json
        {
            "title": "Updated Meeting Notes",
            "content": "Added new discussion points."
        }
        ```

- **Delete Note**
    - `DELETE /api/v1/note/:noteId`

## Example Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/v1/register \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com",
    "name": {
        "firstName": "John",
        "lastName": "Doe"
    },
    "password": "password123",
    "picture": "profile_picture_url"
}'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/v1/login \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com",
    "password": "password123"
}'
```

### Create TeamSpace

```bash
curl -X POST http://localhost:5000/api/v1/teamspace \
-H "Content-Type: application/json" \
-d '{
    "projectName": "Project Alpha",
    "OwnerId": "user_id",
    "canvas": "canvas_id",
    "chat": "chat_id"
}'
```

### Add Message to Chat

```bash
curl -X POST http://localhost:5000/api/v1/chat/teamSpaceId \
-H "Content-Type: application/json" \
-d '{
    "content": "Hello, team!"
}'
```
