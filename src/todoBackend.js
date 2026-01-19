import { it } from "date-fns/locale";

export class todoItem {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.creationDate = new Date();
    this.dueDate = dueDate;
    this.priority = priority; //3 most important 0 least important
    this.isDone = 0;
    this.id = crypto.randomUUID();
  }

  changeIsDoneStatus() {
    this.isDone = this.isDone === 0 ? 1 : 0;
  }

  updateItem(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

export class Project {
  constructor(name) {
    this.name = name;
    this.todoList = [];
    this.id = crypto.randomUUID();
  }

  //Takes todoItem and adds it to the list
  addItem(item) {
    this.todoList.push(item);
  }

  //Removes the todo item at given index, returns 0 if the item does not exist
  removeItem(itemId) {
    let itemIndex = this.todoList.findIndex((a) => a.id === itemId);
    if (this.todoList[itemIndex]) {
      this.todoList.splice(itemIndex, 1);
      return 1;
    } else {
      return 0;
    }
  }

  //This is basically a toggle switch something lol
  toggleItem(itemId) {
    let index = this.todoList.findIndex((a) => a.id === itemId);

    if (this.todoList[index]) {
      this.todoList[index].changeIsDoneStatus();
      return 1;
    } else {
      return 0;
    }
  }

  getAllItems() {
    return this.todoList;
  }

  updateItem(itemId, title, description, dueDate, priority) {
    let index = this.todoList.findIndex((a) => a.id === itemId);
    this.todoList[index].updateItem(title, description, dueDate, priority);
  }

  getItem(itemId) {
    let index = this.todoList.findIndex((a) => a.id === itemId);
    return this.todoList[index];
  }
}

/*
const newProject = new Project("Build Robot");
const item1 = new todoItem(
  "Buy arduino",
  "Order an arduino online",
  new Date("2025", "11", "26"),
  3,
);

const item2 = new todoItem(
  "Get 3D Printer",
  "Buy a 3d printer",
  new Date("2025", "11", "25"),
  2,
);

const item3 = new todoItem(
  "Assignment submission",
  "Submit your assignment",
  new Date("2025", "12", "3"),
  3,
);

newProject.addItem(item1);
newProject.addItem(item2);
newProject.addItem(item3);
*/
