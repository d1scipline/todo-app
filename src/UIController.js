import { LogicController } from "./LogicController";
import folderSvg from "./assets/folder.svg";
export class UIController {
  constructor(LogicController) {
    this.LogicController = LogicController;
  }

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
      const newImg = document.createElement("img");
      newImg.setAttribute("class", "folder-icon");
      newImg.setAttribute("src", folderSvg);
      newElement.appendChild(newImg);
      const newContent = document.createTextNode(projects[i].name);
      newElement.appendChild(newContent);
      parentDiv.appendChild(newElement);
      console.log(projects[i]);
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
  }

  control() {
    this.addProject();
    this.LogicController.addProject("Example Project"); //Will delete this later
    this.renderProjects();
  }
}
