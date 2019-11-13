import { EntireSettings, ControllerConstructor } from './type'

export const isClient: boolean = typeof window !== 'undefined'
export const isServer: boolean = !isClient

const defaultAppSettings: EntireSettings = {
	container: '#container',
	basename: '',
	context: {
		isServer,
		isClient
	},
	type: 'createHashHistory',
	loader: (value: unknown) => value as ControllerConstructor
}

export default defaultAppSettings