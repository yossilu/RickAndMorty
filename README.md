# Rick and Morty Explorer
## Welcome to the Rick and Morty Explorer app! This project allows you to explore characters and locations from the Rick and Morty universe. The app features full JWT authentication with two types of users: ADMIN and USER, each with different permissions and functionalities.

Getting Started:
Prerequisites: 
- Node.js
- npm (Node Package Manager)
- MongoDB
  
#### Backend Setup

Navigate to the backend folder:
- cd backend
- npm install

Set up your environment variables:
Create a .env file in the backend folder and add the following:

env
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
  
Start the backend server:
- node server
  
#### Frontend Setup
- cd frontend
- npm install

Start the frontend server:
npm run dev

### What Does the App Do?
### The Rick and Morty Explorer app is designed to allow users to explore characters and locations from the Rick and Morty universe. Here’s a rundown of its main features:

## Main APIs
### Characters API:
Fetches and displays characters from the Rick and Morty API.
Allows users to search, filter, and paginate through the list of characters.

### Locations API:
Fetches and displays locations from the Rick and Morty API.
This feature is only accessible to ADMIN users to demonstrate the authentication middleware in action.

### User Types
The app has two types of users: ADMIN and USER. Depending on the user type, different functionalities and UI elements are available:

#### ADMIN Users:

- Can access the "Locations" button.
- Have additional filters for searching characters.
- Can open character cards to view more detailed information.
- Have access to specific dashboards/pages guarded by frontend routing.
  
#### USER Users:

- Can view and search characters.
- Do not have access to the "Locations" button which is there for USER role on purpose or the additional filters available to ADMIN users.
  
## Authentication
The app implements full JWT authentication with MongoDB as the NoSQL database. Users can sign up as either an ADMIN or a USER. The authentication system ensures secure access to the different parts of the app based on user roles.

## Frontend Guarding and Context
#### Frontend Guarding: 
Using React Router v6, certain routes and components are protected based on the user's role. This ensures that only authorized users can access certain parts of the app.

#### React Context: 
A context hook is implemented as a secondary option for state management. While it's less practical than useQuery due to caching, it provides an alternative approach for managing global state in the app.

## How to Use the App
Sign Up: Register as either an ADMIN or a USER.
Log In: Log in with your credentials to access the app.
Explore Characters: Use the search and filter options to explore different characters.
Admin Features: If logged in as an ADMIN, click the "Locations" button to explore locations and access additional features.
View Details: Click on a character card (as an ADMIN) to view more detailed information in a modal.

## Additional Notes
- The search bar holds 2 different types of filters, Name which gets his autocomplete from the results, and the rest of the filters which got their options beforhand.
- The app uses useQuery for data fetching, which provides efficient caching and state management.
- Authentication is handled using JWT, ensuring secure and scalable user management.
- MongoDB is used as the NoSQL database for storing user data.
