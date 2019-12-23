import { EntireSettings, ControllerConstructor } from '../share/type'

export const isClient: boolean = typeof window !== 'undefined'
export const isServer: boolean = !isClient

const defaultAppSettings: EntireSettings = {
	container: '#container',
	basename: '',
	context: {
		isServer,
		isClient,
		prevLocation: null,
		location: {}
	},
	type: 'createHashHistory',
	loader: (value: unknown) => value as ControllerConstructor,
	routes: [],
	viewEngine: {
		render
	}
}

export default defaultAppSettings

/**
 * default view engine for client
 */
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