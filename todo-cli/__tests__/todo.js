const todoList = require('../todo');

const {all, markAsComplete, add } = todoList();

describe("Todolist Test Suite", () => {
    beforeAll(() => {
        add(
            {
                title: "new todo",
                completed: false,
                dueDate: new Date().toLocaleDateString("en-CA")
            }
         );
    })

    test("Should add new todo", () => {
         const todoItemsCount = all.length;
         add(
            {
                title: "Test todo",
                completed: false,
                dueDate: new Date().toLocaleDateString("en-CA")
            }
         );
         expect(all.length).toBe(todoItemsCount + 1);
    });

    test("Should mark a todo as complete", () => {
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    });

    test("Should retrieve overdue items", () => {
      const now = new Date();
      const overdueItems = overdue();
    
      // Check if all overdue items have due dates before today
      expect(overdueItems.every((item) => item.dueDate < now)).toBe(true);
    });

    test("Should retrieve due today items", () => {
      const now = new Date();
      const dueTodayItems = dueToday();
    
      // Check if all due today items have due dates equal to today
      expect(dueTodayItems.every((item) => item.dueDate.getFullYear() === now.getFullYear() && item.dueDate.getMonth() === now.getMonth() && item.dueDate.getDate() === now.getDate())).toBe(true);
    });

    test("Should retrieve due later items", () => {
      const now = new Date();
      const dueLaterItems = dueLater();
    
      // Check if all due later items have due dates after today
      expect(dueLaterItems.every((item) => item.dueDate > now)).toBe(true);
    })
})
