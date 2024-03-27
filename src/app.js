const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const UserRepository = require("./user-repository");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

let userRepository;
let client;
let connected = false;

app.use(async (req, res, next) => {
  if (!connected) {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    const collection = client.db("users_db").collection("user_collection");
    userRepository = new UserRepository(collection);
    connected = true;
  }

  next();
});

app.get("/users", async (request, response) => {
  const users = await userRepository.findAll();
  response.status(200).json(users);
});

app.post("/users", async (request, response) => {
  try {
    const user = await userRepository.insert(request.body);
    response.status(201).json(user);
  } catch (error) {
    if (error.message.includes("already exists")) {
      response.status(400).json({
        message: error.message,
        error: 400,
      });
    } else {
      response.status(500).json({
        message: "An error occurred while processing your request.",
        error: 500,
      });
    }
  }
});

app.get("/users/:id", async (request, response) => {
  try {
    const user = await userRepository.findOneById(
      new ObjectId(request.params.id)
    );
    response.status(200).json(user);
  } catch (error) {
    response.status(404).send({
      message: "User not found.",
      error: 404,
    });
  }
});

module.exports = app;
