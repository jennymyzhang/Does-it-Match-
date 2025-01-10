import { startSimpleKit, setSKDrawCallback, setSKEventListener, addSKEventTranslator } from "simplekit/canvas-mode";
import { start } from "./mode/start";
import { dispatch, stampClickTranslator } from "./context/contextProvider";

startSimpleKit();

addSKEventTranslator(stampClickTranslator);

setSKDrawCallback((gc) => {
  gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
  setSKEventListener(dispatch);
  displayListDemo(gc);
})

function displayListDemo(gc: CanvasRenderingContext2D) {
  start(gc);
}

