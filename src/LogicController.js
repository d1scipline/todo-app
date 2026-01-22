import { todoItem, Project } from "./todoBackend";
import { format } from "date-fns";

export class LogicController {
  constructor() {
    this.projects_list = this.loadData();
  }

  // Add project by name
  addProject(project_name) {
    this.projects_list.push(new Project(project_name));
    return this.projects_list[this.projects_list.length - 1].id;
    this.saveData();
  }

  // Remove project by id
  removeProject(id) {
    let rem = this.projects_list.findIndex((a) => a.id === id);
    if (rem !== -1) {
      this.projects_list.splice(rem, 1);
    }
    this.saveData();
  }

  // Add task to project with project id
  addTasktoProject(task, project_id) {
    let proj = this.projects_list.findIndex((a) => a.id === project_id);
    this.projects_list[proj].addItem(task);
    this.saveData();
  }

  addTasktoProjectLong(title, description, dueDate, priority, project_id) {
    const task = new todoItem(title, description, dueDate, priority);
    let proj = this.projects_list.findIndex((a) => a.id === project_id);
    this.projects_list[proj].addItem(task);
    this.saveData();
  }

  updateTask(task_id, title, description, dueDate, priority) {
    var arrayLength = this.projects_list.length;
    for (var i = 0; i < arrayLength; i++) {
      let item_index = this.projects_list[i]
        .getAllItems()
        .findIndex((a) => a.id === task_id);
      if (item_index != -1) {
        this.projects_list[i].updateItem(
          task_id,
          title,
          description,
          dueDate,
          priority,
        );
      }
    }
    this.saveData();
  }

  getTask(task_id) {
    var arrayLength = this.projects_list.length;
    for (var i = 0; i < arrayLength; i++) {
      let item_index = this.projects_list[i].todoList.findIndex(
        (a) => a.id === task_id,
      );
      if (item_index != -1) {
        return this.projects_list[i].getItem(task_id);
      }
    }
  }

  // Remove task from project with ids
  removeTask(task_id) {
    var arrayLength = this.projects_list.length;
    for (var i = 0; i < arrayLength; i++) {
      let item_index = this.projects_list[i]
        .getAllItems()
        .findIndex((a) => a.id === task_id);
      if (item_index != -1) {
        this.projects_list[i].removeItem(task_id);
      }
    }
    this.saveData();
  }

  // Get project by id
  getProject(project_id) {
    let proj_ind = this.projects_list.findIndex((a) => a.id === project_id);
    return this.projects_list[proj_ind];
  }

  toggleItem(task_id) {
    var arrayLength = this.projects_list.length;
    for (var i = 0; i < arrayLength; i++) {
      let item_index = this.projects_list[i]
        .getAllItems()
        .findIndex((a) => a.id === task_id);
      if (item_index != -1) {
        this.projects_list[i].toggleItem(task_id);
        this.saveData();
      }
    }
  }

  updateTaskName(name, id) {
    const task = this.getTask(id);
    this.updateTask(id, name, task.description, task.dueDate, task.priority);
    this.saveData();
  }

  getAllProjects() {
    return this.projects_list;
  }

  getTasks(project_id) {
    let proj_ind = this.projects_list.findIndex((a) => a.id === project_id);
    return this.projects_list[proj_ind].getAllItems();
  }

  exportDataAsJSON() {
    var jsonData = {};

    let len = this.projects_list.length;
    for (let i = 0; i < len; i++) {
      var projectName = this.projects_list[i].name;
      var projectID = this.projects_list[i].id;
      var subObject = {};
      subObject["name"] = projectName;
      subObject["list"] = {};

      let lenPro = this.projects_list[i].getAllItems().length;

      for (let j = 0; j < lenPro; j++) {
        var itemObject = {};
        var task = this.projects_list[i].getAllItems()[j];
        itemObject["title"] = task.title;
        itemObject["description"] = task.description;
        var date = format(task.dueDate, "yyyy-MM-dd");
        itemObject["dueDate"] = date;
        itemObject["priority"] = task.priority.toString();
        itemObject["isDone"] = task.isDone.toString();
        subObject["list"][task.id] = itemObject;
      }

      jsonData[projectID] = subObject;
    }
    return jsonData;
  }

  importDataFromJSON(data) {
    var projList = [];
    for (const project in data) {
      var projectJSONObj = data[project];
      var name = projectJSONObj["name"];
      var projectObject = new Project(name);
      for (const task in projectJSONObj["list"]) {
        var taskJSONObj = projectJSONObj["list"][task];
        var title = taskJSONObj["title"];
        var description = taskJSONObj["description"];
        var date = taskJSONObj["dueDate"];
        var [year, month, day] = date.split("-").map(Number);
        var dueDate = new Date(year, month - 1, day);
        var priority = Number(taskJSONObj["priority"]);
        var isDone = Number(taskJSONObj["isDone"]);
        var taskObject = new todoItem(
          title,
          description,
          dueDate,
          priority,
          isDone,
        );
        projectObject.addItem(taskObject);
      }
      projList.push(projectObject);
    }
    return projList;
  }

  loadData() {
    const dataString = localStorage.getItem("todoData");
    var obj = {};
    if (dataString == null) {
      obj = {};
    } else {
      obj = JSON.parse(dataString);
    }
    return this.importDataFromJSON(obj);
  }

  saveData() {
    const dataObj = this.exportDataAsJSON();
    const dataJSON = JSON.stringify(dataObj);
    localStorage.setItem("todoData", dataJSON);
  }
}
