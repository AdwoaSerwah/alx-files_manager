import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller

  // Endpoint to check if Redis and the database are alive
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Endpoint to return the total number of users and files in the database
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // User Controller

  // Endpoint to create a new user in the database
  // It expects email and password in the request body
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // Endpoint to retrieve the currently authenticated user's details based on the token
  // Returns the user object (email and id) if authenticated
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  // Auth Controller

  // Endpoint to sign in the user by generating a new authentication token
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // Endpoint to sign out the user based on the authentication token
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // Files Controller

  // Endpoint to upload a new file to the database and disk
  // Expects the file data in the request body
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  // Endpoint to retrieve the file document based on its ID
  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  // Endpoint to retrieve all file documents for a specific parentId with pagination
  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  // Endpoint to make the file document publicly accessible by setting isPublic to true
  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  // Endpoint to revoke public access to the file document by setting isPublic to false
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  // Endpoint to retrieve the content of the file document based on its ID
  router.get('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });
}

export default controllerRouting;
