// Suggested additional questions for the frontend and backend:
// - Do you prefer working with visuals and design, or logic and problem-solving?
// - Are you interested in building mobile apps, websites, or something else?
// - Do you enjoy collaborating with others or working independently?
// - What motivates you more: seeing immediate results, or working on long-term projects?
// - Are you interested in user experience, data analysis, or infrastructure?

export const getRecommendation = async (req, res) => {
    try {
        const {
            programmingExperience = '',
            preferredTechnology = '',
            creativeInterest = '',
            interests = [],
            learningStyle = '',
            workPreference = '',
            priorExperience = '',
            careerGoals = '',
            projectScope = '',
            // Add more fields as you expand the form
        } = req.body;

        // Logic for track recommendation
        let track = "Full Stack Web Development";
        let description = "This track is perfect for students interested in both frontend and backend development, covering everything from HTML/CSS to databases and APIs.";
        let learningPath = [
            "Introduction to HTML, CSS, and JavaScript",
            "Responsive Web Design",
            "Version Control with Git",
            "Frontend Frameworks (React)",
            "Backend Development (Node.js, Express)",
            "Databases (MongoDB, SQL)",
            "RESTful APIs",
            "Deployment and DevOps Basics"
        ];

        // Mobile Development Track
        if (
            preferredTechnology === 'Mobile Development' ||
            interests.includes('Mobile Apps') ||
            (careerGoals && careerGoals.toLowerCase().includes('mobile'))
        ) {
            track = "Mobile App Development";
            description = "This track is ideal for those who want to build apps for iOS and Android, focusing on mobile UI/UX, cross-platform tools, and app deployment.";
            learningPath = [
                "Introduction to Mobile App Development",
                "UI/UX for Mobile Apps",
                "React Native or Flutter Basics",
                "State Management in Mobile Apps",
                "APIs and Data Storage",
                "Publishing Apps to App Stores"
            ];
        }

        // UI/UX Design (Non-programming) Track
        if (
            creativeInterest === 'Yes' &&
            (interests.includes('Visual Design') || priorExperience === 'Design Tools')
        ) {
            track = "UI/UX Design";
            description = "This track is for creative individuals who enjoy designing user interfaces and experiences, focusing on design principles, prototyping, and user research.";
            learningPath = [
                "Principles of Design",
                "User Research and Personas",
                "Wireframing and Prototyping",
                "Design Tools (Figma, Adobe XD)",
                "Usability Testing",
                "Portfolio Development"
            ];
        }

        // Data Analysis Track (Non-programming, if interested)
        if (
            interests.includes('Data Analysis') ||
            (careerGoals && careerGoals.toLowerCase().includes('analytics'))
        ) {
            track = "Data Analysis";
            description = "This track is for those interested in working with data, learning how to collect, analyze, and visualize information to make informed decisions.";
            learningPath = [
                "Introduction to Data Analysis",
                "Excel & Google Sheets",
                "Data Visualization Tools (Tableau, Power BI)",
                "Basic Statistics",
                "Reporting and Dashboards"
            ];
        }

        // You can add more tracks and logic as needed

        res.status(200).json({
            track,
            description,
            learningPath
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting recommendations",
            error: error.message
        });
    }
}; 