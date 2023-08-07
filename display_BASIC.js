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

      // Read the content of Header.html from the file system
      fs.readFile('Header.html', 'utf8', (err, headerHtmlContent) => {
        if (err) {
          console.log("Error reading Header.html:", err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end("An error occurred while processing the request.");
        } else {
          // Replace the placeholder with the query result in the header HTML
          headerHtmlContent = headerHtmlContent.replace('<!--QUERY_RESULT_PLACEHOLDER-->', JSON.stringify(queryResult));

          // Read the content of index.html from the file system
          fs.readFile('index.html', 'utf8', (err, indexHtmlContent) => {
            if (err) {
              console.log("Error reading index.html:", err);
              res.writeHead(500, { 'Content-Type': 'text/html' });
              res.end("An error occurred while processing the request.");
            } else {
              // Manually build the HTML response with the queryResult
              const htmlResponse = indexHtmlContent.replace('<!--HEADER_CONTENT_PLACEHOLDER-->', headerHtmlContent);

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(htmlResponse);
            }
          });
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
