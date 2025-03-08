import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(req, res) {
    try {
        
        const { dream } = await req.json();

        if (!dream || dream.trim() === '') {
            return NextResponse.json({ error: "Invalid dream" }, { status: 400 });
        }

        console.log("Interpreting dream:", dream);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Interpreting dream 2:", dream);

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `Please interpret the following dream: ${dream}` }] }]
        });

        console.log("Interpreting dream 3:", dream);

        const responseText = result.response.candidates[0]?.content?.parts[0]?.text || "No interpretation available.";

        return NextResponse.json({  interpretation: responseText });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

