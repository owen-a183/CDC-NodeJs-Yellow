const fs = require("fs");
const data = require("./dummy.json");

class Controller {
  //get all todos
  async getTodos() {
    return new Promise((resolve, _) => resolve(data));
  }

  async getTodo(id) {
    return new Promise((resolve, _) => {
      // find todo with id
      let todo = data.find((todo) => todo.id === parseInt(id));

      // if todo not found, return an error
      if (!todo) {
        reject(`No todo with id ${id} found`);
      }
      // return todo with id
      resolve(todo);
    });
  }

  //post a todo
  async createTodo(todo) {
    //create variable date
    const curDate = new Date();
    return new Promise((resolve, _) => {
      //check if date in request is bigger than current date
      if (new Date(todo.deadline) < curDate) {
        //rejected because deadline is earlier than today
        const message = "Deadline cannot be earlier than today";
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message, null, 2));
        return;
      }

      //create variable with todo set from param and id set from data.length
      let newTodo = {
        ...todo,
        id: data.length,
      };

      //push newTodo to data (local json)
      data.push(newTodo);

      //saving local json and its error handling
      fs.writeFile("./dummy.json", JSON.stringify(data), (err) => {
        if (err) {
          const message = {
            message: "Error when writing data",
          };
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      });

      //return the new created todo
      resolve(newTodo);
    });
  }

  // updating a todo
  async updateTodo(id, newTodo) {
    return new Promise((resolve, reject) => {
      //find the todo
      let todo = data.find((todo) => todo.id === parseInt(id));
      // if todo not found, return an error
      if (!todo) {
        reject(`No todo with id ${id} found`);
      }

      //else, update it by each field required
      todo["done"] = newTodo.done;
      todo["deadline"] = newTodo.deadline;
      todo["description"] = newTodo.description;

      //save variable todo to local json
      fs.writeFile("./dummy.json", JSON.stringify(data), (err) => {
        if (err) {
          const message = {
            message: "Error when deleting data",
          };
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      });

      // return the updated todo
      resolve(todo);
    });
  }

  async deleteTodo(id) {
    return new Promise((resolve, reject) => {
      // get the todo
      let todo = data.find((todo) => todo.id === parseInt(id));

      // if todo not found, return an error
      if (!todo) {
        reject(`No todo with id ${id} found`);
      }

      //filter a todo
      let newTodo = data.filter((todo) => todo.id !== parseInt(id));

      //save new todo to a json local file
      fs.writeFile("./dummy.json", JSON.stringify(newTodo), (err) => {
        if (err) {
          const message = {
            message: "Error when deleting data",
          };
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      });

      //return a success message
      resolve(`Todo with id ${id} deleted successfully`);
    });
  }
}
module.exports = Controller;
