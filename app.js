const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.static('public'));


// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    availability: String,
    skills: String,
    interests: String

});

// Create a model
const User = mongoose.model('User', userSchema);

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/volunteering.html");
});

// Handle form submission
app.post('/submit_volunteer', async (req, res) => {
    const newUser = new User({
        name: req.body.full_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        availability: req.body.availability || false,
        skills: req.body.skills,
        interests: req.body.interests
    });

    try {
        await newUser.save();
        res.send('Form submitted successfully!');
    } catch (error) {
        console.error('Error saving to the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});