const todoList = require('../todo');

const { all, markAsComplete, add, getOverdue, getDueToday, getDueLater } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "new todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
  });

  // Existing tests
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  // New test cases

  test("Should retrieve overdue items", () => {
    const overdueDate = new Date().setDate(new Date().getDate() - 1);
    add({
      title: "Overdue todo",
      completed: false,
      dueDate: overdueDate.toLocaleDateString("en-CA"),
    });
    const overdueItems = getOverdue();
    expect(overdueItems.length).toBeGreaterThanOrEqual(1);
    expect(overdueItems[0].title).toBe("Overdue todo");
  });

  test("Should retrieve due today items", () => {
    const today = new Date().toLocaleDateString("en-CA");
    add({
      title: "Today's todo",
      completed: false,
      dueDate: today,
    });
    const dueTodayItems = getDueToday();
    expect(dueTodayItems.length).toBeGreaterThanOrEqual(1);
    expect(dueTodayItems[0].title).toBe("Today's todo");
  });

  test("Should retrieve due later items", () => {
    const futureDate = new Date().setDate(new Date().getDate() + 1);
    add({
      title: "Later todo",
      completed: false,
      dueDate: futureDate.toLocaleDateString("en-CA"),
    });
    const dueLaterItems = getDueLater();
    expect(dueLaterItems.length).toBeGreaterThanOrEqual(1);
    expect(dueLaterItems[0].title).toBe("Later todo");
  });
});
