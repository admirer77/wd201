const express = require('express')
var csrf = require("tiny-csrf");
const app = express();
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const { Todo } = require("./models");
const path = require("path");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));



app.get('/', async (request, response) => {
  try {
    const allTodos = await Todo.getTodos();
    const overdueTodos = allTodos.filter((todo) => todo.isOverdue());
    const dueTodayTodos = allTodos.filter((todo) => todo.isDueToday());
    const dueLaterTodos = allTodos.filter((todo) => todo.isDueLater());
    const completedTodos = allTodos.filter((todo) => todo.setCompletionStatus());

    if (request.accepts('html')) {
      response.render('index', {
        title: "Todo application",
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completedTodos,
      });
    }
  } catch (error) {
    console.error('Error fetching todos:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

app.get("/todos", async (request, response) => {
  console.log("Todo list")
  try {
    const completedTodos = await getCompletedTodos();
    const todos = await Todo.findAll();
    response.json(todos,completedTodos);
    
  } catch (error) {
    console.error("Error fetching todos:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
  
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({ 
      title: request.body.title, 
      dueDate: request.body.dueDate, 
    })
    return response.redirect("/");
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.put("/todos/:id/setCompletionStatus", async (request, response) => {
  const todoId = request.params.id;

  try {
      const todo = await Todo.findByPk(todoId);

      if (!todo) {
          return response.status(404).json({ error: "Todo not found" });
      }

      todo.completed = request.body.completed;
      await todo.save();

      return response.json({ todo, message: "Todo updated successfully" });

      
  } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
  }
});



app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID:", request.params.id)
  const todoId = request.params.id;
  const todo = await Todo.findByPk(todoId);
  try {
    if (!todo) {
      return response.status(404).send(false);
    }
    else {
      return response.send(await todo.destroy() ? true : false);
    }
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return response.status(500).json({ success: false, error: "Internal Server Error" });
  }
})




module.exports = app;
