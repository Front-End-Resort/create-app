import type {
  ServerController,
  ServerControllerConstructor,
  HistoryLocation,
  Context,
} from "./index";

export default function createController(
  c: ServerControllerConstructor,
  location: HistoryLocation,
  context: Context
): ServerController {
  return new c(location, context);
}
