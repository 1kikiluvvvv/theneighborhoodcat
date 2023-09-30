//------------//
//    Admin   //
//------------//




app.get('/dashboard/color', requireAuth, (req, res) => {
    const filePath = path.join(__dirname, 'data', 'products.json');
    const itemsData = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(itemsData);
    res.render('dashboardColor', { items });
});


// Add item route
app.post('/dashboard/color/add-item', requireAuth, upload.fields([
    { name: 'image', maxCount: 1 },
]), (req, res) => {
    // Retrieve the item details from the request body
    const { id, title, description, price, size, type } = req.body;

    // Retrieve the filenames of the uploaded files
    console.log('req.files:', req.files);
    const image = req.files['image'][0].filename;
    const measure = req.files['measure'][0].filename;

    // Create the new item object
    const newItem = {
        id,
        title,
        description,
        price,
        size,
        image: `assetts/shop/${image}`,
        measure: `assetts/shop/${measure}`,
        type,
    };

    // Call the updateItems function to update the items.json file
    updateItems(newItem);

    res.redirect('/dashboard');
});

// Remove item route
app.post('/dashboard/remove-item', requireAuth, (req, res) => {
    const itemId = req.body.id;
    console.log('Received itemId:', itemId);
    console.log('Received req.body.id:', req.body.id);
    const filePath = path.join(__dirname, 'data', 'items.json');

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
            res.redirect('/dashboard');
        });
    });
});