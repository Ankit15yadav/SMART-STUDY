import { GoogleGenerativeAI } from "@google/generative-ai";
import { query } from "express";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

//  export const analyzeResumeWithGemini = async (
//      resume: string,
//      message: string
//  ) => {
//      const prompt = `
//  **Role:**  
//  You are an expert AI Resume Advisor specializing in modern resume optimization, ATS compliance, and industry-tailored enhancements. Your goal is to analyze the user’s resume (provided as **${resume}**) and transform it into a compelling, results-driven document that maximizes interview potential.  

//  ---

//  **Guidelines for Excellence:**  

//  1. **Comprehensive Resume Analysis:**  
//     - **Strengths & Gaps:** Identify standout achievements, technical proficiencies, and leadership experience in **${resume}**. Flag gaps (e.g., missing metrics, inconsistent timelines).  
//     - **ATS Optimization:** Check **${resume}** for missing keywords, poor scannability, or low-impact sections. Prioritize ATS-friendly formatting.  
//     - **Sector-Specific Nuances:** Tailor feedback to the industry inferred from **${resume}** (e.g., tech vs. academia).  

//  2. **Action-Oriented Recommendations:**  
//     - **Quantifiable Achievements:** Rewrite generic statements in **${resume}** using metrics (e.g., “Increased revenue by 40%”).  
//     - **Keyword Integration:** Inject keywords from the user’s target job descriptions into **${resume}**.  
//     - **Design & Structure:** Recommend clean templates and consistent formatting for **${resume}**.  

//  3. **Interactive Clarification Protocol:**  
//     - If **${message}** is ambiguous (e.g., “How can I improve my resume?”), ask targeted questions like, “Are you targeting [Role X] or [Role Y]?”  
//     - Provide multiple improvement pathways based on **${message}** (e.g., ATS vs. storytelling focus).  

//  4. **Career Strategy Add-Ons:**  
//     - **Tailoring Tips:** Advise how to customize **${resume}** for specific applications mentioned in **${message}**.  
//     - **Future-Proofing:** Suggest skills/certifications to add to **${resume}** based on industry trends.  

//  ---

//  **Example Interaction:**  
//  **User:** “${message}”  
//  **AI Resume Advisor:**  
//  “Your ${resume} highlights [strength], but [specific improvement]. For example, under [Section], add [metric] to demonstrate [impact]. Would you like ATS-friendly phrasing examples?”  

//  ---  

//  **Key Variables:**  
//  - **${resume}**: The user’s resume text/data.  
//  - **${message}**: The user’s query (e.g., “Does my resume lack keywords?”).  
//      `;

//      try {
//          const response = await model.generateContent(prompt);
//          const fullResponse = response.response.text();

//           Parse structured response
//          const sections = fullResponse.split('**').filter(s => s.trim());
//          const result: { [key: string]: string } = {};

//          sections.forEach(section => {
//              const [title, ...content] = section.split(':');
//              if (title && content) {
//                  result[title.trim()] = content.join(':').trim();
//              }
//          });

//           Log results to console
//          console.log("=== Resume Analysis Results ===");
//           console.log("Full Response:\n", fullResponse);
//          console.log("\nParsed Analysis:");
//          for (const [key, value] of Object.entries(result)) {
//              console.log(`${key}:\n`, value);
//          }

//          return {
//              analysis: result,
//              fullResponse,
//          };
//      } catch (error) {
//          console.error("Error analyzing resume:", error);
//          return {
//              analysis: {},
//              fullResponse: "Error processing your request",
//              error: (error as Error).message
//          };
//      }
//  };

//  Example usage:

export const analyzeResumeWithGemini = async (
    resume: string,
    message: string
) => {
    const prompt = `
**Role:**  
You are a **user-centric AI Resume Strategist**. Analyze the user’s resume and **strictly address their explicit question** (e.g., “Is my resume ATS-friendly?”, “How to pivot to UX design?”). Ignore generic improvements unless directly tied to their goal.  

**Critical Rules:**  
1. **No cookie-cutter advice**: If the user asks about ATS, don’t mention career summaries. If they’re pivoting careers, focus on transferable skills, not random formatting tweaks.  
2. **Deep alignment**: Match *every* recommendation to their exact query. Ask: “Does this directly answer what they asked?”  
3. **Resume surgery**: Target only sections relevant to their goal.  

**Response Template:**  


**Workflow:**  
1. Read the user’s query. Identify their **exact pain point** (e.g., “I keep getting rejected by ATS”).  
2. Scan their resume for **gaps blocking their goal**.  
3. Prescribe **3-4 hyper-specific fixes** (section + action + justification).  

**Input:**  
“Resume: ${resume} | Query: ${message}”  

Example Output for “How do I highlight leadership in tech?”:

**Based on your goal [Highlight leadership in tech]:**  
• **Experience**: Add “Mentored 4 junior engineers” to your Senior Developer role. *Why*: Shows hands-on mentorship. (High)  
• **Projects**: Include “Led cross-functional team of 8 to launch API integration.” *Why*: Proves team leadership. (High)  
• **Skills**: Replace “Team player” with “Technical Leadership, Scrum Master.” *Why*: Uses stronger keywords. (Medium)  
**Most critical**: Quantify leadership impact in Experience section.  

    `;

    try {
        const response = await model.generateContent(prompt);
        const fullResponse = response.response.text();

        //  Clean and format response
        const cleanedResponse = fullResponse
            .replace(/\*\*/g, '')
            .replace(/- /g, '\n• ')
            .replace(/(\d+\.)/g, '\n$1');

        console.log("=== Essential Resume Feedback ===");
        console.log(cleanedResponse);

        return {
            analysis: cleanedResponse,
            fullResponse,
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            analysis: "Could not generate analysis",
            fullResponse: "Error processing request",
            error: (error as Error).message
        };
    }
};

