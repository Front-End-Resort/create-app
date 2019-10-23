import { HistoryLocation, Context } from '../share/type'
import { ServerController, ServerControllerConstructor } from './type'

export default function createController(
  c: ServerControllerConstructor,
  location: HistoryLocation,
  context: Context
): ServerController {
  return new c(location, context)
}
