const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const About = require('./models/About');
const Skill = require('./models/Skill');
const Education = require('./models/Education');
const Achievement = require('./models/Achievement');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected for Seeding');
        seedData();
    })
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // Clear existing data
        await Project.deleteMany({});
        await Experience.deleteMany({});
        await About.deleteMany({});
        await Skill.deleteMany({});
        await Education.deleteMany({});
        await Achievement.deleteMany({});

        // Projects
        const projects = [
            // Data Science Projects
            {
                title: "HR Data Analysis",
                category: "Data Science",
                description: "Analyzed large-scale HR datasets to uncover trends in salary, performance, work mode, department, and job roles; built interactive dashboards to track workforce patterns over time.",
                techStack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau"],
                date: "Oct '25",
                type: "Personal Project",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
                link: "https://github.com/Praveen1708/HR-Analytics",
                repo: "https://github.com/Praveen1708/HR-Analytics"
            },
            {
                title: "Flight Data Analysis",
                category: "Data Science",
                description: "Collected, cleaned, and analyzed flight data to uncover patterns and trends. Performed exploratory data analysis (EDA).",
                techStack: ["Python", "Pandas", "Seaborn", "Matplotlib", "Jupyter Notebook"],
                date: "Sept '25",
                type: "Personal Project",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
                link: "https://github.com/Praveen1708/Flight-Data-Analysis",
                repo: "https://github.com/Praveen1708/Flight-Data-Analysis"
            },
            {
                title: "Weather Data Analysis",
                category: "Data Science",
                description: "Analyzed real-world weather datasets using Python and Pandas; filtered, grouped, and cleaned data while handling missing values.",
                techStack: ["Python", "Pandas", "Jupyter Notebook"],
                date: "Sept '25",
                type: "Personal Project",
                image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=1000",
                link: "https://github.com/Praveen1708/Weather-Analysis",
                repo: "https://github.com/Praveen1708/Weather-Analysis"
            },
            // Full Stack Projects
            {
                title: "Leave Form Application",
                category: "Full Stack",
                description: "Designed a digital leave form web application with auto-fill capabilities. Integrated jsPDF to generate downloadable PDFs.",
                techStack: ["React JS", "Tailwind CSS", "Node JS", "Express JS", "MongoDB", "jsPDF"],
                date: "July '25 - Present",
                type: "Team Project",
                image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
                link: "https://github.com/Praveen1708/Leave-Form-App",
                repo: "https://github.com/Praveen1708/Leave-Form-App"
            },
            {
                title: "Film Orbit",
                category: "Full Stack",
                description: "Built a sleek movie discovery app using TMDB API. Implemented search functionality and category filtering.",
                techStack: ["React JS", "Tailwind CSS"],
                date: "May '25 - June '25",
                type: "Personal Project",
                image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
                link: "https://film-orbit-demo.netlify.app",
                repo: "https://github.com/Praveen1708/Film-Orbit"
            },
            {
                title: "Voting System",
                category: "Full Stack",
                description: "A web-based voting system built using HTML, CSS, JavaScript, PHP, and MySQL to facilitate secure and efficient online voting.",
                techStack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
                date: "Sep '23 - Nov '24",
                type: "Personal Project",
                image: "https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=1000",
                link: "https://github.com/Praveen1708/Voting-System",
                repo: "https://github.com/Praveen1708/Voting-System"
            },
            {
                title: "Face Recognition System",
                category: "Machine Learning",
                description: "Recognizes faces from saved datasets with high accuracy using OpenCV and Tkinter.",
                techStack: ["Python", "OpenCV", "Tkinter"],
                date: "June 2023",
                type: "Personal Project",
                image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1000",
                link: "https://github.com/Praveen1708/Face-Recognition",
                repo: "https://github.com/Praveen1708/Face-Recognition"
            }
        ];
        await Project.insertMany(projects);

        // Experience
        const experiences = [
            {
                role: "MERN Stack Developer Intern",
                company: "Let’s Gam Tech",
                location: "Coimbatore",
                duration: "June '25 – July '25",
                description: [
                    "Developed a fully responsive weather app using React and styled with Tailwind CSS.",
                    "Integrated OpenWeatherMap API to fetch and display real-time weather data.",
                    "Implemented error handling, dynamic UI updates, and clean component structure."
                ],
                type: "Internship"
            }
        ];
        await Experience.insertMany(experiences);

        // Education
        const education = [
            {
                institution: "Karpagam College of Engineering",
                degree: "BE in Computer Science and Engineering",
                duration: "Aug '23 - Current",
                gpa: "8.0/10.0",
                courses: ["Computer Architecture", "Database Management System", "Data Structures and Algorithm", "Operating System"]
            }
        ];
        await Education.insertMany(education);

        // Skills
        const skills = [
            { category: "Languages", items: ["Python", "C", "C++", "SQL", "R", "JavaScript"] },
            { category: "Tools", items: ["MySQL", "MongoDB", "Power Bi", "Tableau"] },
            { category: "Platforms", items: ["Pycharm", "Jupyter Notebook", "Eclipse", "Visual Studio Code", "MongoDB Atlas"] },
            { category: "Soft Skills", items: ["Excellent Communication", "Creativity", "Leadership", "Problem Solving"] }
        ];
        await Skill.insertMany(skills);

        // Achievements
        const achievements = [
            { title: "Head of Software Development Club", description: "Serving as Head at Karpagam College of Engineering", date: "Present" },
            { title: "SIH 2025 External Round", description: "Selected for Civic Issue Reporting System", date: "Sep '25" },
            { title: "LeetCode Solver", description: "Solved 430+ problems", date: "Sep '25" },
            { title: "Introduction to Pandas Badge", description: "Earned from LeetCode", date: "Oct '24" }
        ];
        await Achievement.insertMany(achievements);

        // Certificates
        const Certificate = require('./models/Certificate');
        await Certificate.deleteMany({});
        const certifications = [
            {
                title: "Soft Skill Development",
                platform: "NPTEL",
                category: "Soft Skills",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "The Joy of Computing using Python",
                platform: "NPTEL",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Frontend Development - HTML",
                platform: "Great Learning",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Frontend Development - CSS",
                platform: "Great Learning",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Artificial Intelligence",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "https://www.dropbox.com/scl/fi/xivy3o0gqo62vzi98dug2/Artificial-Intelligence.pdf?rlkey=cd881thd9nomakkx7blnqfbmb&st=wcq3qcm5&dl=0",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Email Writing Skills",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Generative AI Unleashing",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "High Impact Presentations",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Introduction to Artificial Intelligence",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Introduction to Data Science",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Introduction to Deep Learning",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1639322537228-ad7117a3a634?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Introduction to Natural Language Processing",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1655720031554-a9296e47a63d?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Prompt Engineering",
                platform: "Infosys SpringBoard",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1684369166649-6f10255c279a?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Time Management",
                platform: "Infosys",
                category: "Soft Skills",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "ChatBot Creation with Generative AI",
                platform: "Udemy",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Image Processing with Python PIL",
                platform: "Udemy",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300"
            },
            {
                title: "Python for All Data Roles in 2025",
                platform: "Udemy",
                category: "Technical",
                pdfLink: "URL_TO_PDF_3",
                image: "https://images.unsplash.com/photo-1649180556628-9ba704115795?auto=format&fit=crop&q=80&w=300"
            }
        ];
        await Certificate.insertMany(certifications);

        // About (Profile) - Using Data Science as default for now, but adding fields to switch content if needed
        const about = {
            name: "Praveen M",
            title: "Data Science Enthusiast & MERN Stack Developer", // Combined title
            email: "praveen17082005@gmail.com",
            phone: "9489790927",
            location: "Thoothukudi",
            summary: "Passionate Data Science enthusiast and CSE undergraduate with hands-on experience in data analysis, machine learning, and building predictive models. Also skilled in MERN Stack development, building full-stack web applications. Leading the Software Development Club while continuously upskilling.",
            socialLinks: {
                linkedin: "LinkedIn",
                github: "GitHub",
                portfolio: "My Portfolio"
            },
            identifier: "main"
        };
        await About.create(about);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
