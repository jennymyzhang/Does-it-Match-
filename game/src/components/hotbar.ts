import { Square2 } from "../components/square";
import { context } from "../context/contextProvider";
import { Cat } from "../components/cat";
import { Polygon } from "../components/polygon";
import { Bullseye } from "../components/bullseye";
export const bar = [
    new Cat(0, 0, 0.7, "#CEA242", "middle", 1, 0),
    new Cat(0, 0, 0.7, "red", "left", 1, 0),
    new Cat(0, 0, 0.7, "#2a9df4", "right", 1, 0),
    new Bullseye(0, 0, 1, 1, "black", 1, 0),
    new Bullseye(0, 0, 1, 2, "white", 1, 0),
    new Bullseye(0, 0, 1, 3, "black", 1, 0),
    new Polygon(0, 0, 1, 6, "#CEA242", 1, 0),
    new Polygon(0, 0, 1, 8, "red", 1, 0),
    new Polygon(0, 0, 1, 10, "#2a9df4", 1, 0),
]

export function hotBar(gc: CanvasRenderingContext2D): void {
    gc.save();
    const {m, mode, mx, my , clickedx, clickedy} = context;
    const squareWidth = 80;
    const gap = 10;
    const screenWidth = gc.canvas.width;
    const screenHeight = gc.canvas.height;

    const squareCount = Math.floor((screenWidth - 100)/ (squareWidth + gap));
    const squareCol = Math.ceil(m / squareCount);

    const totalWidth = Math.min(squareCount, m) * (squareWidth + gap) - gap;
    const startX = ((screenWidth - totalWidth) / 2);
    let currentX = startX + squareWidth / 2;
    let currentY = screenHeight - (squareCol * (squareWidth + gap)) + squareWidth / 2;
    
    for (let i = 0; i < m; i++) {
        if (currentX + squareWidth > screenWidth) {
            const totalWidth = Math.min(squareCount, m - i) * (squareWidth + gap) - gap;
            const startX = (screenWidth - totalWidth) / 2 + squareWidth / 2;
            currentX = startX;
            currentY += squareWidth + gap;
        }

        const square = new Square2(currentX, currentY, squareWidth, 0, { fill: "white", stroke: "black", lineWidth: 3 });

        console.log("contextclick",context.clicked);
        if (mode == "play") {
            if(square.hitTest(mx, my)) {
                square.changeHover();
            }
            if(context.clicked){
                if(square.hitTest(clickedx, clickedy)) {
                    context.patternPicked = i;
                    context.clicked = false;
                }
            }
        }

        square.draw(gc);
        bar[i].x = currentX;
        bar[i].y = currentY;
        const angle = bar[i].rotate;
        bar[i].rotate = 0;
        if(mode == "win") {
            const jiggleOffset = Math.sin(Date.now() / 100 + i) * 5;
            bar[i].y += jiggleOffset;
        }

        bar[i].transparency = 1;
        bar[i].draw(gc);
        bar[i].rotate = angle;

    
        currentX += squareWidth + gap;
    }
    gc.restore();
}

