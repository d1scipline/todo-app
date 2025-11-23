import "./styles.css";

class todoItem {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.todoList = [];
  }

  addItem(item) {
    this.todoList.push(item);
  }

  removeItem(item) {
    const index = this.todoList.indexOf(item);
    if (index > -1) {
      this.todoList.splice(index, 1);
      return 1;
    } else {
      return 0;
    }
  }
}

const newProject = new Project("Build Robot");
const item1 = new todoItem(
  "Buy arduino",
  "Order an arduino online",
  "25/11/2025",
  3
);
const item2 = new todoItem(
  "Get 3D Printer",
  "Buy a 3d printer",
  "26/11/2025",
  2
);
newProject.addItem(item1);
newProject.addItem(item2);
console.log(JSON.parse(JSON.stringify(newProject.todoList)));
newProject.removeItem(item2);
console.log(newProject.todoList);
