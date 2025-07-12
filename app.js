const express = require('express');
const app = express();
const port = 3001;

// Middleware
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
