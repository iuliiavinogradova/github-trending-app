import { getRepositories, startSync, searchRepo } from '../api'; // Import API functions
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RepositoriesList.css';

function RepositoriesList() {
    const [repositories, setRepositories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [syncSuccessMessage, setSyncSuccessMessage] = useState('');

    const navigate = useNavigate();

    const fetchRepositories = async () => {
        try {
            const response = await getRepositories();
            setRepositories(response);
        } catch (error) {
            console.error('Error fetching repositories', error);
        }
    };

    useEffect(() => {
        // Fetch repository details from API and update state
        fetchRepositories();
    }, []);

    const handleSyncClick = async () => {
        try {
            await startSync();
            // After syncing, fetch and update the repositories list
            fetchRepositories();
            setSyncSuccessMessage('Sync successful!');
            // Clear the success message after a delay (e.g., 3 seconds)
            setTimeout(() => {
                setSyncSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error syncing repositories', error);
        }
    };


    const handleSearchClick = async () => {
        try {
            const matchingRepositories = await searchRepo(searchTerm);
            console.log('Matching Repositories:', matchingRepositories.id);

            //navigate to the repository details page

            navigate(`/repository/${matchingRepositories.id}`);

        } catch (error) {
            console.error('Error searching repositories', error);
        }
    };



    return (
        <div className="repositories-list-container">
            <h2 className="section-title">Trending GitHub Repositories</h2>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter name or id"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="button-container">
                    <button onClick={handleSearchClick}>Search repository</button>
                    <button onClick={handleSyncClick}>Start sync with GitHub</button>
                </div>
            </div>
            {syncSuccessMessage && (
                <div className="sync-success-message">
                    {syncSuccessMessage}
                </div>
            )}
            <ul className="repositories-list">
                {repositories.map(repo => (
                    <li key={repo.id} className="repository-item">
                        <Link to={`/repository/${repo.id}`} className="repository-link">
                            <div className="repository-details">
                                <h3 className="repository-name">{repo.name}</h3>
                                <p className="repository-stars">{repo.stars} stars</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RepositoriesList;
