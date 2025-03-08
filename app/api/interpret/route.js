import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(req, res) {
    try {
        
        const { dream, story, conversationHistory, followUpQuestion } = await req.json();

        if (!dream || dream.trim() === '') {
            return NextResponse.json({ error: "Invalid dream" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = `Interepret this dream into a short and amazing story representation, 
                so that I can revisit the dream, in human like language with no extra knowledge bombardment. 
                Don't use heavy words, keep it simple and easy to understand.
                Don't use "here's your story" or something similar, just give me the story in human language: ${dream}`;
        
        if (conversationHistory && conversationHistory.length > 0) {
            prompt = `I had a dream, ${dream}, You have created a story based on my dream, 
            which is ${story}, below are the questions and answers we had during the conversation:`;

            conversationHistory.forEach((item) => {
                prompt += `\nQuestion: ${item.question}\nAnswer: ${item.answer}`;
            });

            prompt += `\nNow, I have one more question for you, you can take creative liberty to answer it. 
            Answer this question: ${followUpQuestion} `;
        } else if (followUpQuestion) {
            prompt = `I had a dream, ${dream}, and you created this wonderful story ${story}. Now I have one more question for you, you can take creative liberty to answer it. 
            Answer this question: ${followUpQuestion} `;
        }

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }], 
            generationConfig: {
                temperature: 0.8,
            }
        });

        const responseText = result.response.candidates[0]?.content?.parts[0]?.text || "No interpretation available.";

        return NextResponse.json({  interpretation: responseText });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

