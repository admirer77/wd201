const todoList = require('../todo');
const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);

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

    test('Should add an overdue todo item', () => {
      const overdueTodo = { title: 'Pay bills', dueDate: '2023-12-12', completed: false };
      todoInstance.add(overdueTodo);
      const overdueItems = todoInstance.overdue();
      expect(overdueItems.length).toBe(1);
      expect(overdueItems[0]).toEqual(overdueTodo);
    });
    

    test("Should retrieve due today items", () => {
        const dueTodayItems = todoInstance.dueToday();
        expect(dueTodayItems.length).toBeGreaterThan(0);
        // Add more specific assertions based on your implementation
    });

    test("Should retrieve due later items", () => {
      const dueLaterTodo = { title: 'Call dentist', dueDate: '2024-12-29', completed: false };
      todoInstance.add(dueLaterTodo);
      const dueLaterItems = todoInstance.dueLater();
      expect(dueLaterItems.length).toBe(1);
      expect(dueLaterItems[0]).toEqual(dueLaterTodo);
    });
});
