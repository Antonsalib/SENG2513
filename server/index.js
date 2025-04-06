// server/index.js
import express from "express";
import company from "./api/json/company.json" with {type: "json"}; // Importing JSON data from a file
const app = express();
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const CORS = cors();
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3001;
app.use(CORS);
import User from './models/user.js';
import Player from './models/player.js';
import { syncModels } from "./models/index.js";


syncModels();

app.get("/api/game", async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const aiModel = "gpt-3.5-turbo";
  const boardJson = req.query.board;

  if (boardJson && boardJson.length) {

    const prompt = [];
    prompt.push('You are an expert tic tac toe player.')
    prompt.push('You play as O. focus on winning, play extremely well. If you see an oppertunity to win, take it. Play aggressively.')
    prompt.push('Please respond with a JSON object indicating only your next move, without adding any extra moves or suggestions.');
    prompt.push('{board:[[],[],[]]}')

    const messages = [
      {
        role: "system",
        content: prompt.join(' '),
      },
      {
        role: "user",
        content: boardJson,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: aiModel,
      messages,
      response_format:{ "type": "json_object" }
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ aiResponse });
  }
});

  app.get("/api/company", (req, res) => {
  return res.json(company);
});

app.get("/api/user", async (req, res) => {
  // Find all users
    const users = await User.findAll();
  return res.json(users);
});

app.get("/api/player", async (req, res) => {
  // Find all players
    const players = await Player.findAll();
  return res.json(players);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
