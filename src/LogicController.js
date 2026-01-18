import { todoItem, Project } from "./todoBackend";

export class LogicController {
  constructor(projects_list) {
    this.projects_list = projects_list;
  }

  // Add project by name
  addProject(project_name) {
    this.projects_list.push(new Project(project_name));
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
    projects_list[proj].addItem(task);
  }

  // Remove task from project with ids
  removeTaskfromProject(task_id, project_id) {
    let proj_ind = this.projects_list.findIndex((a) => a.id === project_id);
    projects_list[proj_ind].removeItem(task_id);
  }

  // Get project by id
  getProject(project_id) {
    let proj_ind = this.projects_list.findIndex((a) => a.id === project_id);
    return this.projects_list[proj_ind];
  }

  checkOffItem(project_id, item_id) {
    let proj_ind = this.projects_list.findIndex((a) => a.id === project_id);
    this.projects_list[proj_ind].checkOffItem(item_id);
  }
}
