import express from "express";
import cors from "cors";
import fs from "fs";
import { OpenAI } from "openai";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3005;
const apiKey = process.env.VITE_OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });

app.use(cors());
app.use(express.json());

const staticPath = path.resolve(__dirname,'dist');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
  });
  

app.post("/chatbot", async (req, res) => {
  const { question } = req.body;

  try {
      let response;

      // Check if combined question is available
      const fileContent = await fs.readFileSync('UTS_Information.txt', 'utf8');
      const combinedQuestion = `${question}\n${fileContent}`;

      if (fileContent.trim() !== '') {
          // Use combined question if available
          response = await openai.chat.completions.create({
              messages: [
                  {
                      role: "system",
                      content: "You are an Assistant which develop by the student from University of Technology Sarawak based on the OpenAI. Your main role is to help find any relevant information on the website of the school.",
                  },
                  {
                      role: "user",
                      content: combinedQuestion,
                  },
              ],
              model: "gpt-3.5-turbo",
              max_tokens: 400,
          });
      } else {
          // No combined question available, use only user question
          response = await openai.chat.completions.create({
              messages: [
                  {
                      role: "system",
                      content: "I am an assistant of UTS. Please search something related to UTS.",
                  },
                  {
                      role: "user",
                      content: question,
                  },
              ],
              model: "gpt-3.5-turbo",
              max_tokens: 300,
          });
      }

      res.send(response.choices[0].message.content);

  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Handle error gracefully
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));