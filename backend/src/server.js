const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const { testDatabaseConnection } = require('./config/db');

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await testDatabaseConnection();
    console.log('Database connection established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
