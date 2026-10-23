# Wanderlust

Wanderlust is a travel and listing platform where users can discover, create, and review destinations. It allows travelers to browse curated places, view location details, leave reviews, and manage their own listings.

## Features

- Browse travel listings with images and location details
- Filter by Trending, Rooms, Iconic Cities, Mountains, Castle, Artics, Camping, Farms, Domes, and Boats
- Search stays by name or destination and view featured stays
- Create new listings for destinations
- Edit and delete existing listings
- Add reviews and ratings for places
- User authentication with signup, login, and logout
- Flash messages for success and error feedback
- Cloudinary integration for image uploads
- MongoDB-backed data storage
- Map support with Mapbox / location-based data

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templating
- Passport.js for authentication
- Cloudinary for image hosting
- Bootstrap for UI styling
- Mapbox integration for map-related features

To add or refresh the 20 curated sample stays in a database without deleting user listings, set `ATLASDB_URL` in `.env` and run:

```bash
npm run seed:featured
```

This command is safe to rerun; it creates or updates the unowned sample stays by title, while leaving user-owned listings untouched. Sample photos are loaded from Unsplash URLs.

## Project Structure

```text
wanderlust/
├── app.js                  # Main Express application
├── cloudconfig.js          # Cloudinary configuration
├── middleware.js           # Custom middleware
├── schema.js               # Joi validation schemas
├── package.json            # Project dependencies and scripts
├── .env                   # Environment variables
├── controller/            # Route/controller logic
├── init/                  # App initialization utilities
├── models/                # Mongoose models
├── public/                # Static assets (CSS, JS, images)
├── routes/                # Express route handlers
├── views/                 # EJS templates
└── README.md              # Project documentation
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string
- A Cloudinary account for image uploads
- A Mapbox token

## Installation

1. Clone the repository:

```bash
git clone https://github.com/haiderysaad/Wanderlust.git
cd Wanderlust
```

2. Install the dependencies:

```bash
npm install
```

3. Configure environment variables by creating a `.env` file in the project root:

```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust
SECRET=your_session_secret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
MAP_TOKEN=your_mapbox_token
```

## Running the Project

Start the application:

```bash
node app.js
```

The server runs on:

```text
http://localhost:8080
```

## Deploying to Render

Create a **Web Service** for this repository and use these settings:

- **Runtime:** Node
- **Build command:** `npm install`
- **Start command:** `npm start`

Add the following environment variables in the Render service settings:

```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust
SECRET=your_session_secret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
MAP_TOKEN=your_mapbox_token
```

`ATLASDB_URL`, `SECRET`, and `MAP_TOKEN` are required for the service to start. Allow the Render service to connect to your MongoDB Atlas cluster (for example, by configuring the cluster's network access rules). Render supplies the listening `PORT` automatically.

## Usage

- Sign up for a new account or log in
- Create travel listings with title, description, location, and image
- View each listing in detail
- Leave reviews for destinations
- Edit or remove listings you own

## Notes

- The app uses MongoDB sessions via `connect-mongo`.
- Images are uploaded using Cloudinary.
- The app expects a valid `ATLASDB_URL` and `SECRET` in the environment for proper startup.

## License

This project is licensed under the ISC License.

## Author

- haiderysaad
