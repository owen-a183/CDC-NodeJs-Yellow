const http = require("http");
const Todo = require("./controller");
const { getReqData } = require("./utils");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // GET all /api/todos/
  if (req.url === "/api/todos" && req.method === "GET") {
    //get all todos
    const todos = await new Todo().getTodos();
    // set the status code, and content-type
    res.writeHead(200, { "Content-Type": "application/json" });
    // send the data
    res.end(JSON.stringify(todos));
  }

  // GET an object /api/todos/
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "GET") {
    try {
      // get the id from url
      const id = req.url.split("/")[3];
      // find a todo todo
      let message = await new Todo().getTodo(id);
      // set the status code to 200 and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the message
      res.end(JSON.stringify({ message }));
    } catch (error) {
      // set the status code and content-type
      res.writeHead(404, { "Content-Type": "application/json" });
      // send the error
      res.end(JSON.stringify({ message: error }));
    }
  }

  // POST /api/todos/
  else if (req.url === "/api/todos" && req.method === "POST") {
    // get the data sent along
    let todo_data = await getReqData(req);
    // create the todo
    let todo = await new Todo().createTodo(JSON.parse(todo_data));
    // set the status code and content-type
    res.writeHead(201, { "Content-Type": "application/json" });
    //send the todo
    res.end(JSON.stringify(todo));
  }

  // DELETE /api/todos/
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "DELETE") {
    try {
      // get the id from url
      const id = req.url.split("/")[3];
      // delete todo
      let message = await new Todo().deleteTodo(id);
      // set the status code to 200 and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the message
      res.end(JSON.stringify({ message }));
    } catch (error) {
      // set the status code and content-type
      res.writeHead(404, { "Content-Type": "application/json" });
      // send the error
      res.end(JSON.stringify({ message: error }));
    }
  }

  // UPDATE /api/todos/
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "PATCH") {
    try {
      // get the id from the url
      const id = req.url.split("/")[3];
      // get data from req
      let todo_data = await getReqData(req);
      // update todo with data from req
      let updated_todo = await new Todo().updateTodo(id, JSON.parse(todo_data));
      // set the status code to 200 and content-type
      res.writeHead(200, { "Content-Type": "application/json" });
      // send the message
      res.end(JSON.stringify(updated_todo));
    } catch (error) {
      // set the status code and content type
      res.writeHead(404, { "Content-Type": "application/json" });
      // send the error
      res.end(JSON.stringify({ message: error }));
    }
  }

  // default (route not found)
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
