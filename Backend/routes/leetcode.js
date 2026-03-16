const express = require('express');
const router = express.Router();

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const query = `
        query getUserProfile($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                username
                submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
                badges {
                    id
                    name
                    shortName
                    displayName
                    icon
                    hoverText
                    medal {
                        slug
                        config {
                            iconGif
                            iconGifBackground
                        }
                    }
                    creationDate
                    category
                }
                profile {
                    ranking
                    reputation
                    starRating
                }
            }
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                topPercentage
                totalParticipants
            }
        }
        `;

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            body: JSON.stringify({
                query: query,
                variables: { username }
            })
        });

        if (!response.ok) {
            throw new Error(`LeetCode API responded with status: ${response.status} `);
        }

        const data = await response.json();

        if (data.errors) {
            return res.status(400).json({ error: data.errors });
        }

        if (!data.data || !data.data.matchedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(data.data);

    } catch (err) {
        console.error('LeetCode API Error:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
