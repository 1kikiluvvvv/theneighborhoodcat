const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const helmet = require('helmet');
const bcrypt = require('bcrypt');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));
app.use('/data', express.static('data'));


// Use Helmet middleware with CSP configuration
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'blob:'],
            styleSrc: ["'self'", 'blob:', "'unsafe-inline'", 'https://unpkg.com', 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://ajax.googleapis.com',
                'https://www.googletagmanager.com/',
                'https://ajax.googletagmanager.com/',
                'https://www.google-analytics.com',
                'https://code.jquery.com',
                'https://unpkg.com',
                'https://cdn.jsdelivr.net',
                'https://lya-dev.onrender.com',
                'https://theneighborhoodcat.com',
            ],
            connectSrc: [
                'https://www.googletagmanager.com/',
                'https://ajax.googletagmanager.com/',
                'https://www.google-analytics.com',
                'http://localhost:3000',
                'https://lya-dev.onrender.com',
                'https://theneighborhoodcat.com',
            ],
            imgSrc: ["'self'", 'data:', 'https://modelviewer.dev'],
        },
    })
);

//------------//
// Middleware //
//------------//

// Set up session middleware
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000, // Set the maximum age to 1 hour (in milliseconds)
        },
    })
);

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check authentication for protected routes
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
}


//------------//
//   Routes   //
//------------//

// Public Routes

app.get('/', (req, res) => {
    const activePage = 'index';
    const filePath = path.join(__dirname, 'data', 'bw.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.render('index', { items, activePage });
    });
});

app.get('/color', (req, res) => {
    const activePage = 'color';
    const filePath = path.join(__dirname, 'data', 'color.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.render('index', { items, activePage });
    });
});

app.get('/events', (req, res) => {
    const activePage = 'events';
    const filePath = path.join(__dirname, 'data', 'events.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.render('events', { items, activePage });
    });
});

app.get('/shop', (req, res) => {
    const activePage = 'shop';
    const filePath = path.join(__dirname, 'data', 'shop.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.render('shop', { items, activePage });
    });
});

app.get('/contact', (req, res) => {
    const activePage = 'contact';
    res.render('contact', { activePage });
});

//------------//
//    Auth    //
//------------//

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.authenticated = false;
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const storedUser = process.env.USERNAME; // Load the username from .env
    const hashedPassword = process.env.HASHED_PASSWORD; // Load the hashed password from .env

    // First, check if the submitted username matches the stored username
    if (username === storedUser) {
        // Use bcrypt to compare the inputted password with the hashed password
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.error(err);
                // Handle the error
                res.status(500).send('Internal Server Error');
                return;
            }

            if (result) {
                // Successful login
                req.session.authenticated = true;
                res.redirect('dashboard');
            } else {
                // Failed login
                req.session.authenticated = false;
                res.redirect('/login');
            }
        });
    } else {
        // Username doesn't match
        req.session.authenticated = false;
        res.redirect('/login');
    }
});



app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard');
});

// Import necessary middleware and functions for BW
const uploadBw = require('./middleware/bwUpload');
const updateBwItems = require('./controllers/updateBwItems.js');

app.get('/dashboard/bw', requireAuth, (req, res) => {
    const filePath = path.join(__dirname, 'data', 'bw.json');
    const itemsData = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(itemsData);
    res.render('dashboardBw', { items });
});


// BW Add item route
app.post('/dashboard/bw/add-item', requireAuth, uploadBw.fields([
    { name: 'image', maxCount: 1 },
]), (req, res) => {
    // Calculate the next ID based on the existing items
    const filePath = path.join(__dirname, 'data', 'bw.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        let items = JSON.parse(data);

        // Calculate the next ID
        let nextId = 1; // Default to 1 if there are no existing items
        if (items.length > 0) {
            const maxId = Math.max(...items.map(item => parseInt(item.id)));
            nextId = maxId + 1;
        }

        // Retrieve the filenames of the uploaded files
        const image = req.files['image'][0].filename;

        // Create the new item object with the calculated ID and image URL
        const newItem = {
            id: nextId.toString(), // Convert to string to match existing IDs
            url: `public/assets/gallery/bw/sheets/${image}`, // URL to the stored image
        };

        // Call the updateItems function to update the items with the new item data
        updateBwItems(newItem);

        // Redirect to the appropriate page
        res.redirect('/login');
    });
});

// Remove BW item route
app.post('/dashboard/bw/remove-item', requireAuth, (req, res) => {
    const itemId = req.body.id;
    const filePath = path.join(__dirname, 'data', 'bw.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);

        // Find the index of the item in the array based on the provided itemId
        const itemIndex = items.findIndex(item => item.id === itemId);
        console.log('Item index:', itemIndex);

        // Check if the item exists
        if (itemIndex === -1) {
            console.error('Item not found:', itemId);
            res.status(404).send('Item not found');
            return;
        }

        // Remove the item from the array
        items.splice(itemIndex, 1);

        // Write the updated JSON data back to the file
        fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to JSON file');
                return;
            }

            console.log('Item removed successfully.');
            res.redirect('/login');
        });
    });
});


