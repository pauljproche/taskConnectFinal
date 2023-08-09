const express = require('express');
const app = express();
const userRoutes = require("./userRoutes"); 

// Import the database connection
const db = require('./database.js'); // 
app.use(userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
