# GitHub Trending Repositories App

This project is a full-stack application that tracks trending repositories on GitHub and provides both a [web-based front-end]('Home page.png') and a CLI (Command-Line Interface) for interacting with the service.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (for running the React app and CLI)
- [MySQL](https://www.mysql.com/) (for database storage)

### Installation

1. Clone this repository to your local machine using Git:

git clone https://github.com/iuliiavinogradova/github-trending-app.git

2. Navigate to the project folder:

cd github-trending-app

3. Install the project dependencies:

npx create-react-app client

npm init -y

npm install express cors axios dotenv mysql

npm install -g nodemon

### Running the React App

To run the React app in development mode, use the following command:

npm start

This will start the development server, and you can access the app in your browser at http://localhost:3000.

### Starting the Backend Server

The backend server is responsible for fetching and storing trending repositories from GitHub. To start it, run any of the following commands:

node server.js

nodemon server.js

npm start

### Using the CLI

We provide a command-line interface (CLI) for interacting with the service. Here are some example commands:

1. To get all repositories:

node cli.js get-all

2. To get a specific repository by ID or name (replace 1 with the desired ID):

node cli.js get-repo 1

3. To start a sync with GitHub:

node cli.js start-sync (resetting the internal timer)

### Database Configuration

You'll need to set up a MySQL database for storing repository data. Use the following command:

DB_HOST=localhost DB_USER=root DB_PASSWORD=your_mysql_password DB_DATABASE=github_trending node setup-database.js

1. Access MySQL:

mysql -u root -p

2. use github_trending;

3. select \* from repositories;
