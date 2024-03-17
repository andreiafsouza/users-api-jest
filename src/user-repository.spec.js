const { MongoClient } = require("mongodb");
const UserRepository = require("./user-repository");
require('dotenv').config();

describe("UserRepository", () => {
  let userRepository;
  let collection;
  let client;

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();

    collection = client.db("users_db").collection("users");
    userRepository = new UserRepository(collection);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  describe("findOneByEmail", () => {
    test("Should return the user john@doe.com", async () => {
      const result = await collection.insertOne({
        name: "John Doe",
        email: "john@doe.com",
      });

      const user = await userRepository.findOneByEmail("john@doe.com");
      expect(user).toStrictEqual({
        _id: result.insertedId,
        name: "John Doe",
        email: "john@doe.com",
      });
    });

    test("Should throw and exception for a non-existent user", async () => {
      await expect(
        userRepository.findOneByEmail("john@doe.com")
      ).rejects.toThrow("User with email john@doe.com does not exist");
    });
  });

  describe("insert", () => {
    test("Insert a new user", async () => {
      const user = await userRepository.insert({
        name: "John Doe",
        email: "john@doe.com",
      });
      const result = await userRepository.findOneByEmail("john@doe.com");

      expect(result).toStrictEqual(user);
    });
  });

  describe("update", () => {
    test.todo("Should update an existing user");
    test.todo("Should throw and exception for a non-existent user");
  });

  describe("delete", () => {
    test("Should remove an existing user", async () => {
      const user = await userRepository.insert({
        name: "John Doe",
        email: "john@doe.com",
      });

      await userRepository.delete(user._id);
      await expect(
        userRepository.findOneByEmail("john@doe.com")
      ).rejects.toThrow();
    });
    test.todo("Should throw and exception for a non-existent user");
  });

  describe("findAll", () => {
    test.todo("Should return an empty list of users");
    test.todo("Should return a list with all users");
  });
});
