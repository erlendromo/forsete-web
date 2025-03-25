const path = require('path');
const { createApp } = require('./dist/app.js');

// Get the app instance
const app = createApp();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});