// Load environment variables first!
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Load DB configuration
const dbconfig = require('./config/dbConfig');

// Load Express app AFTER dotenv
const server = require('./app');

const port = process.env.PORT_NUMBER || 3000;
server.listen(port, () => {
    console.log('Listening to requests on PORT:', port);
});


