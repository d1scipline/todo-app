import { LogicController } from "./LogicController";

export class UIController {
  constructor(LogicController) {
    this.LogicController = LogicController;
  }

  openProjectDialog(dialog) {
    dialog.showModal();
  }

  control() {
    const addProjectButton =
      document.getElementsByClassName("add-project-button")[0];

    const addProjectDialog = document.getElementById("projectDialog");

    addProjectButton.addEventListener("click", () => {
      this.openProjectDialog(addProjectDialog);
    });
  }
}
