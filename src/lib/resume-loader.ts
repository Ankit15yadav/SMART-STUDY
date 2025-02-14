'use server'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { AiBasedGroupJoining } from "./deepseek/demo-chat";

const localPdfPath = path.join("/tmp", "nike10k.pdf");

async function downloadPDF(url: string, outputPath: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
}

export async function processPDF(userResume: string, tags: string[], interests: string): Promise<{ verdict: string; feedback: string; fullResponse: string; } | null> {
    // Download the PDF first
    await downloadPDF(userResume, localPdfPath);

    const loader = new PDFLoader(localPdfPath);
    const docs = await loader.load();

    // Check that the document is loaded successfully
    if (!docs || docs.length === 0) {
        console.error("No document loaded from PDFLoader.");
        return null;
    }

    const aiResponse = await AiBasedGroupJoining(docs[0]?.pageContent, tags, interests);

    console.log("AI Response Verdict:", aiResponse.verdict);

    return aiResponse;
}