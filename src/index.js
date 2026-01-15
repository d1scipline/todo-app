import "./styles.css";
import { format, formatDistance } from "date-fns";
import { todoItem, Project } from "./todoBackend";

const project = new Project("hebelelle");
const todoItem1 = new todoItem(
  "Get 3D Printer",
  "Buy a 3d printer",
  new Date("2025", "11", "25"),
  2
);
project.addItem(todoItem1);
project.printList();
