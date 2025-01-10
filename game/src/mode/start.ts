import { CenterText } from "../components/text";
import { Square2 } from "../components/square";
import { context } from "../context/contextProvider";
import { hotBar, bar} from "../components/hotbar";

export const squares: Square2[] = [];

export function start(gc: CanvasRenderingContext2D): void {
    gc.save();
    context.canvasHeight = gc.canvas.height;
    context.canvasWidth = gc.canvas.width;
    const {n, m, mode, revealed, mx, my, patternPicked, guessed, clickedx, clickedy, cheating, guessPattern, guessedPattern} = context;
    //text
    let t1: string = "Press SPACE to Play";
    let t2: string = `Pattern Length = ${n}, Number of Symbols = ${m}`;
    if(mode == "prep") {
        t1 = "Memorize the Pattern: ";
        t2 = "Press SPACE to Start!"
    } else if(mode == "start") {
        t1 = "Press SPACE to Play";
        t2 = `Pattern Length = ${n}, Number of Symbols = ${m}`;
    } else if(mode == "play") {
        t1 = "What Was the Pattern?";
        t2 = "Press SPACE to Submit Your Guess!"
    } else if(mode == "win") {
        t1 = "Congratulations, you won!";
        t2 = "Press SPACE to Play Again!";
    } else if (mode == "lose") {
        t1 = "You were Wrong!";
        t2 = "Press SPACE to Play Again!";
    }

    const gap = 10;
    const squareWidth = 80;
    const screenWidth = gc.canvas.width;
    const screenHeight = gc.canvas.height;
    const squareCount = Math.floor((screenWidth - 100) / (squareWidth + gap));
    const totalWidth = Math.min(squareCount, n) * (squareWidth + gap) - gap;
    const startX = (screenWidth - totalWidth) / 2 + squareWidth / 2;
    let currentX: number = startX;
    let currentY: number = (screenHeight - (squareWidth + gap) * Math.ceil(n / squareCount)) / 2 + squareWidth / 2;
    currentY = Math.max(currentY, 100);

    const text1 = new CenterText(screenWidth / 2, Math.max(24, currentY / 2 - + squareWidth / 2), 1, t1, "center", "middle");
    const text2 = new CenterText(screenWidth / 2, text1.y + 24, 1, t2, "center", "middle");


    text1.draw(gc);
    text2.draw(gc);

    hotBar(gc);

    for (let i = 0; i < n; i++) {
        if (currentX + squareWidth > screenWidth) {
            const totalWidth = Math.min(squareCount, n - i) * (squareWidth + gap) - gap;
            const startX = (screenWidth - totalWidth) / 2 + squareWidth / 2;
            currentX = startX;
            currentY += squareWidth + gap;
        }

        const square = new Square2(currentX, currentY, squareWidth, 0, { fill: "darkred", stroke: "black", lineWidth: 2 });

        if(squares[i] == undefined) {
            squares[i] = square;
        } else {
            squares[i].x = currentX;
            squares[i].y = currentY;
        }

        if(square.hitTest(mx, my) && mode == "play") {
            squares[i].changeHover();
            square.changeHover();
        } else {
            squares[i].styleOptions.lineWidth = 2;
            squares[i].styleOptions.stroke = "black";
        }

        if(mode == "win") {
            squares[i].styleOptions.fill = "lightgreen";
        } else {
            squares[i].styleOptions.fill = "darkred";
        }
        squares[i].draw(gc);

        if((mode == "prep" && revealed[i]) || (mode == "play" && cheating && revealed[i]) || mode == "win") {
            guessPattern[i].x = currentX;
            guessPattern[i].y = currentY;
            guessPattern[i].draw(gc); 
        } 

        if(mode == "play" && cheating) {
            square.transparency = 0.5;
            square.styleOptions.fill = "white";
            square.draw(gc);
        }

        if(mode == "lose") {
            if(guessed[i] != -1) {
                guessedPattern[i].draw(gc);
            }
        }

        if(mode == "play") {
            if(guessed[i] != -1) {
                context.guessedPattern[i].x = currentX;
                context.guessedPattern[i].y = currentY;
                context.guessedPattern[i].draw(gc);
            }
        }

        if((mode == "play" && (context.clicked && square.hitTest(clickedx, clickedy)) || context.stampClicked)) {
            if(context.stampClicked && !square.hitTest(context.stampClickedx, context.stampClickedy)) true;
            else {
                if(context.clicked && guessed[i] != -1) {
                    context.guessed[i] = -1;
                }
                if(patternPicked !== undefined) {
                    context.guessed[i] = patternPicked;
                    context.guessedPattern[i] = bar[patternPicked].copy();
                    if(context.clicked) {
                        context.patternPicked = undefined;
                    }
                }
                if(context.stampClicked) context.stampClicked = false;
                if(context.clicked) context.clicked = false;
            }

        }


        currentX += squareWidth + gap;
    }
       
    if(context.clicked) {
        context.patternPicked = undefined;
        context.clicked = false;
    }

    const text3 = new CenterText(screenWidth - 10, screenHeight - 10, 1, "CHEAT MODE", "right", "bottom");
    if(cheating) text3.draw(gc);

    if(context.patternPicked !== undefined) {
        const cursorPattern = bar[context.patternPicked];
        cursorPattern.x = mx;
        cursorPattern.y = my;
        cursorPattern.draw(gc);
    }


    gc.restore();
}

