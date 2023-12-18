const todoList = require('../todo');

describe("Todolist Test Suite", () => {
    let todoInstance;

    beforeAll(() => {
      todoInstance = todoList();
      todoInstance.add({
        title: "new todo",
        completed: false,
        dueDate: new Date().toLocaleDateString("en-CA") // yesterday
      });
      todoInstance.add({
        title: "Test todo",
        completed: false,
        dueDate: new Date().toLocaleDateString("en-CA", { addDays: 1 }) // tomorrow
      });
    });
    

    test("Should add new todo", () => {
        const todoItemsCount = todoInstance.all.length;
        todoInstance.add({
            title: "Test todo",
            completed: false,
            dueDate: new Date().toLocaleDateString("en-CA")
        });
        expect(todoInstance.all.length).toBe(todoItemsCount + 1);
    });

    test("Should mark a todo as complete", () => {
        expect(todoInstance.all[0].completed).toBe(false);
        todoInstance.markAsComplete(0);
        expect(todoInstance.all[0].completed).toBe(true);
    });

    test("Should retrieve overdue items", () => {
      const overDueTodoItemsCount = todoInstance.overdue().length;
      // add the over due task
      expect(todoInstance.overdue().length+1).toEqual(overDueTodoItemsCount+1);
        // Add more specific assertions based on your implementation
    });

    test("Should retrieve due today items", () => {
        const dueTodayItems = todoInstance.dueToday();
        expect(dueTodayItems.length).toBeGreaterThan(0);
        // Add more specific assertions based on your implementation
    });

    test("Should retrieve due later items", () => {
        const dueLaterItems = todoInstance.dueLater().length;
        expect(todoInstance.dueLater().length+1).toEqual(dueLaterItems+1);
        // Add more specific assertions based on your implementation
    });
});
