const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();
const PORT = process.env.PORT || 3000;

// Reference to public folder for all static files
app.use(express.static("public"));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

// Serve the HTML form
app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.get('/login', (req, res) => {
    res.render("login.ejs");
});

app.get('/community', (req, res) => {
    res.render("community.ejs");
});

app.get('/signup', (req, res) => {
    res.render("signup.ejs");
});

app.get('/success_st', (req, res) => {
    res.render("success_st.ejs");
});

app.get('/volunteering', (req, res) => {
    res.render("volunteering.ejs");
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.vayxzgs.mongodb.net/?retryWrites=true&w=majority');

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


//Signup vaala form *************************************************************************************


const signupSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    password: String,
    confirmpassword: String,
});

// Create a model
const signup = mongoose.model('login', signupSchema);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await signup.findOne({ username });

        // Check if the user exists
        if (user) {
            // Compare the provided password with the password stored in the database (plain text)
            if (password === user.password) {
                req.session.userId = user._id; // No error should occur here now
                res.send('Login successful!');
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
    
});




// Handle form submission
app.post('/signup', async (req, res) => {
    const {
        first_name,
        last_name,
        username,
        email,
        password,
        confirmpassword
    } = req.body;

    
    // Check if password equals confirm password
    if (password !== confirmpassword) {
        return res.status(400).send("Password and confirm password do not match.");
    }

    const newUser = new signup({
        first_name,
        last_name,
        username,
        email,
        password,
        confirmpassword
    });

    try {
        await newUser.save();
        res.send('Form submitted successfully!');
    } catch (error) {
        console.error('Error saving to the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a Mongoose schema
const blogpostSchema = new mongoose.Schema({
    title: String,
    content: String,
});

// Create a Mongoose model
const Post = mongoose.model('blogpost', blogpostSchema);

app.use(express.static('public'));
app.use(bodyParser.json());

// Get all blog posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new blog post
app.post('/api/posts', async (req, res) => {
    const { title, content } = req.body;

    try {
        const newPost = await Post.create({ title, content });
        res.json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:3000');
  });