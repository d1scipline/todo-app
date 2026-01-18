import "./styles.css";
import { format, formatDistance } from "date-fns";
import { LogicController } from "./LogicController";

const projects_list = [];

const controller = new LogicController(projects_list);
controller.addProject("projecta");
console.log(controller.getProject(controller.projects_list[0].id));
