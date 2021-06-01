const http = require('http');
const mongoConnect = require("./util/db").mongoConnect;


// import server and endpoints
const server = require('./controller.js');



const port = 4000
server.listen(port, () => {

    // Connect to DB
    mongoConnect();
    console.log(`Server running at ${port}`);
});

