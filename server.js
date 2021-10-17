require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));


// Error Handler
app.use(errorHandler);

const server = app.listen(PORT, ()=>{
    console.log(`Auth Server Started at Port ${PORT}`);
})

process.on("unhandleRejection", (err, promise) => {
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
})