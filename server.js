const express = require('express');
const morgan = require('morgan');
const db = require('./app/config/db');
db.connect();

const port = 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const adminRoutes = require('./app/routes/admin');
const productRoutes = require('./app/routes/product')
const userRoutes = require('./app/routes/user');

app.use('/api/admin', adminRoutes);
app.use('/api/shop', productRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});