const exampleResume = `
Education
SRM University Chennai B.TECH in Computer Science 2022 – 2026
◦ GPA: 9.16
◦ Coursework: Computer Architecture, Computer Networking, Operating System
Silver Oak School Class XII 2020 – 2021
◦ Percentage: 85%
Experience
App Developer Intern @Samarth Softech december 2024 – present
◦ Led the end-to-end development of a comprehensive application for Samarth Softech, showcasing expertise
in full-cycle app development.
◦ Worked in a cross-functional team to boost the performance and functionality of the App.
Fullstack Developer Computer Society on India July 2024 – Present
◦ Spearheaded the development and launch of the official Computer Society of India website with a user-centric
design
◦ Enhanced the front-end with React.js, incorporating dynamic animations and responsive UI elements.
◦ Collaborated with backend teams using Express.js to ensure seamless data handling and integration.
Projects
AI Email Platform 
◦ Developed an AI-powered email platform integrating Google API for fetching emails, improving workflow
automation.
◦ Built features allowing users to compose, send, and reply to emails with AI-powered assistance.
◦ Used Prisma for efficient ORM and PostgreSQL for scalable data storage; leveraged Neon.tech for cloud
database management
◦ Tools Used: Next.js, Prisma, PostgreSQL, Neon.tech DB, Aurinko API
GitHub Chat AI 
◦ Developed an AI-powered repository analysis system integrating GitHub API with RAG architecture to
enable natural language querying of any repository content.
◦ Implemented vector embeddings and LLM technology to convert repository data into searchable format,
allowing comprehensive code and documentation exploration.
◦ Tools Used: Typescript, LangChain, GitHub API, Vector Database, LLM Models, Prisma ORM
StudyNotion EdTech Platform 
◦ Designed and deployed an e-learning platform facilitating course creation, purchase, and management.
◦ Integrated secure user authentication and Razorpay for payment processing.
◦ Ensured a fully responsive and engaging UI, enhancing user retention.
◦ Tools Used: Node.js, React, Express.js, Tailwind CSS, MongoDB
Technologies
Languages: C++, C, Python, Java, SQL, JavaScript, Typescript
Frameworks: Next.js, Express.js
Web Technologies: React.js, CSS, Tailwind CSS, Prisma, REST APIs, POSTMAN
Development Tools: Git, Visual Studio Code, Docker, Kubernetes
Databases: PostgreSQL, MongoDB
Other Skills: Problem Solving, Data Structures, Algorithms, Dynamic Programming
`

const exampleMessage = "What are the chances of my resume being selected for a job in a tech company?";

// analyzeResumeWithGemini(exampleResume, exampleMessage)
//     .then(response => {
//         console.log("\nReturned Analysis Object:");
//         console.log(response.analysis);
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });  

analyzeResumeWithGemini(exampleResume, exampleMessage);




// const prompt = `
// **Role:**
// You are an expert AI Resume Advisor. Provide focused, concise feedback on this resume.

// **Resume Context:**
// ${resume}

// **User Query:**
// ${message}

// **Guidelines:**
// 1. Identify ONLY 3-5 critical improvement areas
// 2. Keep responses under 150 words
// 3. Use bullet points with clear priorities
// 4. Focus on high-impact changes

// **Response Format:**
// - **Top Priorities:** [3-5 concise improvement areas with impact level]
// - **Quick Fixes:** [Immediately actionable changes]
// - **Key Focus:** [Single most important area to address]

// Example Response:
// - **Top Priorities:**
//   1. Add project metrics (High Impact)
//   2. Include missing React keywords (Medium Impact)
//   3. Simplify technical jargon (Low Impact)
// - **Quick Fixes:**
//   • Add "TypeScript" to skills section
//   • Replace passive verbs with action words
// - **Key Focus:** Quantify achievements in current role
// `;