import "./styles.css";
import { format, formatDistance } from "date-fns";

class todoItem {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.creationDate = new Date();
    this.dueDate = dueDate;
    this.priority = priority; //3 most important 0 least important
    this.isDone = 0;
  }

  changeIsDoneStatus() {
    this.isDone = this.isDone === 0 ? 1 : 0;
  }

  changeTitle(newTitle) {
    if (newTitle != "") {
      this.title = newTitle;
      return 1;
    } else {
      return 0;
    }
  }

  changeDescription(newDescription) {
    if (newDescription != "") {
      this.description = newDescription;
      return 1;
    } else {
      return 0;
    }
  }

  //refactor
  changeDueDate(newDate) {
    if (newDate != "") {
      this.dueDate = newDate;
      return 1;
    } else {
      return 0;
    }
  }

  changePriority(newPriority) {
    if (0 <= newPriority <= 3) {
      this.priority = newPriority;
      return 1;
    } else {
      return 0;
    }
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.todoList = [];
  }

  //Takes todoItem and adds it to the list
  addItem(item) {
    this.todoList.push(item);
  }

  sortTodoList(key = 0) {
    //Sort by creation date (also default)
    if (key == 0) {
      this.todoList.sort(function (a, b) {
        if (a.creationDate < b.creationDate) return -1;
        if (b.creationDate < a.creationDate) return 1;
        return 0;
      });
    }

    //Sort by name
    if (key == 1) {
      this.todoList.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (b.title < a.title) return 1;
        return 0;
      });
    }

    //Sort by priority
    if (key == 2) {
      this.todoList.sort(function (a, b) {
        if (a.priority > b.priority) return -1;
        if (b.priority > a.priority) return 1;
        return 0;
      });
    }

    //Sort by date
    if (key == 3) {
      this.todoList.sort(function (a, b) {
        if (a.dueDate < b.dueDate) return -1;
        if (b.dueDate < a.dueDate) return 1;
        return 0;
      });
    }
  }

  //Removes the todo item at given index, returns 0 if the item does not exist
  removeItem(itemIndex) {
    if (this.todoList[itemIndex]) {
      this.todoList.splice(itemIndex, 1);
      return 1;
    } else {
      return 0;
    }
  }

  //This is basically a toggle switch something lol
  checkOffItem(index) {
    if (this.todoList[index]) {
      this.todoList[index].changeIsDoneStatus();
      return 1;
    } else {
      return 0;
    }
  }

  getCompletedItems() {
    let completedList = [];
    for (let i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].isDone == 1) {
        completedList.push(this.todoList[i]);
      }
    }
    return completedList;
  }

  getUncompletedItems() {
    let uncompletedList = [];
    for (let i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].isDone == 0) {
        uncompletedList.push(this.todoList[i]);
      }
    }
    return uncompletedList;
  }

  getIndexOfItem(item) {
    return this.todoList.indexOf(item);
  }

  getAllItems() {
    return this.todoList;
  }

  getItem(index) {
    if (this.todoList[index]) {
      return this.todoList[index];
    } else {
      return 0;
    }
  }

  //For debugging purposes
  printList() {
    console.log("\n");
    for (let i = 0; i < this.todoList.length; i++) {
      console.log(this.todoList[i]);
    }
  }
}

const newProject = new Project("Build Robot");
const item1 = new todoItem(
  "Buy arduino",
  "Order an arduino online",
  new Date("2025", "11", "26"),
  3
);

const item2 = new todoItem(
  "Get 3D Printer",
  "Buy a 3d printer",
  new Date("2025", "11", "25"),
  2
);

const item3 = new todoItem(
  "Assignment submission",
  "Submit your assignment",
  new Date("2025", "12", "3"),
  3
);

newProject.addItem(item1);
newProject.addItem(item2);
newProject.addItem(item3);
