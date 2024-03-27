const request = require("supertest");
const app = require("./app");
const { MongoClient } = require("mongodb");
const UserRepository = require("./user-repository");
require("dotenv").config();

describe("UserApi", () => {
  let userRepository;
  let collection;
  let client;

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();

    collection = client.db("users_db").collection("user_collection");
    userRepository = new UserRepository(collection);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  describe("/users", () => {
    describe("GET /", () => {
      test("Should return an empty list of users", async () => {
        const response = await request(app).get("/users");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });

      test("Should return a list with 2 users", async () => {
        await userRepository.insert({
          name: "John Doe",
          email: "john@doe.com",
        });

        await userRepository.insert({
          name: "Jane Doe",
          email: "jane@doe.com",
        });

        const response = await request(app).get("/users");
        expect(response.statusCode).toBe(200);

        expect(response.body[0]).toEqual(
          expect.objectContaining({
            name: "John Doe",
            email: "john@doe.com",
          })
        );
        expect(response.body[1]).toEqual(
          expect.objectContaining({
            name: "Jane Doe",
            email: "jane@doe.com",
          })
        );
      });
    });

    describe("POST /", () => {
      test("Should insert a new user", async () => {
        const response = await request(app).post("/users").send({
          name: "John Doe",
          email: "john@doe.com",
        });
        expect(response.statusCode).toBe(201);

        const user = await userRepository.findOneByEmail("john@doe.com");
        expect(user).toEqual(
          expect.objectContaining({
            name: "John Doe",
            email: "john@doe.com",
          })
        );
      });
      test("Should not include a user with the same email", async () => {
        await userRepository.insert({
          name: "John Doe",
          email: "john@doe.com",
        });
        const response = await request(app).post("/users").send({
          name: "John Doe",
          email: "john@doe.com",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
          "User with email john@doe.com already exists!"
        );
      });
    });
  });

  describe("/users/:id", () => {
    describe("GET /", () => {
      test("Should return a single user", async () => {
        const user = await userRepository.insert({
          name: "John Doe",
          email: "john@doe.com",
        });

        const response = await request(app).get(`/users/${user._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            name: "John Doe",
            email: "john@doe.com",
          })
        );
      });

      test("Should return status code 404 for non-existent user", async () => {
        const response = await request(app).get(
          `/users/6097a1c12714b94348359a2c`
        );
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("User not found.");
      });
    });

    describe("PUT /", () => {
      test.todo("Should update user data");
      test.todo("Should return status code 404 for non-existent user");
    });

    describe("DELETE /", () => {
      test.todo("Should remove a user");
      test.todo("Should return status code 404 for non-existent user");
    });
  });
});
