class UserRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async findOneByEmail(email) {
    const user = await this.collection.findOne({ email });

    if (user === null) {
      throw new Error(`User with email ${email} does not exist`);
    }

    return user;
  }

  async insert(user) {
    await this.collection.insertOne(user);
    return user;
  }

  async update(id, updates) {
    const user = await this.collection.findOne({ _id: id });
  
    if (!user) {
      throw new Error(`User with ID ${id} does not exist`);
    }
  
    await this.collection.updateOne({ _id: id }, { $set: updates });
  }  

  async delete(id) {
    const user = await this.collection.findOne({ _id: id });
  
    if (!user) {
      throw new Error(`User with ID ${id} does not exist`);
    }
    
    await this.collection.deleteOne({ _id: id });
  }

  async findAll() {
    const users = await this.collection.find().toArray();
    return users;
  }
}

module.exports = UserRepository;
