import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRepositoryById } from '../api'; // Import API functions
import './RepositoryDetails.css';

function RepositoryDetails() {
    const { id } = useParams();
    const [repository, setRepository] = useState(null);

    useEffect(() => {
        // Fetch repository details from API and update state
        getRepositoryById(id)
            .then(response => setRepository(response))
            .catch(error => console.error('Error fetching repository details:', error));
    }, [id]);


    if (!repository) {
        return <div>Repository not found.{repository}</div>;
    }

    return (
        <div className="repository-details-container">
            <h2 className="section-title">Repository Details</h2>
            <div className="repository-details">
                <h3 className="repository-name">{repository.name}</h3>
                <p className="repository-stars">{repository.stars} stars</p>
                <p className="repository-url">
                    URL: <a href={repository.url} target="_blank" rel="noopener noreferrer">{repository.url}</a>
                </p>
            </div>
        </div>
    );
}

export default RepositoryDetails;
