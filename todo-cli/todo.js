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
  
 module.exports = todoList;