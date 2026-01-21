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
          checkboxImg.setAttribute("class", "checkbox-filled checkbox");
        } else {
          checkboxImg.setAttribute("src", checkboxEmpty);
          checkboxImg.setAttribute("class", "checkbox-empty checkbox");
        }
        checkboxImg.setAttribute("taskid", items[i].id);
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
        tasksList.appendChild(document.createElement("hr"));
      }
    }
  }

  deleteProject(project_id) {
    this.LogicController.removeProject(project_id);
    this.initialRender();
  }

  deleteProjectBinder() {
    const button = document.getElementById("delete-project-button");
    button.addEventListener("click", (e) => {
      const id = document.getElementById("tasks-title");
      if (id.hasAttribute("projectid")) {
        this.deleteProject(id.getAttribute("projectid"));
        id.setAttribute("projectid", null);
      }
    });
  }

  initialRender() {
    this.renderProjects();
    this.renderProject();
  }

  toggleTask(taskID) {
    this.LogicController.toggleItem(taskID);
    const projID = document
      .getElementById("tasks-title")
      .getAttribute("projectid");
    this.renderProject(projID);
  }

  toggleTaskBinder() {
    const tasksDOM = document.getElementById("tasks-todo");
    tasksDOM.addEventListener("click", (e) => {
      const itemDiv = e.target.closest(".checkbox");
      if (!itemDiv) return;
      const itemID = itemDiv.getAttribute("taskid");
      this.toggleTask(itemID);
    });
  }

  addTask() {
    const TaskDialog = document.getElementById("taskDialog");
    const addTaskButton = document.getElementsByClassName("add-task-button")[0];
    const cancelButton = document.getElementsByClassName(
      "cancelAddTaskButton",
    )[0];
    const addTaskForm = document.getElementById("addTaskForm");

    addTaskButton.addEventListener("click", () => {
      const projectID = document
        .getElementById("tasks-title")
        .getAttribute("projectid");
      if (projectID == null || projectID == "null") {
        return;
      } else {
        TaskDialog.showModal();
      }
    });

    cancelButton.addEventListener("click", () => {
      TaskDialog.close("");
      addTaskForm.reset();
    });

    addTaskForm.addEventListener("submit", (e) => {
      const formData = new FormData(e.target);
      const title = formData.get("taskTitle");
      const description = formData.get("taskDescription");
      const dateUnf = formData.get("taskDueDate");
      const [year, month, day] = dateUnf.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const priority = formData.get("taskPriority");
      const projectID = document
        .getElementById("tasks-title")
        .getAttribute("projectid");

      if (title != "") {
        this.LogicController.addTasktoProjectLong(
          title,
          description,
          date,
          priority,
          projectID,
        );
      }
      e.target.reset();
      this.renderProject(projectID);
    });
  }

  control() {
    this.LogicController.addProject("Example Project"); //Will delete this later
    this.LogicController.addTasktoProjectLong(
      "Test",
      "Stuff to do",
      new Date("2025", "11", "26"),
      3,
      this.LogicController.getAllProjects()[0].id,
    );
    this.LogicController.addTasktoProjectLong(
      "Test",
      "Stuff to do",
      new Date("2025", "11", "26"),
      2,
      this.LogicController.getAllProjects()[0].id,
    );
    this.LogicController.addTasktoProjectLong(
      "Test",
      "Stuff to do",
      new Date("2025", "11", "26"),
      1,
      this.LogicController.getAllProjects()[0].id,
    );
    this.LogicController.toggleItem(
      this.LogicController.getTasks(
        this.LogicController.getAllProjects()[0].id,
      )[0].id,
    );

    this.addProject();
    this.deleteProjectBinder();
    this.toggleTaskBinder();
    this.initialRender();
    this.addTask();
  }
}
