'use server'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { AiBasedGroupJoining } from "./deepseek/demo-chat";

const nike10kPdfUrl = "https://res.cloudinary.com/dxlwayr30/image/upload/v1739512797/qtijy5riaihlgcsbq0in.pdf";
const localPdfPath = path.join("/tmp", "nike10k.pdf");

async function downloadPDF(url: string, outputPath: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
}

export async function processPDF(tags: string[], interests: string): Promise<string | null> {
    // Download the PDF first
    await downloadPDF(nike10kPdfUrl, localPdfPath);

    const loader = new PDFLoader(localPdfPath);
    const docs = await loader.load();

    // Check that the document is loaded successfully
    if (!docs || docs.length === 0) {
        console.error("No document loaded from PDFLoader.");
        return null;
    }

    const aiResponse = await AiBasedGroupJoining(docs[0]?.pageContent, tags, interests);

    console.log("AI Response Verdict:", aiResponse.verdict);

    return aiResponse.feedback;
}
