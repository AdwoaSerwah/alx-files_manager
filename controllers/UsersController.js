import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * Creates a new user with email and password.
   *
   * - Requires email and password. Returns errors if missing.
   * - Hashes the password with SHA1 before saving.
   * - Returns the new user (id and email) on success.
   * - Returns an error if the email already exists.
   */
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) return response.status(400).send({ error: 'Missing email' });
    if (!password) return response.status(400).send({ error: 'Missing password' });

    const emailExists = await dbClient.usersCollection.findOne({ email });
    if (emailExists) return response.status(400).send({ error: 'Already exist' });

    const sha1Password = sha1(password);

    let result;
    try {
      result = await dbClient.usersCollection.insertOne({
        email,
        password: sha1Password,
      });
    } catch (err) {
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user.' });
    }

    const user = { id: result.insertedId, email };
    await userQueue.add({ userId: result.insertedId.toString() });
    return response.status(201).send(user);
  }

  /**
   * Retrieves the user based on the token used.
   *
   * - Returns the user (id and email) if found.
   * - Returns an 'Unauthorized' error if not found.
   */
  static async getMe(request, response) {
    const { userId } = await userUtils.getUserIdAndKey(request);
    const user = await userUtils.getUser({ _id: ObjectId(userId) });

    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    const processedUser = { id: user._id, email: user.email };
    return response.status(200).send(processedUser);
  }
}

export default UsersController;
