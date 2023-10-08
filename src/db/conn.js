const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Corrected option name
}).then(() => {
    console.log(`Connection successful`);
}).catch((err) => {
    console.error(`Connection error: ${err}`);
});
