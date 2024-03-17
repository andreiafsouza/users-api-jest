# Node.js API Project using Jest and MongoDB

This is a Node.js API project that requires MongoDB for data storage.

## Installation

To run this project locally, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install project dependencies using npm:

   ```bash
   npm install
   ```

## Setting Up MongoDB

This project requires a MongoDB database. Follow these steps to set it up:

1. Sign up for a free MongoDB Atlas account if you don't have one already: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Once logged in, create a new cluster. You can choose the free tier or any other tier that suits your needs.

3. After creating the cluster, click on the "Connect" button.

4. Choose "Connect your application" and copy the provided connection string.

5. Create a .env file in the root directory of your project.

6. Add the following line to the .env file and replace <your-mongodb-uri> with the connection string you copied:

   ```bash
   MONGODB_URI=<your-mongodb-uri>
   ```