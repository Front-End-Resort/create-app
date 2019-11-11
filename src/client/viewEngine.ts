/**
 * default view engine for client
 */
import { ViewEngine } from '../share/type'
import { ClientController } from './type'

function render(
	element: string
): unknown
function render(
	element: string,
	controller: ClientController
): unknown
function render(
	element: string,
	container: Element | null
): unknown
function render(
	element: string,
	controller: ClientController,
	container: Element | null
): unknown
function render(
	element: string,
	_?: ClientController | Element | null,
	container?: Element | null
): unknown {
	if (container) {
		container.innerHTML = element as string
	} else {
		throw new Error(`container is inexistent`)
	}
	return container
}

const viewEngine: ViewEngine<string, ClientController> = {
	render
}

export default viewEngine