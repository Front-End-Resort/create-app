import {
  ClientController,
  ClientControllerConstructor,
  HistoryLocation,
  Context
} from "./index"

export default function createController(
  c: ClientControllerConstructor,
  location: HistoryLocation,
  context: Context
): ClientController {
  return new c(location, context)
}
