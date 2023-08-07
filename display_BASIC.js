const { MongoClient } = require('mongodb');
const http = require('http');

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

      const htmlResponse = `
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
        @media (max-width: 600px) {
            /*hide these elements*/
            .hide-on-small-screen {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div id="mainContainer">
        <header id = "header"></header>
        <div class="container">
            <div class="left-col"></div>
            <div id = "mainContent" class="middle-col"></div>
            <div class="right-col">RIGHT COLUMN</div>
        </div>
    </div>
</body>
</html>

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlResponse);
    } catch (err) {
      console.log("Error in request:", err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end("An error occurred while processing the request.");
    }
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
