const todoList = () => {
    const all = [];
  
    const add = (todoItem) => {
      all.push(todoItem);
    };
  
    const markAsComplete = (index) => {
      all[index].completed = true;
    };
  
    const overdue = () => {
      return all.filter((item) => new Date(item.dueDate) < new Date(today));
    };
  
    const dueToday = () => {
      return all.filter((item) => new Date(item.dueDate).toISOString().split('T')[0] === today);
    };
  
    const dueLater = () => {
      return all.filter((item) => new Date(item.dueDate) > new Date(today));
    };
  
    const toDisplayableList = (list) => {
      let output = '';
      if (list.length === 0) {
        return '';
      }
  
      for (const item of list) {
        output += `[${item.completed ? 'x' : ' '}] ${item.title}`;
        if (item.dueDate !== today) {
          output += ` ${formattedDate(new Date(item.dueDate))}`;
        }
        output += '\n';
      }
  
      return output.trim();
    };
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList,
    };
  };
  
  // Do not modify anything below this line
  
  const todos = todoList();
  
  const formattedDate = (d) => {
    return d.toISOString().split('T')[0];
  };
  
  const dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(new Date(new Date().setDate(dateToday.getDate() - 1)));
  const tomorrow = formattedDate(new Date(new Date().setDate(dateToday.getDate() + 1)));
  
  todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false });
  todos.add({ title: 'Pay rent', dueDate: today, completed: true });
  todos.add({ title: 'Service Vehicle', dueDate: today, completed: false });
  todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false });
  todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false });
  
  console.log('My Todo-list\n');
  
  console.log('Overdue');
  const overdues = todos.overdue();
  const formattedOverdues = todos.toDisplayableList(overdues);
  console.log(formattedOverdues);
  console.log('\n');
  
  console.log('Due Today');
  const itemsDueToday = todos.dueToday();
  const formattedItemsDueToday = todos.toDisplayableList(itemsDueToday);
  console.log(formattedItemsDueToday);
  console.log('\n');
  
  console.log('Due Later');
  const itemsDueLater = todos.dueLater();
  const formattedItemsDueLater = todos.toDisplayableList(itemsDueLater);
  console.log(formattedItemsDueLater);
  console.log('\n\n');
  
  
