import { LogicController } from "./LogicController";
import folderSvg from "./assets/folder.svg";
import checkboxEmpty from "./assets/checkbox-empty.svg";
import checkboxFull from "./assets/checkbox-filled.svg";
import { format } from "date-fns";

export class UIController {
  constructor(LogicController) {
    this.LogicController = LogicController;
  }

  //Add project stuff
  openAddProjectDialog(dialog) {
    dialog.showModal();
  }

  closeAddProjectDialog(dialog) {
    dialog.close("");
    const projectNameInput = document.getElementById("projectTitle");
    projectNameInput.value = "";
  }

  renderProjects() {
    const projects = this.LogicController.getAllProjects();
    const parentDiv = document.getElementById("projects-div");
    parentDiv.innerHTML = "";
    let projLen = projects.length;
    for (let i = 0; i < projLen; i++) {
      const newElement = document.createElement("div");
      newElement.setAttribute("class", "project-title");
      newElement.setAttribute("id", projects[i].id);
      const newImg = document.createElement("img");
      newImg.setAttribute("class", "folder-icon");
      newImg.setAttribute("src", folderSvg);
      newElement.appendChild(newImg);
      const newContent = document.createTextNode(projects[i].name);
      newElement.appendChild(newContent);
      parentDiv.appendChild(newElement);
    }
  }

  addProject() {
    const addProjectButton =
      document.getElementsByClassName("add-project-button")[0];

    const addProjectInputButton = document.getElementById("addProject");
    const cancelButton = document.getElementById("cancelAddProject");
    const addProjectDialog = document.getElementById("projectDialog");

    addProjectButton.addEventListener("click", () => {
      this.openAddProjectDialog(addProjectDialog);
    });

    cancelButton.addEventListener("click", () => {
      this.closeAddProjectDialog(addProjectDialog);
    });

    const form = document.getElementById("addProjectForm");
    form.addEventListener("submit", (e) => {
      const formData = new FormData(e.target);
      const title = formData.get("projectTitle");
      if (title != "") {
        this.LogicController.addProject(title);
        this.renderProjects();
      }
      e.target.reset();
    });

    const projectsDOM = document.getElementById("projects-div");
    projectsDOM.addEventListener("click", (e) => {
      const projectDiv = e.target.closest(".project-title");
      if (!projectDiv) return;
      const projID = projectDiv.id;
      this.renderProject(projID);
      console.log(projID);
    });
  }

  clearTasks() {
    const tasksList = document.getElementById("tasks-todo");
    tasksList.innerHTML = "";
  }

  //Task stuff
  renderProject(project_id = null) {
    const taskTitle = document.getElementById("tasks-title");
    const tasksList = document.getElementById("tasks-todo");
    if (project_id === null) {
      taskTitle.innerHTML = "Select Project";
      tasksList.innerHTML = "";
    } else {
      const title = this.LogicController.getProject(project_id).name;
      taskTitle.setAttribute("projectID", project_id);
      taskTitle.innerHTML = title;
      this.clearTasks();
      const items = this.LogicController.getTasks(project_id);
      let itemsLen = items.length;
      for (let i = 0; i < itemsLen; i++) {
        const todoItem = document.createElement("div");
        todoItem.setAttribute("class", "todo-item");
        todoItem.setAttribute("id", items[i].id);

        const todoItemLeft = document.createElement("div");
        todoItemLeft.setAttribute("class", "todo-item-left");

        const checkboxImg = document.createElement("img");
        if (items[i].isDone) {
          checkboxImg.setAttribute("src", checkboxFull);
          checkboxImg.setAttribute("class", "checkbox-filled");
        } else {
          checkboxImg.setAttribute("src", checkboxEmpty);
          checkboxImg.setAttribute("class", "checkbox-empty");
        }
        todoItemLeft.appendChild(checkboxImg);

        const todoItemText = document.createElement("span");
        todoItemText.setAttribute("class", "todo-item-text");
        todoItemText.innerHTML = items[i].title;
        todoItemLeft.appendChild(todoItemText);

        todoItem.appendChild(todoItemLeft);

        const todoItemRight = document.createElement("div");
        todoItemRight.setAttribute("class", "todo-item-right");

        const prioritySpan = document.createElement("span");
        prioritySpan.setAttribute("class", "priority");
        prioritySpan.setAttribute("priority", items[i].priority);
        prioritySpan.innerHTML = ["Low", "Medium", "High"][
          items[i].priority - 1
        ];

        todoItemRight.appendChild(prioritySpan);

        const dueDateSpan = document.createElement("span");
        dueDateSpan.setAttribute("class", "due-date");
        dueDateSpan.innerHTML = "Due: " + format(items[i].dueDate, "MMM d");
        todoItemRight.appendChild(dueDateSpan);
        todoItem.appendChild(todoItemRight);
        tasksList.appendChild(todoItem);
      }
    }
  }

  initialRender() {
    this.renderProjects();
    this.renderProject();
  }

  control() {
    this.addProject(); //this stays
    this.LogicController.addProject("Example Project"); //Will delete this later
    this.LogicController.addTasktoProjectLong(
      "Test",
      "Stuff to do",
      new Date("2025", "11", "26"),
      3,
      this.LogicController.getAllProjects()[0].id,
    );
    this.initialRender();
  }
}
