const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connect(){
    try {
        await mongoose.set('strictQuery',false);
        await mongoose.connect(process.env.database,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the Database');
    } catch (error) {
        console.log('Connect failed');
    }
}

module.exports = { connect };