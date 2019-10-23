import { HistoryLocation, Context } from '../share/type'
import { ClientController, ClientControllerConstructor } from './type'

export default function createController(
  c: ClientControllerConstructor,
  location: HistoryLocation,
  context: Context
): ClientController {
  return new c(location, context)
}
