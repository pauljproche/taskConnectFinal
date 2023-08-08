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
  if (req.url === '/' || req.url === '/home') {
    try {
      const queryResult = await run();
      
      const htmlFile = req.url === '/' ? 'frontpage.html' : 'index.html';

      fs.readFile(htmlFile, 'utf8', (err, htmlContent) => {
        if (err) {
          console.log(`Error reading ${htmlFile}:`, err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end("An error occurred while processing the request.");
        } else {
          let htmlResponse;
          if (req.url === '/') {
            htmlResponse = `
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
                            <li><a href="/">
                                <img class="icon" src="https://pauljproche.github.io/taskConnectFinal/Images/logo.png" alt="company logo" />
                            </a></li>
                            <li class="hide-on-small-screen"><a href="/home">TaskConnect</a></li>
                        </ul>
            
                        <ul>
                            <li class="hide-on-small-screen"><a href="#">About Us</a></li>
                            <li><a href="/loginpage"  class="navbutton">Log In</a></li>
                        </ul>
                    </nav>
                </header>
                <div class="container">
                    <div margin-top: 20px>
                        <h2>Get the perfect </h2>
                        <h2>schedule with </h2>
                        <h2>TaskConnect!</h2>
                        <a href="/signuppage" class="button">Sign Up</a>
                    </div>
                    <img src="https://pauljproche.github.io/taskConnectFinal/Images/frontpage.png" alt="Image" class="right-image">
                </div>
                <div>
                      <h2>Query Results:</h2>
                      <pre>${queryResult}</pre>
                </div>
            </body>
            </html>`;
          } else {
            htmlResponse = `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta name = "viewport" charset = "utf-8" content = "width=device-width, initial-scale=1.0">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
                    <script>
                        $(function() {
                           $("#header").load("Header.html");
                           $("#mainContent").load("currentTask.php");
                        });
                    </script>
                    <title>TaskConnect</title>
                    <style>
                        body {
                            margin: 0;
                            background-color: #2B3A45; /* Set background color for body */
                        }
                        a { 
                            text-decoration: none;
                            color: #000000; 
                        }
                        /* div {
                            color: #000000;
                            padding: 10px;
                        } */
                        .container {
                            margin-top: 3px; /*add the small margin at top*/
                            background-color:#2E4272;
                            display: flex;
                            height: 100vh; /*spans 100% of vert. viewport*/
                            padding: 0px;
                        }
                        .left-col {
                            background-color:#2B3A45;
                            width: 200px;
                        }
                        .middle-col {
                            background-color: #EAEAEA;
                            flex-grow: 1;
                            padding: 20px;
                        }
                        .right-col {
                            background-color:#D5D5D5;
                            width: 200px;
                        }
                        nav {
                            display: flex;
                            background-color: #EAEAEA;
                            align-items: center;
                            /*vert align*/
                            justify-content: flex-end;
                            /*makes nav ele. right aligned*/
                            white-space: nowrap;
                        }
                
                        nav li {
                            padding-right: 20px;
                            display: inline;
                            /*horizontal align*/
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
                
                        .settingIcon {
                            width: 33px;
                            height: 30px;
                        }
                
                        .profileIcon {
                            height: 40px;
                            width: 40px;
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
                    <nav>
                        <ul class="logo iconContainer">
                            <li><a href="/">
                                <img class="icon" src="https://pauljproche.github.io/taskConnectFinal/Images/logo.png" alt="company logo" />
                            </a></li>
                            <li><a href="#">Friends</a></li>
                            <li class="hide-on-small-screen"><a href="#">Challenges</a></li>
                        </ul>
                
                        <ul class="iconContainer">
                            <li class="hide-on-small-screen">
                                <a href="/home">
                                    <img class="icon" src="https://pauljproche.github.io/taskConnectFinal/Images/homeIcon.png" alt="Home Icon" />
                                </a>
                            </li>
                            <!-- <li class="hide-on-small-screen">
                                <a href="#">
                                    <img class="icon" src="Images/DoorbellIcon.png" alt="Notifications" />
                                </a>
                            </li> -->
                            <li class="hide-on-small-screen">
                                <a href="/settings">
                                    <img class="settingIcon" src="https://pauljproche.github.io/taskConnectFinal/Images/settingIcon.png" alt="Settings" />
                                </a>
                            </li>
                            <li>
                                <a href="/profilepage">
                                    <img class="profileIcon" src="https://pauljproche.github.io/taskConnectFinal/Images/profileIcon.png" alt="Profile" />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div id="mainContainer">
                        <header id="header"></header>
                        <div class="container">
                            ${htmlContent}
                            <div class="left-col"></div>
                            <div>
                                    <h2>Query Results:</h2>
                                    <pre>${queryResult}</pre>
                            </div>
                            <div id="mainContent" class="middle-col"></div>
                            <div class="right-col">RIGHT COLUMN</div>       
                        </div>
                    </div>
                </body>
                </html>`;
          }

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
  } else if (req.url === '/loginpage') {
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
  } else if (req.url === '/signuppage') {
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
  } else if (req.url === '/settings') {
    fs.readFile('settings.html', 'utf8', (err, settingsHtmlContent) => {
      if (err) {
        console.log("Error reading settings.html:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(settingsHtmlContent);
      }
    });
  } else if (req.url === '/profilepage') {
    fs.readFile('profilepage.html', 'utf8', (err, profileHtmlContent) => {
      if (err) {
        console.log("Error reading profilepage.html:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(profileHtmlContent);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("Page not found.");
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
