require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());

// Serve static files from the public directory
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}
app.use('/public', express.static(publicDir));

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const garageRoutes = require('./routes/garage.routes');
const servicesRoutes = require('./routes/services.routes');
const sparepartRoutes = require('./routes/sparepart.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/spareparts', sparepartRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! The API is running.');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
