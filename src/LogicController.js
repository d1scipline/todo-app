import { todoItem, Project } from "./todoBackend";

export class LogicController {
  constructor(projects_list) {
    this.projects_list = projects_list;
  }

  // Add project by name
  addProject(project_name) {
    this.projects_list.push(new Project(project_name));
    return this.projects_list[this.projects_list.length - 1].id;
  }

  // Remove project by id
  removeProject(id) {
    let rem = this.projects_list.findIndex((a) => a.id === id);
    if (rem !== -1) {
      this.projects_list.splice(rem, 1);
    }
  }

  // Add task to project with project id
  addTasktoProject(task, project_id) {
    let proj = this.projects_list.findIndex((a) => a.id === project_id);
    this.projects_list[proj].addItem(task);
  }

  addTasktoProjectLong(title, description, dueDate, priority, project_id) {
    const task = new todoItem(title, description, dueDate, priority);
    let proj = this.projects_list.findIndex((a) => a.id === project_id);
    this.projects_list[proj].addItem(task);
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
      }
    }
  }

  updateTaskName(name, id) {
    const task = this.getTask(id);
    this.updateTask(id, name, task.description, task.dueDate, task.priority);
  }

  getAllProjects() {
    return this.projects_list;
  }

  getTasks(project_id) {
    let proj_ind = this.projects_list.findIndex((a) => a.id === project_id);
    return this.projects_list[proj_ind].getAllItems();
  }
}
