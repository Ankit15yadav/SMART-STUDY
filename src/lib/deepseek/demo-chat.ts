import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your API key is available.
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const ModelParams = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

export const AiBasedGroupJoining = async (
    resume: string | undefined,
    Grouptags: string[],
    privateGroupInfo: string,
    learningGoals: string,
    studyPreference: string,
) => {
    const prompt = `
You are an expert evaluator for private groups. An applicant has applied to join a private group, and the group owner has specified the required skills for members. Evaluate the application based on the information provided below, and speak directly to the applicant as if you were having a one-on-one conversation.

Applicant Profile:
- **Resume:** ${resume}
- **Skills:** ${learningGoals}
- **Interests:** ${studyPreference}

Group Requirements:
- **Required Skills:** user should good knowledge of atleast one provided ${Grouptags}.
- **Preferred Skills:** ${privateGroupInfo}.

Instructions:
1. Assess how well your resume, skills, and interests match the group's required skills.
2. Provide a clear verdict:
   - Output "Approved" if you meet or exceed the required criteria.
   - Output "Rejected" if you do not meet the required criteria.
3. Include detailed feedback:
   - Highlight your strengths and explain how your profile aligns with the group requirements.
   - Point out any areas where you might need improvement or where there are gaps in your profile relative to the group's needs.
   - Offer constructive suggestions for how you can improve.

Please structure your response as follows:
**Verdict:** [Approved/Rejected]

**Feedback:**
[Your detailed explanation here]

  `;
    const response = await ModelParams.generateContent([prompt]);

    const fullResponse = response.response.text();

    let verdict = "";
    let feedback = "";

    const verdictMatch = fullResponse.match(/\*\*Verdict:\*\*\s*(Approved|Rejected)/i);
    if (verdictMatch) {
        verdict = verdictMatch[1]!.trim();
    }

    const feedbackMatch = fullResponse.match(/\*\*Feedback:\*\*\s*([\s\S]*)/i);
    if (feedbackMatch) {
        feedback = feedbackMatch[1]!.trim();
    }

    console.log(fullResponse);

    return {
        verdict,
        feedback,
        fullResponse,
    };
};

// Example usage:
// AiBasedGroupJoining(
//     `Experience
// App Developer Intern @Samarth Softech December 2024 – present
// ◦ Led the end-to-end development of a comprehensive application for Samarth Softech, showcasing expertise in full-cycle app development.
// ◦ Worked in a cross-functional team to boost the performance and functionality of the App.
// Fullstack Developer, Computer Society of India, July 2024 – Present
// ◦ Spearheaded the development and launch of the official Computer Society of India website with a user-centric design.
// ◦ Enhanced the front-end with React.js, incorporating dynamic animations and responsive UI elements.
// ◦ Collaborated with backend teams using Express.js to ensure seamless data handling and integration.
// Projects:
// AI Email Platform Project
// ◦ Developed an AI-powered email platform integrating Google API for fetching emails, improving workflow automation.
// ◦ Built features allowing users to compose, send, and reply to emails with AI-powered assistance.
// ◦ Used Prisma for efficient ORM and PostgreSQL for scalable data storage; leveraged Neon.tech for cloud database management.
// GitHub Chat AI Project
// ◦ Developed an AI-powered repository analysis system integrating GitHub API with RAG architecture to enable natural language querying of any repository content.
// ◦ Implemented vector embeddings and LLM technology to convert repository data into a searchable format.
// ◦ Tools Used: Typescript, LangChain, GitHub API, Vector Database, LLM Models, Prisma ORM
// StudyNotion EdTech Platform
// ◦ Designed and deployed an e-learning platform facilitating course creation, purchase, and management.
// ◦ Integrated secure user authentication and Razorpay for payment processing.
// ◦ Ensured a fully responsive and engaging UI, enhancing user retention.
// ◦ Tools Used: Node.js, React, Express.js, Tailwind CSS, MongoDB`,
//     `
// Languages: C++, C, Python, Java, SQL, JavaScript, Typescript
// Frameworks: Next.js, Express.js
// Web Technologies: React.js, CSS, Tailwind CSS, Prisma, REST APIs, POSTMAN]`,
//     `interest in dsa and web development`
// )
//     .then(({ verdict, feedback }) => {
//         console.log("Verdict:", verdict);
//         console.log("Feedback:", feedback);
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });


// AiBasedGroupJoining(`Currently don't have any experience just 1 project of web dev`,
//     `HTML, CSS, JavaScript`,
//     `interest in web development`).then(({ verdict, feedback }) => {
//         console.log("Verdict:", verdict);
//         console.log("Feedback:", feedback);
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });