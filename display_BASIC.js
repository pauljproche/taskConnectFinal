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

function getPriorityLevel(priorityLevel){
  if(priorityLevel == 1) return "!";
  else if(priorityLevel == 2) return "!!";
  else if(priorityLevel == 2) return "!!!";
  else return "";
}

// Function to format the due date
function formatDate(dueDate) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dueDate).toLocaleDateString(undefined, options);
}

// Function to get the difference in days between two dates
function getDaysDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

// Function to format due date and display message
function getDueDate(dueDate) {
  const formattedDueDate = formatDate(dueDate);
  const now = new Date();
  const dueDateObj = new Date(dueDate);

  const daysDifference = getDaysDifference(dueDateObj, now);

  if (daysDifference <= 7) {
    return `Due in ${daysDifference} days`;
  } else {
    return formattedDueDate;
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

      fs.readFile(htmlFile, 'utf8', (err, htmlContent) => {
        if (err) {
          console.log(`Error reading ${htmlFile}:`, err);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end("An error occurred while processing the request.");
        } else {
          let htmlResponse;
          let taskCardEle = '';
          queryResult1.forEach((ele,index) => {
            let subtaskArr = ele.subtasks;
            taskCardEle += `<div id = "card${index}" class = "taskCard">
                                <div class = "taskCardHeader textStyle">
                                    <div class = "taskHeading">${ele.taskName}</div>
                                    <div class = "headingEle">
                                        <div class="headingDate">${getDueDate(ele.dueDate)}</div>
                                        <div id="threeDotsKebabMenu${index}" class="kebab-menu" onclick = "toggleMenu(event)">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                        <div id="menuItems${index}" class="menu-items hidden">
                                            <div id = "editTask${index}" class="menu-item" onclick="showEditForm()">Edit Task</div>
                                        </div>
                                    </div>
                                </div>`;
            let subTaskEle = "";
            if(subtaskArr.length > 0 && subtaskArr[0] != ""){  
              subtaskArr.forEach((subEle,ind) => {          
                subTaskEle += `<div class = "subtaskContainer">
                                <div id = "subTask${index}${ind}" class = "subtask">
                                    <div class = "subTaskLeft">
                                        <div id = "priorityLevel${index}${ind}" class = "textStyle priorityLevel">${getPriorityLevel(subEle.priorityLevel)}</div>
                                        <div id = "subTaskText${index}${ind}" class = "subTaskText">
                                            <label class = "textStyle font-20" for="checkbox1">${subEle.taskName}</label>
                                            <input type="checkbox" id="checkbox${index}${ind}" class="checkbox" value = ${subEle.taskStatus}>
                                        </div>
                                    </div>
                                    <div class = "subTaskRight">
                                        <div id = "subTaskDate${index}${ind}" class = "subTaskDate">${getDueDate(subEle.dueDate)}</div>
                                        <div id="threeDotsSubTask${index}${ind}" class="kebab-menu">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                        <div id="subMenuItems${index}${ind}" class="menu-items hidden">
                                            <div class="menu-item">Edit Subtask</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
              });
            }
            taskCardEle += subTaskEle + `</div>`;
          });
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
            // let htmlCon = htmlContent.replace('QUERY_RESULT_2_STRING_PLACEHOLDER', queryResult2String);
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
                        <h2>Query Results1:</h2>
                        <pre>${queryResult1String}</pre>
                      </div>
                  </body>
                  <script>
                      var openMenuIdArr = [];
                      const queryResult2Array = ${queryResult2String};
                      document.getElementById('rightNav').innerHTML = "<h2> " + queryResult2Array[0].name + " Friend's: </h2><br/>";
                      document.getElementById('rightNav').innerHTML += queryResult2Array[0].occupation[0];
                      document.getElementById('rightNav').innerHTML += queryResult2Array[0].follower[0].name;
                      document.getElementById('cardContainer').innerHTML = ${JSON.stringify(taskCardEle)};
                      document.getElementById('leftNav').innerHTML = "Task Analytics <br/>";
                      document.getElementById('leftNav').innerHTML += queryResult2Array[0].follower[0].name;
                      function toggleMenu(event) {
                        var eventId = event.currentTarget.id;
                        var id;
                        if(eventId.includes("threeDotsKebabMenu")){
                            id = eventId.substring(18, eventId.length);
                        }     
                        var menuItems = document.getElementById("menuItems"+id);
                        if (menuItems.classList.contains('hidden')) {
                            menuItems.classList.toggle('hidden'); // Show the menu items
                            openMenuIdArr.push("menuItems"+id);
                        } else {
                            menuItems.classList.add('hidden'); // Hide the menu items
                            openMenuIdArr.pop();
                        }
                        event.stopPropagation(); // Prevent the click event from propagating to the document
                      }

                      document.addEventListener('click', function (event) {
                          if(openMenuIdArr.length > 0){
                            openMenuIdArr.forEach((ele,index) => {
                              var menuItems = document.getElementById(ele);
                              if (menuItems) {
                                  menuItems.classList.add('hidden');
                              }
                            })
                            openMenuIdArr = [];
                          } 
                      });
                      function showEditForm() {
                          var bodyContainer = document.getElementById('bodyContainer');
                          var editForm = document.getElementById('editForm');
                          
                          var bodyHeading = document.getElementById('bodyHeading');
                  
                          bodyContainer.classList.add('hidden');
                          editForm.classList.remove('hidden');
                          
                          bodyHeading.innerHTML = "Create New Task";
                          if(openMenuIdArr.length > 0){
                            openMenuIdArr.forEach((ele,index) => {
                              var menuItems = document.getElementById(ele);
                              if (menuItems) {
                                  menuItems.classList.add('hidden');
                              }
                            })
                            openMenuIdArr = [];
                          } 
                      }
                      function closeForm() {
                          var bodyContainer = document.getElementById('bodyContainer');
                          var editForm = document.getElementById('editForm');
                          var bodyHeading = document.getElementById('bodyHeading');
                  
                          bodyContainer.classList.remove('hidden');
                          editForm.classList.add('hidden');
                          bodyHeading.innerHTML = "Current Tasks";
                      }
                  </script>
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
    try {
        const queryResult1 = await run("taskCard");
        let taskCardEle = '';
        
        queryResult1.forEach((ele, index) => {
            let subtaskArr = ele.subtasks;
            taskCardEle += `<div id = "card${index}" class = "taskCard">
                                <div class = "taskCardHeader textStyle">
                                    <div class = "taskHeading">${ele.taskName}</div>
                                    <div class = "headingEle">
                                        <div class="headingDate">${getDueDate(ele.dueDate)}</div>
                                        <div id="threeDotsKebabMenu${index}" class="kebab-menu">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                        <div id="menuItems${index}" class="menu-items hidden">
                                            <div class="menu-item" onclick="showEditForm()">Edit Task</div>
                                        </div>
                                    </div>
                                </div>`;
            let subTaskEle = "";
            if(subtaskArr.length > 0 && subtaskArr[0] != ""){  
              subtaskArr.forEach((subEle, ind) => {          
                subTaskEle += `<div class = "subtaskContainer">
                                <div id = "subTask${index}${ind}" class = "subtask">
                                    <div class = "subTaskLeft">
                                        <div id = "priorityLevel${index}${ind}" class = "textStyle priorityLevel">${getPriorityLevel(subEle.priorityLevel)}</div>
                                        <div id = "subTaskText${index}${ind}" class = "subTaskText">
                                            <label class = "textStyle font-20" for="checkbox1">${subEle.taskName}</label>
                                            <input type="checkbox" id="checkbox${index}${ind}" class="checkbox" value = ${subEle.taskStatus}>
                                        </div>
                                    </div>
                                    <div class = "subTaskRight">
                                        <div id = "subTaskDate${index}${ind}" class = "subTaskDate">${getDueDate(subEle.dueDate)}</div>
                                        <div id="threeDotsSubTask${index}${ind}" class="kebab-menu">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                        <div id="subMenuItems${index}${ind}" class="menu-items hidden">
                                            <div class="menu-item">Edit Subtask</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
              });
            }
            taskCardEle += subTaskEle + `</div>`;
        });

        fs.readFile('profilepage.html', 'utf8', (err, profileHtmlContent) => {
            if (err) {
                console.log("Error reading profilepage.html:", err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end("An error occurred while processing the request.");
            } else {
                // Splitting the profileHtmlContent at a specific marker (for this example, a comment) to create two parts
                let parts = profileHtmlContent.split("<!-- TASKCARD INSERTION POINT -->");
                
                // Concatenating the header part, taskCardEle, and footer part
                const finalHtml = parts[0] + taskCardEle + parts[1];

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(finalHtml);
            }
        });
    } catch (err) {
        console.log("Error processing profile page route:", err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("An error occurred while processing the request.");
    }
} else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("Page not found.");
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
