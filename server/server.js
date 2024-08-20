import express, { request, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

//Setting up express server with cors and doing env variable configuration
//Instantiating an instance of express in a variable called app
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//Establishing connection with db server with new DB setup

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

//Setting up various HTTP endpoints

app.get("/", (request, response) => {
  response.json("This is the root route");
});

app.get("/messages", async (request, response) => {
  const data = await db.query(`SELECT * FROM messages`);
  const messageData = data.rows;
  response.json(messageData);
});

app.post("/messages", async function (request, response) {
  const username = request.body.username;
  const message = request.body.message;
  const rating = request.body.rating;
  await db.query(
    `INSERT INTO messages (username, message, rating) values ($1, $2, $3)`,
    [username, message, rating]
  );
});

app.listen(8080, () => console.log("Server is running here at port 8080"));
