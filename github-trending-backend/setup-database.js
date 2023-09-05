const mysql = require('mysql');

require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// Database configuration
const dbConfig = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
};

// Create a MySQL connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }

    console.log('Connected to MySQL');

    // Create the database and table
    connection.query('CREATE DATABASE IF NOT EXISTS github_trending', (createDbError) => {
        if (createDbError) {
            console.error('Error creating database:', createDbError);
            throw createDbError;
        }

        console.log('Database "github_trending" created or already exists');

        // Use the "github_trending" database
        connection.query('USE github_trending', (useDbError) => {
            if (useDbError) {
                console.error('Error selecting database:', useDbError);
                throw useDbError;
            }

            console.log('Using database "github_trending"');

            // Create the "repositories" table
            connection.query(`
                CREATE TABLE IF NOT EXISTS repositories (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    stars INT,
                    url VARCHAR(255)
                )
            `, (createTableError) => {
                if (createTableError) {
                    console.error('Error creating table:', createTableError);
                    throw createTableError;
                }

                console.log('Table "repositories" created or already exists');

                // Close the MySQL connection
                connection.end((endError) => {
                    if (endError) {
                        console.error('Error closing connection:', endError);
                        throw endError;
                    }

                    console.log('MySQL connection closed');
                });
            });
        });
    });
});
