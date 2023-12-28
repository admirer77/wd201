const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const { Todo } = require("./models")

app.get("/todos", async (request, response) => {
    console.log("Todo list")
    try {
        const todos = await Todo.findAll(); // Assuming you're using Sequelize or a similar ORM
        response.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/todos", async (request, response) => {
    console.log("Creating a todo", request.body)
    try {
        const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate, completed: false})
        return response.json(todo)    
    } catch (error) {
        console.log(error)
        return response.status(422).json(error)
    }
}) 

app.put("/todos/:id/markAsCompleted", async (request, response) => {
    console.log("We have to update a todo with ID:", request.params.id)
    const todo = await Todo.findByPk(request.params.id)
    try {
        const updatedTodo = await todo.markAsCompleted()
        return response.json(updatedTodo)
    } catch (error) {
        console.log(error)
        return response.status(422).json(error)
    }
}) 

app.delete("/todos/:id", async (request, response) => {
    console.log("Delete a todo by ID:", request.params.id)
    const todoId = request.params.id;
    const todo = await Todo.findByPk(todoId);
    try {

        if (!todo) {
            return response.status(404).json({ success: false });
        }
        else{
            return response.send( await todo.destroy() ? true : false );
        }
        
    } catch (error) {
        console.error("Error deleting todo:", error);
        return response.status(500).json({ success: false, error: "Internal Server Error" });
    }
})


module.exports = app;
