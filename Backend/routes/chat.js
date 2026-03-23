const express = require('express');
const router = express.Router();
const natural = require('natural');

// --- 1. SETUP CLASSFIER & TRAIN ---
const classifier = new natural.BayesClassifier();

// Intent: About / Bio
classifier.addDocument('tell me about yourself', 'about_me');
classifier.addDocument('who is praveen', 'about_me');
classifier.addDocument('explain about you', 'about_me');
classifier.addDocument('describe yourself', 'about_me');
classifier.addDocument('tell me about me', 'about_me');

// Intent: Projects Summary
classifier.addDocument('show me your projects', 'nav_projects');
classifier.addDocument('what work have you done', 'nav_projects');
classifier.addDocument('summarize your work', 'nav_projects');
classifier.addDocument('your application list', 'nav_projects');

// Intent: Quantities
classifier.addDocument('how many projects have you made', 'projects_count');
classifier.addDocument('total project count', 'projects_count');
classifier.addDocument('how many works', 'projects_count');

// Intent: Navigation
classifier.addDocument('show me skills', 'nav_skills');
classifier.addDocument('what is your tech stack', 'nav_skills');
classifier.addDocument('skills info', 'nav_skills');

classifier.addDocument('certificates portfolio', 'nav_certificates');
classifier.addDocument('show me certificates', 'nav_certificates');
classifier.addDocument('course certificates', 'nav_certificates');

classifier.addDocument('how to contact', 'nav_contact');
classifier.addDocument('your email', 'nav_contact');
classifier.addDocument('hire you', 'nav_contact');

classifier.train();

// --- 2. ROUTE ENDPOINT ---
router.post('/', async (req, res) => {
    try {
        const { message, context } = req.body;
        if (!message) return res.json({ reply: "I didn't catch that... could you repeat?", action: "", highlight: "" });
        
        const lowerInput = message.trim().toLowerCase();

        // 1. Direct Entity Matching (Exact project title / certificate / skill)
        const projectMatch = context?.projects?.find(p => p.title && (lowerInput.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(lowerInput)));
        const certMatch = context?.certificates?.find(c => c.title && (lowerInput.includes(c.title.toLowerCase()) || c.title.toLowerCase().includes(lowerInput)));
        const skillMatch = context?.skills?.find(s => s.name && (lowerInput.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerInput)));

        if (projectMatch) {
            return res.json({
                reply: `That’s one of my key projects. I created ${projectMatch.title} which is a ${projectMatch.category} application. ${projectMatch.description || ""}`,
                action: "projects",
                highlight: projectMatch.title.toLowerCase()
            });
        }

        if (certMatch) {
            return res.json({
                reply: `That’s one of my certificates. I earned the certification in ${certMatch.title} from ${certMatch.issuer || "my collection"}.`,
                action: "certificates",
                highlight: certMatch.title.toLowerCase()
            });
        }

        if (skillMatch) {
            return res.json({
                reply: `That’s something I use quite often. I’ve worked with ${skillMatch.name} to build dynamic and responsive interfaces, especially in my full-stack applications.`,
                action: "skills",
                highlight: skillMatch.name.toLowerCase()
            });
        }

        // 2. Fuzzy Classifier Matching 
        const intent = classifier.classify(lowerInput);

        if (intent === 'about_me') {
            const about = context?.about || {};
            const bio = about.description || about.summary || "I am a passionate developer.";
            return res.json({
                reply: `I am ${about.title || "a Developer"}. ${bio} I have built expertise in building full lifecycle applications and dealing with real-world data scopes.`,
                action: "",
                highlight: ""
            });
        }
        
        if (intent === 'projects_count') {
             return res.json({
                 reply: `I have worked on and completed a total of ${context?.projects?.length || 0} projects. Let me take you to my projects section to see them.`,
                 action: "projects",
                 highlight: ""
             });
        }

        if (intent === 'nav_projects') {
             return res.json({
                 reply: "Alright… let me take you through my work. I’ve moved to the projects section. One of my key projects focuses on analyzing real-world data to extract meaningful insights.",
                 action: "projects",
                 highlight: ""
             });
        }

        if (intent === 'nav_skills') {
             return res.json({
                 reply: "Let me show you my skills section. I’ve built expertise in various tech stacks like Python and MERN. Here is what I use frequently.",
                 action: "skills",
                 highlight: ""
             });
        }

        if (intent === 'nav_certificates') {
             return res.json({
                 reply: "Let me show you my certificate section. I’ve worked on multiple skill courses to bolster my development profile.",
                 action: "certificates",
                 highlight: ""
             });
        }

        if (intent === 'nav_contact') {
             return res.json({
                 reply: "You can reach out to me via my contact form or email. I’ve taken you to the contact section.",
                 action: "contact",
                 highlight: ""
             });
        }

        // Fallback
        res.json({
            reply: "I’m not entirely sure about that yet… but feel free to explore more or ask me something else.",
            action: "",
            highlight: ""
        });

    } catch (error) {
        console.error("Local NLP chat Error:", error);
        res.status(500).json({ reply: "I failed to process that request due to a server error.", action: "", highlight: "" });
    }
});

module.exports = router;
