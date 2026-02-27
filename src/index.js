const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const garageRoutes = require('./routes/garage.routes');
const servicesRoutes = require('./routes/services.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/services', servicesRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! The API is running.');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
