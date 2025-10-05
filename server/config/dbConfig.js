const mongoose = require('mongoose');

// CONNECTION LOGIC
mongoose.connect(process.env.CONN_STRING);

//CONNECTION STATE
const db = mongoose.connection;

// checking db connection
db.on('connected', ()=> {
    console.log('DB Connection Successful!');
})
db.on('error', ()=> { 
    console.log('DB Connection failed!');
})

module.exports = db;

