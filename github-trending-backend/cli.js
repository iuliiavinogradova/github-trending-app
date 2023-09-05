const axios = require('axios');

const baseUrl = 'http://localhost:3001';

// fetch repository by id or name
const fetchRepositoryById = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/repository/${id}`);
        console.log('Command:', 'get-repo');
        console.log('Argument:', id);
        console.log('Repository:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};


const fetchAllRepositories = async () => {
    try {
        const response = await axios.get(`${baseUrl}/repositories`);
        console.log('Repositories:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const startSync = async () => {
    try {
        const response = await axios.post(`${baseUrl}/start-sync`);
        console.log(response.data.message);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const command = process.argv[2];
const argument = process.argv[3];

console.log('Command:', command);
console.log('Argument:', argument);


switch (command) {
    case 'get-repo':
        const repoId = process.argv[3]; // The repository ID argument
        if (repoId) {
            fetchRepositoryById(repoId);
        } else {
            console.log('Missing repository ID.');
        }
        break;
    case 'get-all':
        fetchAllRepositories();
        break;
    case 'start-sync':
        startSync();
        break;
    default:
        console.log('Invalid command.');
}


