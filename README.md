﻿# Pokemon-Management-Application

# Overview
This application allows users to manage Pokemon data through a web interface. Users can add, edit, and delete Pokemon, as well as view a list of Pokemon associated with different users. The application consists of a frontend built with React and a backend server using Express.js.

# Features
Home Page: Displays a list of users and their Pokemon. Allows users to move, freeze, and vanish Pokemon.

Add Pokemon: Form to add new Pokemon, including attributes like name, ability, position, speed, and direction.

Edit Pokemon: Form to edit existing Pokemon details.

List Pokemon Users: View and manage Pokemon for each user. Includes options to add, edit, and delete Pokemon.

# Installation
Frontend

  Clone the repository
  
  Install dependencies
  
  Start the development server

Backend

  Navigate to the backend directory
  
  Install dependencies

  Start the server

# API Endpoints
GET /api/users: Retrieve a list of users.

GET /api/users/:userId: Retrieve details of a specific user.

POST /api/add-pokemon: Add a new Pokemon to a user or create a new user if one does not exist.

PUT /api/edit-pokemon/:userId/:pokemonId: Edit details of a Pokemon.

DELETE /api/delete-pokemon/:userId/:pokemonId: Delete a specific Pokemon.

DELETE /api/delete-all: Delete all users and their Pokemon.

# Frontend
src/components/: Contains React components for various pages and functionalities.

App.js: Main application component and routing configuration.

index.js: Entry point for the React application.

# Backend
routes/pokemonRoutes.js: Defines the routes for managing Pokemon data.

server.js: Sets up and starts the Express server.

data/data.json: File for storing user and Pokemon data.

# Usage
Home Page: Select a user to view and manage their Pokemon. Use buttons to move, freeze, or vanish Pokemon.

Add Pokemon: Fill out the form to add a new Pokemon. If no user exists, you can create a new one by entering their name.

Edit Pokemon: Update the details of an existing Pokemon.
List Pokemon Users: View all users and their Pokemon. Use buttons to add new Pokemon, or edit/delete existing ones.
