/**
 * default view engine for client
 */
import { ViewEngine } from '../share/type'
import { ClientController } from './type'

function render(
	element: string
): any
function render(
	element: string,
	container: Element | null
): any
function render(
	element: string,
	container?: Element | null
): any {
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