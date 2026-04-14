const axios = require('axios');

const fetchGitHubRepos = async (username) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Add token if available in env
                ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub repos:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = { fetchGitHubRepos };
