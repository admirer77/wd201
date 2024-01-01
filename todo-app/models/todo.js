'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false})
    }

    static getTodos() {
      return this.findAll();
    }

    markAsCompleted() {
      return this.update({ completed : true})
    }
    static isOverdue(dueDate) {
      const currentDate = new Date();
      return this.dueDate < currentDate && !this.completed;
    }
    static isDueToday(dueDate) {
      const currentDate = new Date();
      
      // Check if dueDate is defined
      if (!this.dueDate) {
        return false;
      }
  
      const dueDate1 = new Date(this.dueDate);
      return (
        dueDate1.getDate() === currentDate.getDate() &&
        dueDate1.getMonth() === currentDate.getMonth() &&
        dueDate1.getFullYear() === currentDate.getFullYear() &&
        !this.completed
      );
    }
    static isDueLater(dueDate) {
      const currentDate = new Date();
      return this.dueDate > currentDate && !this.completed;
    } 
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};