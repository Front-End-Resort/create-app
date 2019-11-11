/**
 * default view engine for server
 */
import { ViewEngine } from '../share/type'
import { ServerController } from './type'

interface ToString {
  toString(): string
  [propName: string ]: unknown
  [propName: number ]: unknown
}
function render(
	element: string | ToString
): unknown
function render(
	element: string | ToString,
	controller: ServerController
): unknown
function render(
	element: string | ToString,
	container: Element | null
): unknown
function render(
	element: string | ToString,
	controller: ServerController,
	container: Element | null
): unknown
function render(
	element: string | ToString,
	controller?: ServerController | Element | null,
	container?: Element | null
): unknown {
	if (typeof element === 'string') {
    return element
  } else {
    return (element as ToString).toString()    
  }
}

const viewEngine: ViewEngine<string | ToString, ServerController> = {
  render
}
export default viewEngine