const request = require("supertest");
var cheerio =require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
    var $ = cheerio.load(res.text);
    return $("[name=_csrf]").val();
}

describe("Todo test suite", () => {
    
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(4000, () => { });
        agent = request.agent(server);
    });


    afterAll( async () => {
        await db.sequelize.close();
        server.close();
    });

    test("creating a to-do", async () => {
        const res = await agent.get("/");
        const csrfToken = extractCsrfToken(res);
        const response = await agent.post('/todos').send({
            title: 'Buy milk',
            dueDate: new Date().toISOString(),
            completed: false,
            "_csrf": csrfToken
        });
        expect(response.statusCode).toBe(302);
    });


    test("Updating a to-do", async () => {
        let res = await agent.get("/");
        let csrfToken = extractCsrfToken(res);
        await agent.post('/todos').send({
            title: 'Buy milk',
            dueDate: new Date().toISOString(),
            completed: false,
            "_csrf": csrfToken
        });
        
        const groupedTodosResponse = await agent    
            .get("/")
            .set("Accept", "application/json");
        const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
        const dueTodayCount = parsedGroupedResponse.dueTodayTodos.length;
        const latestTodo = parsedGroupedResponse.dueTodayTodos[dueTodayCount - 1];

        res = await agent.get("/");
        csrfToken = extractCsrfToken(res);

        const markCompleteResponse = await agent.put(`/todos/${latestTodo.id}/setCompletionStatus`).send({
            completed: true,
            _csrf: csrfToken,
        });

        const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
        expect(parsedUpdateResponse.todo.completed).toBe(true);
    });

    test("deleting a to-do", async () => {
        const todo = await db.Todo.create({
            title: 'Take out the trash',
            dueDate: new Date().toISOString(),
            completed: false
        });

        const res = await agent.get("/");
        const csrfToken = extractCsrfToken(res);

        const deleteResponse = await agent
            .delete(`/todos/${todo.id}`)
            .send({
                "_csrf": csrfToken
            });
        
        expect(deleteResponse.statusCode).toBe(200);

        const getDeletedTodo = await agent.get(`/todos/${todo.id}`);
        expect(getDeletedTodo.statusCode).toBe(404);
    });
});

