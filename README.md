# AI Dream Storyteller

AI Dream Storyteller is a web application that interprets users' dreams and allows them to ask follow-up questions to continue the conversation.

## Try App
Check app at [AI Dream Storyteller App](https://dream-interpreter-meet.vercel.app/).

## Features
- Submit a dream description to get an AI-generated interpretation.
- Ask follow-up questions to dive deeper into the meaning of your dream.
- User-friendly interface with markdown support for formatted responses.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** API routes (Node.js)
- **AI Model:** Gemini-2.0 Flash

## Environment Variables
Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_API_KEY=your-gemini-api-key
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Meet1903/GenAI-Dream-Storyteller.git
   cd GenAI-Dream-Storyteller
   ```
2. Environment Variables:

    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    NEXT_PUBLIC_API_KEY=your-gemini-api-key
    ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
1. Enter your dream in the text area and submit.
2. Receive an AI-generated interpretation.
3. Ask follow-up questions in the conversation interface.
4. Continue asking questions based on the previous response.

## Future Improvements
- Enhance AI response quality with context retention.
- Add user authentication for saving dream interpretations.
- Implement voice-to-text input for describing dreams.

## License
This project is licensed under the MIT License.

