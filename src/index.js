import "./styles.css";
import { format, formatDistance } from "date-fns";
import { LogicController } from "./LogicController";
import { UIController } from "./UIController";

const projects_list = [];

const controller = new LogicController(projects_list);
const DOMController = new UIController(controller);
DOMController.control();
