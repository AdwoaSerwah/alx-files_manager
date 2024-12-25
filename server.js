import express from 'express';
import controllerRouting from './routes/index';

const app = express();

// Set the port from the environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Load all routes
// app.use(routes);
app.use(express.json());

controllerRouting(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
