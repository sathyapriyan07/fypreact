import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY in server/.env");
}

const client = new OpenAI({ apiKey });

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/summarize", async (req, res) => {
  try {
    const text = (req.body?.text || "").toString();
    const maxWords = Number(req.body?.maxWords || 120);
    if (!text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const prompt = `Summarize the following text in ${maxWords} words or fewer:\n\n${text}`;
    const response = await client.responses.create({
      model,
      input: prompt,
    });

    res.json({ summary: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "summarize_failed" });
  }
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = (req.body?.prompt || "").toString();
    if (!prompt.trim()) {
      return res.status(400).json({ error: "prompt is required" });
    }

    const response = await client.responses.create({
      model,
      input: prompt,
    });

    res.json({ text: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "generate_failed" });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`OpenAI server running on http://localhost:${port}`);
});
