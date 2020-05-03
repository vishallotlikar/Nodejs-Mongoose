// init code
const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL;

// Connection code
mongoose.connect(
    db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    function (error, link) {
        // Check error
        // assert.equal(error, null, 'DB connection failed...');

        // Ok
        console.log('DB connection established...');
        // console.log(link);
    }
).catch(error => {
    console.log('DB connection failed...');
});
