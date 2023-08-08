const express = require('express');
const app = express();

// Import the database connection
const db = require('./database.js'); // 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
