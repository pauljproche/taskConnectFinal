const { MongoClient } = require('mongodb');
const http = require('http');
const fs = require('fs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

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

      // Read the content of index.html from the file system
      fs.readFile('index.html', 'utf8', (err, indexHtmlContent) => {
        if (err) {
          console.log("Error reading index.html:", err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end("An error occurred while processing the request.");
        } else {
          // Manually build the HTML response with the queryResult
          const htmlResponse = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name = "viewport" charset = "utf-8" content = "width=device-width, initial-scale=1.0">
                <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
                <script>
                    $(function() {
                       $("#header").load("Header.html");
                       $("#mainContent").load("currentTask.php");
                    });
                </script> -->
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
                        <li><a href="index.html">
                            <img class="icon" src="Images/logo.png" alt="company logo" />
                        </a></li>
                        <li><a href="#">Friends</a></li>
                        <li class="hide-on-small-screen"><a href="#">Challenges</a></li>
                    </ul>
            
                    <ul class="iconContainer">
                        <li class="hide-on-small-screen">
                            <a href="index.html">
                                <img class="icon" src="Images/homeIcon.png" alt="Home Icon" />
                            </a>
                        </li>
                        <!-- <li class="hide-on-small-screen">
                            <a href="#">
                                <img class="icon" src="Images/DoorbellIcon.png" alt="Notifications" />
                            </a>
                        </li> -->
                        <li class="hide-on-small-screen">
                            <a href="settings.html">
                                <img class="settingIcon" src="Images/settingIcon.png" alt="Settings" />
                            </a>
                        </li>
                        <li>
                            <a href="profilepage.html">
                                <img class="profileIcon" src="Images/profileIcon.png" alt="Profile" />
                            </a>
                        </li>
                    </ul>
                </nav>
                <div id="mainContainer">
                    <header id="header"></header>
                    <div class="container">
                        <div class="left-col"></div>
                        <div id="mainContent" class="middle-col"></div>
                        <div class="right-col">RIGHT COLUMN</div>
                    </div>
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
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