// Import necessary middleware and functions for Color
const uploadColor = require('./middleware/colorUpload');
const updateColorItems = require('./controllers/updateColorItems.js');

app.get('/dashboard/color', requireAuth, (req, res) => {
    const filePath = path.join(__dirname, 'data', 'color.json');
    const itemsData = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(itemsData);
    res.render('dashboardColor', { items });
});


// Color Add item route
app.post('/dashboard/color/add-item', requireAuth, uploadColor.fields([
    { name: 'image', maxCount: 1 },
]), (req, res) => {
    // Calculate the next ID based on the existing items
    const filePath = path.join(__dirname, 'data', 'color.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        let items = JSON.parse(data);

        // Calculate the next ID
        let nextId = 1; // Default to 1 if there are no existing items
        if (items.length > 0) {
            const maxId = Math.max(...items.map(item => parseInt(item.id)));
            nextId = maxId + 1;
        }

        // Retrieve the filenames of the uploaded files
        const image = req.files['image'][0].filename;

        // Create the new item object with the calculated ID and image URL
        const newItem = {
            id: nextId.toString(), // Convert to string to match existing IDs
            url: `public/assets/gallery/color/sheets/${image}`, // URL to the stored image
        };

        // Call the updateItems function to update the items with the new item data
        updateColorItems(newItem);

        // Redirect to the appropriate page
        res.redirect('/login');
    });
});

// Remove Color item route
app.post('/dashboard/color/remove-item', requireAuth, (req, res) => {
    const itemId = req.body.id;
    const filePath = path.join(__dirname, 'data', 'color.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);

        // Find the index of the item in the array based on the provided itemId
        const itemIndex = items.findIndex(item => item.id === itemId);
        console.log('Item index:', itemIndex);

        // Check if the item exists
        if (itemIndex === -1) {
            console.error('Item not found:', itemId);
            res.status(404).send('Item not found');
            return;
        }

        // Remove the item from the array
        items.splice(itemIndex, 1);

        // Write the updated JSON data back to the file
        fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to JSON file');
                return;
            }

            console.log('Item removed successfully.');
            res.redirect('/login');
        });
    });
});



// Import necessary middleware and functions for Color
const uploadEvents = require('./middleware/eventsUpload');
const updateEventsItems = require('./controllers/updateEventsItems.js');

app.get('/dashboard/events', requireAuth, (req, res) => {
    const filePath = path.join(__dirname, 'data', 'events.json');
    const itemsData = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(itemsData);
    res.render('dashboardEvents', { items });
});


// Events Add item route
app.post('/dashboard/events/add-item', requireAuth, uploadEvents.fields([
    { name: 'image', maxCount: 1 },
]), (req, res) => {
    // Calculate the next ID based on the existing items
    const filePath = path.join(__dirname, 'data', 'events.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        let items = JSON.parse(data);

        // Calculate the next ID
        let nextId = 1; // Default to 1 if there are no existing items
        if (items.length > 0) {
            const maxId = Math.max(...items.map(item => parseInt(item.id)));
            nextId = maxId + 1;
        }

        // Retrieve the filenames of the uploaded files
        const image = req.files['image'][0].filename;

        // Create the new item object with the calculated ID and image URL
        const newItem = {
            id: nextId.toString(), // Convert to string to match existing IDs
            url: `public/assets/events/${image}`, // URL to the stored image
        };

        // Call the updateItems function to update the items with the new item data
        updateEventsItems(newItem);

        // Redirect to the appropriate page
        res.redirect('/login');
    });
});

// Remove Events item route
app.post('/dashboard/events/remove-item', requireAuth, (req, res) => {
    const itemId = req.body.id;
    const filePath = path.join(__dirname, 'data', 'events.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);

        // Find the index of the item in the array based on the provided itemId
        const itemIndex = items.findIndex(item => item.id === itemId);
        console.log('Item index:', itemIndex);

        // Check if the item exists
        if (itemIndex === -1) {
            console.error('Item not found:', itemId);
            res.status(404).send('Item not found');
            return;
        }

        // Remove the item from the array
        items.splice(itemIndex, 1);

        // Write the updated JSON data back to the file
        fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to JSON file');
                return;
            }

            console.log('Item removed successfully.');
            res.redirect('/login');
        });
    });
});

app.get('/dashboard/shop', requireAuth, (req, res) => {
   res.render('dashboardShop')
});

app.get('/dashboard/help', requireAuth, (req, res) => {
    res.render('dashboardHelp')
 });


app.listen(3000, () => {
    console.log('Server started on port 3000');
});

