const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
    
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(3000, () => { });
        agent = request.agent(server);
    });


    afterAll( async () => {
        await db.sequelize.close();
        server.close();
    })


    test("responds with json at /todos", async () => {
        const response = await agent.post('/todos').send({
            'title': 'Buy milk',
            dueDate: new Date().toISOString(),
            completed: false
        });
        expect(response.statusCode).toBe(200);
        expect(response.header["content-type"]).toBe(
            "application/json; charset=utf-8"
        );
        const parsedResponse = JSON.parse(response.text);
        expect(parsedResponse.id).toBeDefined();
    });

    test("Mark a todo as complete", async () => {
        const response = await agent.post('/todos').send({
            'title': 'Buy milk',
            dueDate: new Date().toISOString(),
            completed: false
        });
        const parsedResponse = JSON.parse(response.text);
        const todoID = parsedResponse.id;

        expect(parsedResponse.completed).toBe(false);
        
        const markCompleteResponse = await agent.put(`/todos/${todoID}/markAsCompleted`).send();
        const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
        expect(parsedUpdateResponse.completed).toBe(true);
    });

    test("Fetches all todos in the database using /todos endpoint", async () => {
        await agent.post("/todos").send({
          title: "Buy xbox",
          dueDate: new Date().toISOString(),
          completed: false,
        });
        await agent.post("/todos").send({
          title: "Buy ps3",
          dueDate: new Date().toISOString(),
          completed: false,
        });
        const response = await agent.get("/todos");
        const parsedResponse = JSON.parse(response.text);
        
        expect(parsedResponse.length).toBe(4);
        expect(parsedResponse[3]["title"]).toBe("Buy ps3");
    });
    
    test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
        const createResponse = await agent.post("/todos").send({
            title: "To be deleted",
            dueDate: new Date().toISOString(),
            completed: false,
        });

        const createdTodoId = createResponse.body.id;
        const deleteResponse = await agent.delete(`/todos/${createdTodoId}`);
    
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.success).toBe(true);
    
        const fetchAfterDeleteResponse = await agent.get(`/todos/${createdTodoId}`);
        expect(fetchAfterDeleteResponse.status).toBe(404);
    });
    
})
