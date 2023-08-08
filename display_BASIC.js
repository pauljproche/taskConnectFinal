const { MongoClient } = require('mongodb');
const http = require('http');
const fs = require('fs');

const uri = "mongodb+srv://taskconnect2:V02gss7wWBeSd47M@cluster0.szozfpl.mongodb.net/?retryWrites=true&w=majority";

async function run(collectionName) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db("taskConnect");
    const collection = database.collection(collectionName);
    const query = await collection.find({}).toArray();
    return query;
  } catch (err) {
    console.log("Error in MongoDB query for collection:", err);
    throw err;
  } finally {
    await client.close();
  }
}

const port = process.env.PORT || 3000;

http.createServer(async function (req, res) {
  if (req.url === '/' || req.url === '/home') {
    try {
      const queryResult1 = await run("taskCard");
      const queryResult2 = await run("userProfile");

      // Convert results to a string for display
      const queryResult1String = JSON.stringify(queryResult1, null, 2);
      const queryResult2String = JSON.stringify(queryResult2, null, 2);
      
      const htmlFile = req.url === '/' ? 'frontpage.html' : 'index.html';
      // const frontpageTemplate = fs.readFileSync('frontpage.html', 'utf8');
      // const indexTemplate = fs.readFileSync('index.html', 'utf8');
      // const htmlResponse = 

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
                </head>
                <body>
                    ${htmlContent}
                    <div>
                      <h2>Query Results:</h2>
                      <pre>${queryResult2String}</pre>
                    </div>  
                </body>
                </html>`;
          } else {
            htmlResponse = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                      <meta name="viewport" charset="utf-8" content="width=device-width, initial-scale=1.0">
                      <title>TaskConnect</title>
                  </head>
                  <body>
                      ${htmlContent}
                      <div>
                        <h2>Query Results:</h2>
                        <pre>${queryResult1String}</pre>
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
