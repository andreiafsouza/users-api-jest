const { MongoClient } = require("mongodb");
const UserRepository = require("./user-repository");
require("dotenv").config();

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
    test("Should update an existing user", async () => {
      const user = await userRepository.insert({
        name: "John Doe",
        email: "john@doe.com",
      });
    
      await userRepository.update(user._id, { name: "Jane Doe" });
      const updatedUser = await userRepository.findOneByEmail("john@doe.com");
    
      expect(updatedUser.name).toBe("Jane Doe");
    });
    
    test("Should throw an exception for a non-existent user", async () => {
      await expect(
        userRepository.update("nonExistentID", { name: "Jane Doe" })
      ).rejects.toThrow("User with ID nonExistentID does not exist");
    });    
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

    test("Should throw an exception for a non-existent user", async () => {
      await expect(
        userRepository.delete("nonExistentID")
      ).rejects.toThrow("User with ID nonExistentID does not exist");
    });    
  });

  describe("findAll", () => {
    test("Should return an empty list of users", async () => {
      const users = await userRepository.findAll();
      expect(users).toEqual([]);
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

      const users = await userRepository.findAll();
      expect(users.length).toBe(2);
    });
  });
});
