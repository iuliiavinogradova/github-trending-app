const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const cors = require('cors');


const app = express();
const port = 3001;

let manualSyncTriggered = false;

app.use(express.json());
app.use(cors());

require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;


const db = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
});


console.log('Connecting to MySQL server with configuration:');
console.log('Host:', db.config.connectionConfig.host);
console.log('User:', db.config.connectionConfig.user);
console.log('Password:', db.config.connectionConfig.password);
console.log('Database:', db.config.connectionConfig.database);


// Endpoint to get a repository by ID or name
app.get('/repository/:id', (req, res) => {
    const repositoryId = req.params.id;
    console.log('Received request for repository ID:', repositoryId);

    const query = 'SELECT * FROM repositories WHERE id = ? OR name = ?';
    db.query(query, [repositoryId, repositoryId], (err, results) => {
        if (err) {
            console.error('Error fetching repository:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            const repository = results[0];
            res.status(200).json(repository);
        }
    });
});

// Endpoint to get all repositories
app.get('/repositories', (req, res) => {
    const query = 'SELECT * FROM repositories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching repositories:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Endpoint to manually trigger sync
app.all('/start-sync', async (req, res) => {
    try {
        manualSyncTriggered = true;
        await fetchAndSaveRepositories();
        manualSyncTriggered = false;
        res.status(200).json({ message: 'Manual Sync completed successfully' });
    } catch (error) {
        console.error('Error during manual sync:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to handle the automatic sync
const handleAutomaticSync = async () => {
    try {
        if (!manualSyncTriggered) {
            await fetchAndSaveRepositories();
        } else {
            console.log('Manual sync in progress, skipping automatic sync.');
        }
    } catch (error) {
        console.error('Error during automatic sync:', error);
    }
};


// Endpoint to start automatic sync every X minutes
const syncIntervalMinutes = 1; // Set interval in minutes
setInterval(handleAutomaticSync, syncIntervalMinutes * 60 * 1000);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const fetchAndSaveRepositories = async () => {
    try {
        const trendingUrl = 'https://api.github.com/search/repositories?q=stars:>=10000&sort=stars&order=desc';

        // Fetch data from the GitHub API
        const response = await axios.get(trendingUrl);

        if (response.status === 200) {
            const repositories = response.data.items;

            // Begin a database transaction
            db.getConnection(async (err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    return;
                }

                try {
                    // Start a transaction
                    await connection.beginTransaction();

                    const deleteQuery = 'DELETE FROM repositories';
                    await connection.query(deleteQuery);

                    // Reset the auto-increment primary key (ID)
                    const resetAutoIncrementQuery = 'ALTER TABLE repositories AUTO_INCREMENT = 1';
                    await connection.query(resetAutoIncrementQuery);
                    console.log('Auto-increment reset successfully');

                    // Insert the new top repositories
                    for (const repo of repositories) {
                        const insertQuery = 'INSERT INTO repositories (name, url, stars) VALUES (?, ?, ?)';
                        const values = [repo.name, repo.html_url, repo.stargazers_count];
                        await connection.query(insertQuery, values);
                    }

                    // Commit the transaction
                    await connection.commit();

                    console.log('Top repositories updated in the database.');
                } catch (error) {
                    // Rollback the transaction in case of an error
                    await connection.rollback();
                    console.error('Error updating top repositories:', error);
                } finally {
                    // Release the connection back to the pool
                    connection.release();
                }
            });
        } else {
            console.error('GitHub API request failed with status code:', response.status);
        }
    } catch (error) {
        console.error('Error fetching and saving repositories:', error);
    }
};













