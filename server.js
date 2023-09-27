const net = require("net");
const fs = require('fs');
const { FILE_LOCATION, PORT } = require("./constants");

//new server
const server = net.createServer();

//files stored in sub directory
//const FILE_LOCATION = "./files/";

//listenening on  port 3000
server.listen(PORT, () => {
  console.log("Server listening on port 3000!");
});

// server.js
// add this line after server is created, before listen is called
server.on("connection", (client) => {
  console.log("New client connected!");
  client.write("Hello there!");

  client.setEncoding("utf8"); // interpret data as text
  client.on("data", (data) => {

    //just a friendly hello message
    if (data.includes("Hello")) {
      console.log("Message from client: ", data);
      return;
    }

    //oh we want to get a file!
    readFile(data, client);
  });
});

const readFile = (data, client) => {

  const path = FILE_LOCATION + data;
  checkPath();

  function checkPath() {
    fs.access(path, (err) => {
      if (!err) {
        console.log(`The path "${path}" is valid.`);
        getFile(); //start checking
        return;
      }

      //path doesn't exist
      if (err.code === 'ENOENT') {
        console.log(`The path "${path}" is not valid.`);
        client.write("File Does not exist");
        return;
      }

      //general error
      console.error(`An error occurred: ${err.message}`);
      return;
    });
  }

  function getFile() {
    // Read the contents of the file
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('An error occurred:', err);
        return;
      }

      //everyting gucci
      console.log('File contents:', data);

      //send it back
      client.write(data);
    });
  }
};