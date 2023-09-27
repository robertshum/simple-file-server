const net = require("net");
const readline = require('readline');
const { HOST, PORT } = require("./constants");

//std in for reading in the file names
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//connect to target server
const conn = net.createConnection({
  host: HOST,
  //host: "2.tcp.ngrok.io", // change to IP address of computer, more on that below
  port: PORT,
});

conn.setEncoding("utf8"); // interpret data as text

// client.js
conn.on("data", (data) => {

  //initial hello msg from server
  if (data === "Hello there!") {
    console.log("Greetings from server: ", data);
    getAFile();
    return;
  }

  //error from server, just return and ask again
  if (data === "File Does not exist") {
    console.log("Could not find the file");
    getAFile();
    return;
  }

  //return the contents of the file
  //ask the question again
  console.log("file Contents: ", data);
  getAFile();
});

//say hello back to the server
conn.on("connect", () => {
  conn.write("Hello from client!");
});

//attempts to get a file from the server
const getAFile = function() {

  //asks to get input for a file name
  rl.question("\nPlease enter a file name + extension you want to get\n", (answer) => {
    console.log("file name you want: ", answer);

    //send the answer from callback of rl.
    //...then towards the server
    conn.write(answer, "utf8");
  });
};