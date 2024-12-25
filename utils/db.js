import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for performing operations with MongoDB service
 */
class DBClient {
  constructor() {
    this.db = null;
    this.usersCollection = null;
    this.filesCollection = null;
    this.isConnecting = false;
  }

  /**
   * Establishes a connection to MongoDB and initializes collections
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.isConnecting) {
      return;
    }
    this.isConnecting = true;
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = client.db(DB_DATABASE);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');
      console.log('Connected successfully to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      this.db = false;
    }
  }

  /**
   * Checks if the connection to MongoDB is alive
   * @return {boolean} true if connected, false otherwise
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Returns the number of documents in the users collection
   * @return {Promise<number>} Number of users
   */
  async nbUsers() {
    if (!this.db) {
      await this.connect(); // Ensure we connect before performing the operation
    }
    if (this.db) {
      const numberOfUsers = await this.usersCollection.countDocuments();
      return numberOfUsers;
    }
    throw new Error('Not connected to MongoDB');
  }

  /**
   * Returns the number of documents in the files collection
   * @return {Promise<number>} Number of files
   */
  async nbFiles() {
    if (!this.db) {
      await this.connect(); // Ensure we connect before performing the operation
    }
    if (this.db) {
      const numberOfFiles = await this.filesCollection.countDocuments();
      return numberOfFiles;
    }
    throw new Error('Not connected to MongoDB');
  }
}

const dbClient = new DBClient();

export default dbClient;
