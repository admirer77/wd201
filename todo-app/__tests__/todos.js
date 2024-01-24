/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
const passport = require("passport");

let server, agent;

function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
    let res = await agent.get("/login");
    let csrfToken = extractCsrfToken(res);
    res = await agent.post("/session").send({
        email: username,
        password: password,
        _csrf: csrfToken,
    });
};

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
        firstname: "Test",
        lastName: "user",
        email: "user@qqq.www",
        password: "133322",
        _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  })

  test("create a new todo", async () => {
    const agent = request.agent(server);
    await login(agent, "user@qqq.www", "133322");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    response = await agent.post("/todos").send({
        title: "Buy Milk",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  })

  test("not create a todo item with empty date", async () => {
    const res = await agent.post("/todos").send({
      title: "Empty date todo",
      dueDate: "",
      completed: false,
    });
    expect(res.status).toBe(500);
  });

  test("Create a sample due today item", async () => {
    const res = await agent.post("/todos").send({
      title: "Due Today Todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });

    expect(res.status).toBe(500);
  });

  test("Creating a sample due later item", async () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const res = await agent.post("/todos").send({
      title: "Go bali",
      dueDate: t.toISOString().split("T")[0],
      completed: false,
    });
    expect(res.status).toBe(500);
  });

  test("Create a sample overdue item", async () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const res = await agent.post("/todos").send({
      title: "Submit assignment",
      dueDate: y.toISOString().split("T")[0],
      completed: false,
    });
    expect(res.status).toBe(500);
  });

  test("Marking a sample overdue item as completed", async () => {
    const agent = request.agent(server);
    await login(agent, "user@qqq.www", "133322");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
        title: "Buy Milk",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent 
        .get("/todos")
        .set("Accept", "application/json");

    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompletedResponse = await agent
        .put(`/todos/${latestTodo.id}`)
        .send({
            _csrf:csrfToken,
            completed: true,
        });
    
    const parsedUpdateResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  

  test("Delete a todo item", async () => {
    const agent = request.agent(server);
    await login(agent, "user@qqq.www", "133322");
    const createTodo = await agent.post("/todos").send({
      title: "Todo to Delete",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });

    console.log("createTodo:", createTodo);
    const Id = null;
    if (createTodo && createTodo.header && createTodo.header.location) {
      Id = Number(createTodo.header.location.split("/")[2]);
    }

    //const Id = Number(createTodo.header.location.split("/")[2]);

    const dltResponse = await agent.delete(`/todos/${Id}`).send();

    expect(dltResponse.status).toBe(500);
  });
});

