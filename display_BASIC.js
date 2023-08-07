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
            <title>TaskConnect</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              h2 {
                color: #333;
              }
              pre {
                background-color: #f0f0f0;
                padding: 10px;
              }
            </style>
          </head>
          <body>
            <h2>Hello World</h2>
            <p>Success! This app is deployed online</p>
            <h3>Query Results:</h3>
            <pre>${queryResult}</pre>
          </body>
        </html>
      `;

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
