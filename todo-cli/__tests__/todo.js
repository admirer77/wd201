const todoList = require('../todo');

const { all, markAsComplete, add, getOverdue } = todoList(); // Update functions based on actual implementation

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "new todo",
      completed: false,
      dueDate: new Date().toISOString(), // Use ISO format for consistent date comparisons
    });
  });

  // Existing tests
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString(),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  // New test case with fix

  test("Should retrieve overdue items", () => {
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 1);
    add({
      title: "Overdue todo",
      completed: false,
      dueDate: overdueDate.toISOString(),
    });
    const overdueItems = getOverdue();
    expect(overdueItems.length).toBeGreaterThanOrEqual(1);
    expect(overdueItems[0].title).toBe("Overdue todo");
  });

  // Add tests for getDueToday and getDueLater based on your actual implementation

});
