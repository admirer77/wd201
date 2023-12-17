// __tests__/todo.js

const Todo = require('../todo');

test('Creating a new todo', () => {
  const todoList = new Todo();
  todoList.createNewTodo('Test Todo', '2023-12-31');
  expect(todoList.todos.length).toBe(1);
});

test('Marking a todo as completed', () => {
  const todoList = new Todo();
  todoList.createNewTodo('Test Todo', '2023-12-31');
  todoList.markTodoAsCompleted(0);
  expect(todoList.todos[0].completed).toBe(true);
});

test('Retrieval of overdue items', () => {
  const todoList = new Todo();
  todoList.createNewTodo('Overdue Todo', '2022-01-01');
  const overdueItems = todoList.getOverdueItems();
  expect(overdueItems.length).toBe(1);
});

test('Retrieval of due today items', () => {
  const todoList = new Todo();
  todoList.createNewTodo('Due Today Todo', '2023-12-17');
  const dueTodayItems = todoList.getDueTodayItems();
  expect(dueTodayItems.length).toBe(1);
});

test('Retrieval of due later items', () => {
  const todoList = new Todo();
  todoList.createNewTodo('Due Later Todo', '2023-12-31');
  const dueLaterItems = todoList.getDueLaterItems();
  expect(dueLaterItems.length).toBe(1);
});

test('toDisplayableList function', () => {
  const todoList = new Todo();
  todoList.createNewTodo('Test Todo', '2023-12-31');
  const displayableList = todoList.toDisplayableList();
  expect(displayableList.length).toBe(1);
});
