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
    const taskItemRemoval = document.getElementsByClassName("task-item")[0];
    if (taskItemRemoval) {
      taskItemRemoval.remove();
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
        let val = this.LogicController.addProject(title); // LogicController
        this.renderProjects();
        this.renderProject(val);
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
        todoItemText.setAttribute("taskid", items[i].id);
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
        dueDateSpan.innerHTML = "Due: " + format(items[i].dueDate, "MMM d y");
        todoItemRight.appendChild(dueDateSpan);
        todoItem.appendChild(todoItemRight);
        tasksList.appendChild(todoItem);
        tasksList.appendChild(document.createElement("hr"));
      }
    }
    if (project_id != null) {
      this.renderProjects();
      const itemToHighlight = document.getElementById(project_id);
      itemToHighlight.setAttribute("class", "project-title highlighted");
    }
  }

  deleteProject(project_id) {
    this.LogicController.removeProject(project_id); // LogicController
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
    this.LogicController.toggleItem(taskID); // LogicController
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
        // LogicController
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

  clearTask() {
    const taskItemRemoval = document.getElementsByClassName("task-item")[0];
    if (taskItemRemoval) {
      taskItemRemoval.remove();
    }
  }

  changeTaskNameBinder() {
    const modal = document.getElementById("nameDialog");
    const cancel = document.getElementById("cancelChangeName");
    const form = document.getElementById("changeNameForm");

    cancel.addEventListener("click", () => {
      modal.close("");
      form.reset();
    });

    form.addEventListener("submit", (e) => {
      const pid = document
        .getElementById("tasks-title")
        .getAttribute("projectid");

      const id = document
        .getElementsByClassName("task-item")[0]
        .getAttribute("task-id");

      const data = new FormData(e.target);
      this.LogicController.updateTaskName(data.get("changeName"), id);
      form.reset();
      this.renderProject(pid);
    });
  }

  saveTask(e) {
    //Logic Controller
    const project_id = document
      .getElementById("tasks-title")
      .getAttribute("projectid");
    const dueDate = document.getElementsByName("itemDueDate")[0].value;
    const [year, month, day] = dueDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const priority = document.getElementById("selectPriority").value;
    const description = document.getElementsByName("itemDescription")[0].value;
    const task_id = document
      .getElementsByClassName("task-item")[0]
      .getAttribute("task-id");
    const title =
      document.getElementsByClassName("task-item-title")[0].innerHTML;
    this.LogicController.updateTask(
      task_id,
      title,
      description,
      date,
      priority,
    );
    this.renderProject(project_id);
  }

  deleteTask(e) {
    const project = document.getElementById("tasks-title");
    const pid = project.getAttribute("projectid");
    const item = document.getElementsByClassName("task-item")[0];
    const id = item.getAttribute("task-id");
    this.LogicController.removeTask(id); //Logic controller
    this.clearTask();
    this.renderProject(pid);
  }

  viewTask() {
    const tasksSection = document.getElementById("tasks-todo");
    const task_section = document.getElementsByClassName("task-section")[0];
    tasksSection.addEventListener("click", (e) => {
      this.clearTask();
      const task = e.target.closest(".todo-item-text");
      if (!task) return;
      const taskID = task.getAttribute("taskid");
      const taskItem = this.LogicController.getTask(taskID);
      const title = taskItem.title;
      const description = taskItem.description;
      const dueDate = format(taskItem.dueDate, "MMM d y");
      const dueDateVal = format(taskItem.dueDate, "yyyy-MM-dd");
      const priority = taskItem.priority;
      const priorityText = ["Low", "Medium", "High"][priority - 1];

      const taskItemDiv = document.createElement("div");
      taskItemDiv.setAttribute("class", "task-item");
      taskItemDiv.setAttribute("task-id", taskID);

      const taskItemTitle = document.createElement("h2");
      taskItemTitle.setAttribute("class", "task-item-title");
      taskItemTitle.innerHTML = title;
      taskItemTitle.addEventListener("click", () => {
        const modal = document.getElementById("nameDialog");
        modal.showModal();
      });
      taskItemDiv.appendChild(taskItemTitle);

      const hr = document.createElement("hr");
      taskItemDiv.appendChild(hr.cloneNode(1));

      const taskItemDetailsDiv = document.createElement("div");
      taskItemDetailsDiv.setAttribute("class", "task-item-details");

      const itemDueDate = document.createElement("span");
      itemDueDate.setAttribute("class", "item-due-date");
      itemDueDate.innerHTML = "Due Date: ";

      const dueDateInput = document.createElement("input");
      dueDateInput.setAttribute("type", "date");
      dueDateInput.setAttribute("value", dueDateVal);
      dueDateInput.setAttribute("name", "itemDueDate");
      itemDueDate.appendChild(dueDateInput);
      taskItemDetailsDiv.appendChild(itemDueDate);

      const itemPriority = document.createElement("span");
      itemPriority.setAttribute("class", "item-priority");
      itemPriority.innerHTML = "Priority: ";
      const itemPrioritySelect = document.createElement("select");
      itemPrioritySelect.setAttribute("name", "priority");
      itemPrioritySelect.setAttribute("id", "selectPriority");
      const lowOption = document.createElement("option");
      lowOption.setAttribute("value", "1");
      lowOption.innerHTML = "Low";
      const mediumOption = document.createElement("option");
      mediumOption.setAttribute("value", "2");
      mediumOption.innerHTML = "Medium";
      const highOption = document.createElement("option");
      highOption.setAttribute("value", "3");
      highOption.innerHTML = "High";
      if (priority == 3) {
        highOption.setAttribute("selected", true);
      } else {
        if (priority == 2) {
          mediumOption.setAttribute("selected", true);
        } else {
          lowOption.setAttribute("selected", true);
        }
      }

      itemPrioritySelect.appendChild(lowOption);
      itemPrioritySelect.appendChild(mediumOption);
      itemPrioritySelect.appendChild(highOption);
      itemPriority.appendChild(itemPrioritySelect);
      taskItemDetailsDiv.appendChild(itemPriority);
      taskItemDetailsDiv.appendChild(hr.cloneNode(1));

      const itemDescription = document.createElement("h3");
      itemDescription.innerHTML = "Description";
      taskItemDetailsDiv.appendChild(itemDescription);

      const descriptionInput = document.createElement("textarea");
      descriptionInput.setAttribute("name", "itemDescription");
      descriptionInput.setAttribute("rows", "10");
      descriptionInput.setAttribute("cols", "20");
      descriptionInput.value = description;
      taskItemDetailsDiv.appendChild(descriptionInput);

      taskItemDiv.appendChild(taskItemDetailsDiv);

      const taskItemButtonsDiv = document.createElement("div");
      taskItemButtonsDiv.setAttribute("class", "task-item-buttons");
      const saveButton = document.createElement("button");
      saveButton.setAttribute("class", "save-button");
      saveButton.innerHTML = "Save";
      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "delete-button");
      deleteButton.innerHTML = "Delete";
      taskItemButtonsDiv.appendChild(saveButton);
      taskItemButtonsDiv.appendChild(deleteButton);
      taskItemDiv.appendChild(taskItemButtonsDiv);
      task_section.appendChild(taskItemDiv);
      saveButton.addEventListener("click", this.saveTask.bind(this));
      deleteButton.addEventListener("click", this.deleteTask.bind(this));
    });
  }

  control() {
    this.LogicController.addProject("Example Project"); //Will delete this later
    this.LogicController.addTasktoProjectLong(
      "Test1",
      "Stuff to do1",
      new Date("2025", "11", "27"),
      3,
      this.LogicController.getAllProjects()[0].id,
    );
    this.LogicController.addTasktoProjectLong(
      "Test2",
      "Stuff to do2",
      new Date("2026", "1", "25"),
      2,
      this.LogicController.getAllProjects()[0].id,
    );
    this.LogicController.addTasktoProjectLong(
      "Test3",
      "Stuff to do3",
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
    this.viewTask();
    this.changeTaskNameBinder();
  }
}
