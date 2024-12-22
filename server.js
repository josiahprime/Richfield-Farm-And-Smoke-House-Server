const express = require('express');
const cors = require('cors');
const signupRoutes = require('./routes/api/signup'); // Correct path to your signup routes
const corsOptions = require('./config/corsOptions.js')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn');


//connect to db
connectDB()


const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/signup', signupRoutes); // This will route signup requests to your signup router
app.use('/login', require('./routes/api/login'));
// app.use('api/reset', resetRoutes);
app.use('/api/reset', (req, res, next) => {
    console.log('Reset route reached:', req.method, req.url);
    next();
}, require('./routes/api/reset'));
app.use('/logout', require('./routes/api/Logout'))

const PORT = 3500;
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoDB')
    app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))
})