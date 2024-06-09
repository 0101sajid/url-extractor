const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Replace with your Google Custom Search Engine ID and API key
const cx = 'e012411a07c594bf1';
const apiKey = 'AIzaSyA3v18rEt6BNyp13ec-_0cVAnT08i8LVHQ';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const start = req.query.start || 1; // Start index for search results, 1-based

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&start=${start}`);
        const data = await response.json();
        if (response.ok) {
            res.json(data);
        } else {
            console.error(`Error fetching search results: ${data.error.message}`);
            res.status(response.status).json({ error: data.error.message });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
