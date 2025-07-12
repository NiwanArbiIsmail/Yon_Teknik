const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

const router = express.Router();

// Serve HTML pages
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

router.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'services.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'contact.html'));
});

// Contact form handler
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter(emailConfig);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error sending your message. Please try again.' 
    });
  }
});

module.exports = router;

