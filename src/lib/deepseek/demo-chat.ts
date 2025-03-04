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
    evaluationCriteria: string,
) => {
    const prompt = `
You are an expert evaluator for private groups. An applicant has applied to join a private group, and the group owner has specified the required proficiency level for members. Evaluate the application based on the information provided below, and speak directly to the applicant as if you were having a one-on-one conversation.

Applicant Profile:
- **Resume:** ${resume}
- **Skills:** ${learningGoals}
- **Interests:** ${studyPreference}
- **Proficiency Level:** [Automatically assessed from application materials]

Group Requirements:
- **Required Proficiency:** ${evaluationCriteria} level in at least one of these areas: ${Grouptags.join(', ')}
- **Preferred Qualifications:** ${privateGroupInfo}

Evaluation Guidelines:
1. Analyze the applicant's materials to determine their current proficiency level
2. Compare against required ${evaluationCriteria} level criteria:
   - Beginner: Basic understanding, limited practical experience
   - Intermediate: Working knowledge, some implementation experience
   - Advanced: Deep expertise, multiple successful implementations
3. Assess alignment between applicant's goals (${learningGoals}) and group's focus

Instructions:
1. Determine if the applicant meets or exceeds the required ${evaluationCriteria} level
2. Provide clear verdict:
   - "Approved" if meeting/exceeding required level
   - "Rejected" if below required level
3. Detailed feedback must include:
   - Proficiency assessment with specific examples from application
   - Alignment between applicant's goals and group's focus
   - Skill gaps preventing meeting requirements (if rejected)
   - Improvement suggestions tailored to reach ${evaluationCriteria} level

Response Format:
**Verdict:** [Approved/Rejected]

**Feedback:**
[Your analysis using this structure:
1. Proficiency Assessment
2. Goals Alignment
3. Strengths
4. Improvement Areas
5. Specific Recommendations]
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
