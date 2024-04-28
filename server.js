import express from "express";
import cors from "cors";
import fs from "fs";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 3005;
const apiKey = process.env.VITE_OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });

app.use(cors());
app.use(express.json());

app.post("/chatbot", async (req, res) => {
  const { question } = req.body;

  try {
    // Attempt to read the file content
    let fileContent;
    try {
      fileContent = await fs.readFileSync("UTS_Information.txt", "utf8");
    } catch (error) {
      console.error("Error reading file:", error);
      // File may not exist or may be inaccessible. Proceed with user question only.
      fileContent = "";
    }

    const combinedQuestion = fileContent ? `${question}\n${fileContent}` : question;

    // Use the combined question only if it has content from the file
    const useCombinedQuestion = combinedQuestion.trim().length > 0;

    // Communicate with the OpenAI API
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an Assistant which develop by the student from University of Technology Sarawak based on the OpenAI. Your main role is help to find any relevant information on the website of the school",
        },
        {
          role: "user",
          content: useCombinedQuestion ? combinedQuestion : question,
        },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 300,
    });

    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error"); // Handle error gracefully
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));