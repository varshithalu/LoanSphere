const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const loanApplicationsRouter = require('./routes/loanApplications');

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Import your model here
const LoanApplication = require('./models/LoanApplication');

// Routes
app.use('/api/loan-applications', loanApplicationsRouter);

// Your dashboard route goes here:
app.get('/dashboard', async (req, res) => {
    console.log('Dashboard route accessed');
    try {
        const loanApplications = await LoanApplication.find();
        res.render('dashboard', { applications: loanApplications });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
