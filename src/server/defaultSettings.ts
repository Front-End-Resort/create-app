import type {
  EntireSettings,
  ControllerConstructor,
  ServerController,
} from "./index";

export const isClient: boolean = typeof window !== "undefined";
export const isServer: boolean = !isClient;

const defaultAppSettings: EntireSettings = {
  container: "#container",
  basename: "",
  context: {
    isServer,
    isClient,
    prevLocation: null,
    location: {},
  },
  type: "createHashHistory",
  loader: (value: unknown) => value as ControllerConstructor,
  routes: [],
  viewEngine: {
    render,
  },
};

export default defaultAppSettings;

interface ToString {
  toString(): string;
  [propName: string]: unknown;
  [propName: number]: unknown;
}
function render(element: string | ToString): unknown;
function render(
  element: string | ToString,
  controller: ServerController
): unknown;
function render(element: string | ToString, container: Element | null): unknown;
function render(
  element: string | ToString,
  controller: ServerController,
  container: Element | null
): unknown;
function render(
  element: string | ToString,
  controller?: ServerController | Element | null,
  container?: Element | null
): unknown {
  if (typeof element === "string") {
    return element;
  } else {
    return (element as ToString).toString();
  }
}
