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

        // 1. Direct Entity Matching (Exact project title / certificate / skill / experience / achievement)
        const findMatch = (items, key) => {
            if (!items) return null;
            let match = items.find(item => item[key] && lowerInput.includes(item[key].toLowerCase()));
            if(match) return match;
            const words = lowerInput.split(' ').filter(w => w.length > 3);
            for (let w of words) {
                match = items.find(item => item[key] && item[key].toLowerCase().includes(w));
                if (match) return match;
            }
            return null;
        };

        const projectMatch = findMatch(context?.projects, 'title');
        const certMatch = findMatch(context?.certificates, 'title');
        const skillMatch = findMatch(context?.skills, 'name');
        const expMatch = findMatch(context?.experience, 'company') || findMatch(context?.experience, 'role');
        const achMatch = findMatch(context?.achievements, 'title');

        if (projectMatch) {
            return res.json({
                reply: `I built ${projectMatch.title}, a ${projectMatch.category || "modern"} application. ${projectMatch.description || ""}`,
                action: "projects",
                highlight: projectMatch.title.toLowerCase()
            });
        }

        if (certMatch) {
            return res.json({
                reply: `I hold a certification in ${certMatch.title} from ${certMatch.issuer || certMatch.platform || "an external provider"}. ${certMatch.description || ""}`,
                action: "certificates",
                highlight: certMatch.title.toLowerCase()
            });
        }

        if (skillMatch) {
            return res.json({
                reply: `Yes, I am highly skilled in ${skillMatch.name}. I frequently use it within my tech stack.`,
                action: "skills",
                highlight: skillMatch.name.toLowerCase()
            });
        }

        if (expMatch) {
            return res.json({
                reply: `I worked as a ${expMatch.role} at ${expMatch.company}. ${expMatch.description || ""}`,
                action: "experience",
                highlight: expMatch.company.toLowerCase()
            });
        }

        if (achMatch) {
            return res.json({
                reply: `I achieved ${achMatch.title}. ${achMatch.description || ""}`,
                action: "achievements",
                highlight: achMatch.title.toLowerCase()
            });
        }

        // 2. Fuzzy Classifier Matching 
        const intent = classifier.classify(lowerInput);

        if (intent === 'about_me') {
            const about = context?.about || {};
            const bio = about.description || about.summary || "I am a passionate developer.";
            const name = about.name || "Praveen";
            const role = about.title || "Developer";
            return res.json({
                reply: `I am ${name}, working as a ${role}. ${bio} I have built expertise across ${context?.projects?.length || 'several'} projects.`,
                action: "hero",
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
             const projNames = context?.projects?.slice(0, 2).map(p => p.title).join(" and ") || "various modern applications";
             return res.json({
                 reply: `Alright… let me take you through my work. I’ve moved to the projects section. My highlights include ${projNames}.`,
                 action: "projects",
                 highlight: ""
             });
        }

        if (intent === 'nav_skills') {
             const skills = context?.skills?.slice(0, 3).map(s => s.name).join(", ") || "various modern tech stacks";
             return res.json({
                 reply: `Let me show you my skills section. I’ve built expertise in ${skills}. Here is my entire technical arsenal.`,
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
