const router = require('express').Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/auth');
const { fetchGitHubRepos } = require('../utils/github');
const parseDate = require('../utils/dateParser');

// Public: Get approved projects
router.get('/', async (req, res) => {
    try {
        const { sortBy } = req.query; // 'stars' or 'updated'
        let sortQuery = { isPinned: -1 };

        if (sortBy === 'stars') {
            sortQuery.stars = -1;
        } else if (sortBy === 'updated') {
            sortQuery.lastUpdated = -1;
        } else {
            sortQuery.startDate = -1; // Default
        }

        const projects = await Project.find({ 
            isApproved: true, 
            isHidden: false 
        }).sort(sortQuery);
        
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all projects (including unapproved)
router.get('/admin/all', verifyToken, async (req, res) => {
    try {
        const projects = await Project.find().sort({ lastUpdated: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Sync with GitHub
router.post('/sync', verifyToken, async (req, res) => {
    try {
        const username = 'MPrav143';
        const repos = await fetchGitHubRepos(username);
        
        const syncResults = {
            added: 0,
            updated: 0,
            skipped: 0
        };

        for (const repo of repos) {
            // Exclude forked, archived, or inactive (if user wants)
            if (repo.fork || repo.archived || repo.disabled) {
                syncResults.skipped++;
                continue;
            }

            const projectData = {
                title: repo.name,
                description: repo.description,
                repo: repo.html_url,
                link: repo.homepage,
                githubId: repo.id,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                lastUpdated: new Date(repo.updated_at),
                startDate: new Date(repo.created_at)
            };

            const existingProject = await Project.findOne({ githubId: repo.id });

            if (existingProject) {
                await Project.findByIdAndUpdate(existingProject._id, projectData);
                syncResults.updated++;
            } else {
                await new Project({
                    ...projectData,
                    isApproved: false // New projects need approval
                }).save();
                syncResults.added++;
            }
        }

        res.json({ message: 'Sync completed', results: syncResults });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Approve/Reject/Pin/Hide
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { isApproved, isPinned, isHidden } = req.body;
        const update = {};
        if (isApproved !== undefined) update.isApproved = isApproved;
        if (isPinned !== undefined) update.isPinned = isPinned;
        if (isHidden !== undefined) update.isHidden = isHidden;

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const sortDateString = req.body.fromDate || req.body.date;
    const projectData = {
        ...req.body,
        startDate: parseDate(sortDateString),
        isApproved: true // Manually added projects are approved by default
    };
    const project = new Project(projectData);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updateData = { ...req.body };
        const sortDateString = updateData.fromDate || updateData.date;
        if (sortDateString) {
            updateData.startDate = parseDate(sortDateString);
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
