# CrewCanvas Server

This is the backend server for the CrewCanvas application. It is built using Node.js, Express, and MongoDB.

## File Structure

```
/server
|-- controllers
|   |-- note.controller.js
|   |-- task.controller.js
|   |-- teamSpace.controller.js
|   |-- user.controller.js
|
|-- middlewares
|   |-- user.middleware.js
|
|-- models
|   |-- canvas.model.js
|   |-- chat.model.js
|   |-- note.model.js
|   |-- teamSpace.model.js
|   |-- user.model.js
|
|-- routes
|   |-- user.route.js
|
|-- database
|   |-- db.js
|
|-- .env.example
|-- app.js
|-- index.js
|-- package.json
|-- readme.md
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
NODE_ENV=
PORT=
JWT_SECRET=
MONGO_URI= 
DB_NAME=
```

## Routes

### User Routes

- **Register User**
    - **URL:** `/api/v1/register`
    - **Method:** `POST`
    - **Description:** Registers a new user.

- **Login User**
    - **URL:** `/api/v1/login`
    - **Method:** `POST`
    - **Description:** Logs in an existing user.

- **Logout User**
    - **URL:** `/api/v1/logout`
    - **Method:** `POST`
    - **Description:** Logs out the current user.

### Note Routes

- **Create Note**
    - **URL:** `/api/v1/notes/:teamspaceId`
    - **Method:** `POST`
    - **Description:** Creates a new note in the specified teamspace.

- **Get Note by ID**
    - **URL:** `/api/v1/notes/:noteId`
    - **Method:** `GET`
    - **Description:** Retrieves a note by its ID.

- **List Notes by Teamspace**
    - **URL:** `/api/v1/notes/teamspace/:teamSpaceId`
    - **Method:** `GET`
    - **Description:** Lists all notes in the specified teamspace.

- **Update Note**
    - **URL:** `/api/v1/notes/:noteId`
    - **Method:** `PUT`
    - **Description:** Updates an existing note by its ID.

- **Delete Note**
    - **URL:** `/api/v1/notes/:noteId`
    - **Method:** `DELETE`
    - **Description:** Deletes a note by its ID.

### TeamSpace Routes

- **Create TeamSpace**
    - **URL:** `/api/v1/teamspaces`
    - **Method:** `POST`
    - **Description:** Creates a new teamspace.

### Task Routes

- **Task Routes will be added here**

## Installation

1. Clone the repository.
2. Navigate to the `/server` directory.
3. Run `npm install` to install dependencies.
4. Create a `.env` file and add the required environment variables.
5. Run `npm run dev` to start the development server.

## License

This project is licensed under the MIT License.