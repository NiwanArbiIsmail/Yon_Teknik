const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Middleware untuk file statis (CSS, JS, gambar, video)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/layanan.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/contact.html'));
});

// Mulai server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/services.html', (req, res) => { // Perhatikan: ini /services.html
        res.sendFile(path.join(__dirname, 'public/layanan.html'));
    });

app.get('/contact.html', (req, res) => { // Perhatikan: ini /contact.html
        res.sendFile(path.join(__dirname, 'public/contact.html'));
    });

app.get('/about.html', (req, res) => { // Tambahkan jika ada halaman about.html
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });

