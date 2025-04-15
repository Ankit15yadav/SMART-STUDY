'use server'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { AiBasedGroupJoining } from "./deepseek/demo-chat";

const localPdfPath = path.join("/tmp", "smart-study.pdf");

async function downloadPDF(url: string, outputPath: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
}

export async function processPDF(userResume: string, Grouptags: string[], privateGroupInfo: string, learningGoals: string,
    studyPreference: string, evaluationCriteria: string
): Promise<{ verdict: string; feedback: string; fullResponse: string; } | null> {
    // Download the PDF first
    await downloadPDF(userResume, localPdfPath);

    const loader = new PDFLoader(localPdfPath);
    const docs = await loader.load();

    // Check that the document is loaded successfully
    if (!docs || docs.length === 0) {
        console.error("No document loaded from PDFLoader.");
        return null;
    }

    const aiResponse = await AiBasedGroupJoining(docs[0]?.pageContent, Grouptags, privateGroupInfo, learningGoals, studyPreference, evaluationCriteria);

    // console.log("AI Response Verdict:", aiResponse.verdict);

    return aiResponse;
}

export async function parsePdfFromUrl(userResume: string) {
    await downloadPDF(userResume, localPdfPath);

    console.log(userResume);

    const loader = new PDFLoader(localPdfPath);

    const docs = await loader.load();

    if (!docs || docs.length === 0) {
        console.error("No document loaded from PDFLoader.");
        return null;
    }

    console.log(docs[0]?.pageContent);

    return docs[0]?.pageContent;
}

await parsePdfFromUrl('https://res.cloudinary.com/dxlwayr30/image/upload/v1739779129/smart_study/f9cxrjabp2edzz7hbd7k.pdf');
