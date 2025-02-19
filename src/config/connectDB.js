const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect Db success!');
    } catch (err) {
        console.log('Error connecting to the database:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
