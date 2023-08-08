const { MongoClient } = require('mongodb');
const http = require('http');
const fs = require('fs');

const uri = "mongodb+srv://taskconnect2:V02gss7wWBeSd47M@cluster0.szozfpl.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("taskConnect");
    const collection = database.collection("taskCard");
    const query = await collection.find({}).toArray();
    return JSON.stringify(query, null, 2);
  } catch (err) {
    console.log("Error in MongoDB query:", err);
    throw err;
  } finally {
    await client.close();
  }
}

const port = process.env.PORT || 3000;

http.createServer(async function (req, res) {
  if (req.url === '/') {
    try {
      const queryResult = await run();

      // Read the content of frontpage.html from the file system
      fs.readFile('frontpage.html', 'utf8', (err, frontpageHtmlContent) => {
        if (err) {
          console.log("Error reading frontpage.html:", err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end("An error occurred while processing the request.");
        } else {
          // Manually build the HTML response with the queryResult and frontpageHtmlContent
          const htmlResponse = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8"> 
                <title>TaskConnect - Front Page</title>
                <style>
                    body {
                        margin: 0;
                        background-color: #5B9F3C;/* Set background color for body */
                    }
                    nav {
                        display: flex;
                        background-color: #5B9F3C;
                        align-items: center; /*vert align*/
                        justify-content: flex-end; /*makes nav ele. right aligned*/
                        white-space: nowrap; 
                    }
                    nav li {
                        padding-right: 20px;
                        display: inline; /*horizontal align*/
                    }
                    a { 
                        text-decoration: none;
                        color: #ffffff; 
                    }
                    .logo {
                        padding-left: 20px;
                        margin-right: auto; /*make logo left aligned*/
                    }
                    div {
                        color: #ffffff;
                        padding: 10px;
                    }
                    .container {
                        margin-top: 3px; /*add the small margin at top*/
                        background-image: linear-gradient(180deg, #5B9F3C, #A7CE95); /*gradient background*/
                        display: flex;
                        height: 100vh; /*spans 100% of vert. viewport*/
                        padding: 0px;
                        font-size: 30px;
                        justify-content: center; 
                        align-items: center;
                        overflow: hidden; /* Prevent scrolling */
                    }
                    .button {
                        background-color: #ff0000;
                        color: #ffffff;
                        padding: 10px 20px;
                        font-size: 18px;
                        border-radius: 5px;
                        border: none;
                    }
                    .navbutton {
                        background-color: #ff0000;
                        color: #ffffff;
                        padding: 5px;
                        border-radius: 5px;
                    }
                    .right-image {
                        top: 100px;
                        right: 0px;
                        height: 75vh;
                        padding: 10px;
                    }
                    .logo {
                        padding-left: 20px;
                        margin-right: auto;
                        /*make logo left aligned*/
                    }
                    .icon {
                        height: 35px;
                        width: 35px;
                    }
                    .iconContainer {
                        display: flex;
                        align-items: center;
                    }
                    @media (max-width: 600px) {
                        /*hide these elements*/
                        .hide-on-small-screen {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <header>
                    <nav>
                        <ul class="logo iconContainer">
                            <li><a href="index.html">
                                <img class="icon" src="Images/logo.png" alt="company logo" />
                            </a></li>
                            <li class="hide-on-small-screen"><a href="index.html">TaskConnect</a></li>
                        </ul>
            
                        <ul>
                            <li class="hide-on-small-screen"><a href="#">About Us</a></li>
                            <li><a href="loginpage.html"  class="navbutton">Log In</a></li>
                        </ul>
                    </nav>
                </header>
                <div class="container">
                    <div margin-top: 20px>
                        <h2>Get the perfect </h2>
                        <h2>schedule with </h2>
                        <h2>TaskConnect!</h2>
                        <a href="signuppage.html" class="button">Sign Up</a>
                    </div>
                    <img src="./Images/frontpage.png" alt="Image" class="right-image">
                </div>
                <div>
                      <h2>Query Results:</h2>
                      <pre>${queryResult}</pre>
                </div>
            </body>
            </html>`;

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(htmlResponse);
        }
      });
    } catch (err) {
      console.log("Error in request:", err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end("An error occurred while processing the request.");
    }
  } else if (req.url === '/about') {
    // Handle the '/about' route here
    fs.readFile('about.html', 'utf8', (err, aboutHtmlContent) => {
      if (err) {
        console.log("Error reading about.html:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(aboutHtmlContent);
      }
    });
  } else if (req.url === '/loginpage.html') {
    // Handle the '/loginpage.html' route here
    fs.readFile('loginpage.html', 'utf8', (err, loginHtmlContent) => {
      if (err) {
        console.log("Error reading loginpage.html:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(loginHtmlContent);
      }
    });
  } else if (req.url === '/signuppage.html') {
    // Handle the '/signuppage.html' route here
    fs.readFile('signuppage.html', 'utf8', (err, signupHtmlContent) => {
      if (err) {
        console.log("Error reading signuppage.html:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(signupHtmlContent);
      }
    });
  } else if (req.url === '/index.html') {
    // Handle the '/index.html' route here
    fs.readFile('index.html', 'utf8', (err, indexHtmlContent) => {
      if (err) {
        console.log("Error reading index.html:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexHtmlContent);
      }
    });
  } else {
    // Handle unknown routes here
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("Page not found.");
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
