/**
 * default view engine for server
 */
import { ViewEngine } from '../share/type'
import { ServerController } from './type'

interface ToString {
  toString(): string
  [propName: string ]: any
  [propName: number ]: any
}
function render(
	element: string | ToString
): any
function render(
	element: string | ToString,
	controller: ServerController
): any
function render(
	element: string | ToString,
	container: Element | null
): any
function render(
	element: string | ToString,
	controller: ServerController,
	container: Element | null
): any
function render(
	element: string | ToString,
	controller?: ServerController | Element | null,
	container?: Element | null
): any {
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