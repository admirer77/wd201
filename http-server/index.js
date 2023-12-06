const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "http-server" directory
app.use(express.static(path.join(__dirname)));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/project', (req, res) => {
  res.sendFile(path.join(__dirname, 'project.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

// Update the route to point to the correct file or create the missing file
app.get('/projects.html', (req, res) => {
  const projectsFilePath = path.join(__dirname, 'project.html');
  if (fs.existsSync(projectsFilePath)) {
    res.sendFile(projectsFilePath);
  } else {
    res.status(404).send('Projects.html not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
