import {
    FundamentalEvent,
    SKEvent,
    SKKeyboardEvent,
    SKMouseEvent,
} from "simplekit/canvas-mode";
import { bar } from "../components/hotbar";
import { squares } from "../mode/start";
import { Drawable } from "../components/drawable";
import { Animator, bow } from "../components/animator";
import { distance } from "simplekit/utility";

export let context: {n: number; m: number; mode: string; guess: number[]; guessPattern: Drawable[]; revealed: boolean[]; guessed: number[]; mx: number; my: number; patternPicked: number | undefined, clicked: boolean, clickedx: number, clickedy: number, cheating: boolean, eject: boolean, canvasHeight: number, canvasWidth: number, stampClickedx: number, stampClickedy: number, stampClicked: boolean, guessedPattern: Drawable[]} = {
    n: 5,
    m: 3,
    mode: "start",
    guess: [],
    revealed: [],
    guessed: [],
    guessPattern: [],
    guessedPattern: [],
    mx: 0,
    my: 0,
    clickedx: 0,
    clickedy: 0,
    stampClickedx: 0,
    stampClickedy: 0,
    patternPicked: undefined,
    clicked: false,
    cheating: false,
    eject: false,
    canvasHeight: 0,
    canvasWidth: 0,
    stampClicked: false,
}

export function dispatch(e: SKEvent) {
    switch (e.type) {
        case "mousemove":
            context.mx = (e as SKMouseEvent).x;
            context.my = (e as SKMouseEvent).y;
            break;
        case "click":
            if(context.mode == "play") {
                context.clicked = true;
                context.clickedx = (e as SKMouseEvent).x;
                context.clickedy = (e as SKMouseEvent).y;
            }
            break;
        case "stampClick":
            context.stampClicked = true;
            context.stampClickedx = (e as SKMouseEvent).x;
            context.stampClickedy = (e as SKMouseEvent).y;
            break;
        case "drag":
            break;
        case "dblclick":
            break;
        case "keydown":
        case "keypress":
            const { key } = e as SKKeyboardEvent;
            if(key == 'x') {
                context.cheating = !context.cheating;
                if(context.mode == "play" && context.cheating) {
                    squares.forEach((square) => {square.styleOptions.fill = "#997570"});
                } else {
                    squares.forEach((square) => {square.styleOptions.fill = "darkred"});
                }
            }
            if(context.mode == "start") {
                if (key == "ArrowUp") context.n++;
                else if (context.n != 1 && key == "ArrowDown") context.n--;
                else if(context.m != 1 && key == "ArrowLeft") context.m--;
                else if(context.m != 9 && key == "ArrowRight") context.m++;
                else if(key == " ") {
                    context.mode = "prep";
                    context.guess = Array.from({ length: context.n }, () => Math.floor(Math.random() * context.m));
                    context.guessPattern = Array.from({ length: context.n }, (_, index) => (bar[context.guess[index]].copy()));
                    context.guessedPattern = Array.from({ length: context.n }, () => ({} as Drawable));
                    context.revealed = new Array(context.n).fill(false);
                    context.revealed[Math.floor(Math.random() * context.n)] = true;
                }
            } else if(context.mode == "prep") {
                if(key == " ") {
                    context.mode = "play";
                    context.guessed = new Array(context.n).fill(-1);
                }
            } else if(context.mode == "play") {
                if(key == "Backspace") {
                    context.guessed = new Array(context.n).fill(-1);
                } else if(key == " ") {
                    context.patternPicked = undefined;
                    context.mode = "win";
                    for(let i = 0; i < context.n; i++) {
                        if(context.revealed[i] && context.guessed[i] != context.guess[i]) {
                            context.mode = "lose";
                        } else if(!context.revealed[i] && context.guessed[i] != -1) {
                            context.mode = "lose";
                        } else if(!context.revealed[i] && context.mode != "lose") {
                            context.mode = "prep";
                        }
                    }
                    while(true && context.mode == "prep") {
                        const random = Math.floor(Math.random() * context.n);
                        if(context.revealed[random] == false) {
                            context.revealed[random] = true;
                            break;
                        }
                    }
                    if(context.mode == "prep") {
                        rotateSquare();
                    } else if(context.mode == "lose") {
                        eject();
                    } else if(context.mode == "win")  {
                        delayed();
                        squares.forEach((square) => {square.styleOptions.fill = "darkred"});
                    }
                }
            } else if(context.mode == "win") {
                if(key == " ") {
                    context.mode = "start";
                }
            } else if (context.mode == "lose") {
                if(key == " ") {
                    context.mode = "start";
                }
            }
            break;
        case "arrowleft":
            if(context.m != 1 && context.mode == "start") context.m--;
            break;
        case "arrowright":
            if(context.m != 9 && context.mode == "start") context.m++;
            break;
    }
}

function delayed() {
    for(let i: number = 0; i < context.n; i++) {
        rotateOne(i, i * 100);
    }    
}

function rotateOne(i: number, wait: number) {
    const start = performance.now();
    const duration = 1000;
    let timer = setInterval(() => {
        const timePassed = performance.now() - start;
        if(timePassed > wait) {
            const angle = (timePassed - wait) / duration * (2* Math.PI);
            context.guessPattern[i].rotate = angle;
            squares[i].rotate = angle;
        }
        if (timePassed > duration + wait) {
            context.guessPattern[i].rotate = 0;
            squares[i].rotate = 0;
            clearInterval(timer);
        }
    }, 1);
}

function eject() {
    for(let i = 0; i < context.n; i++) {
        const random = Math.floor(Math.random() * 600);
        if(context.guessed[i] === -1) continue;
        ejectOne(i, random);
    }
}

function ejectOne(i: number, wait: number) {
    const start = performance.now();
    const duration = 1000;
    const animator = new Animator(context.guessedPattern[i].y, context.canvasHeight + 500, duration, (value) => {context.guessedPattern[i].y = value;}, bow);
    let hasStarted: boolean = false
    let timer = setInterval(() => {
        const timePassed = performance.now() - start;
        if(timePassed > wait) {
            if(hasStarted === false) {
                hasStarted = true;
                animator.start(performance.now());
            }
            animator.update(performance.now());
        }
        if (timePassed > wait + duration) {
            clearInterval(timer);
        }
    }, 0);
}

function rotateSquare() {
    const start = performance.now();
    const duration = 1000;
    let timer = setInterval(() => {
        const timePassed = performance.now() - start;
        if (timePassed > duration) {
            for(let i: number = 0; i < context.n; i++) {
                context.guessPattern[i].rotate = 0;
                squares[i].rotate = 0;
            }
            clearInterval(timer);
        } else{
            const angle = timePassed / duration * (2* Math.PI);
            for (let i = 0; i < context.n; i++) {
                if(context.revealed[i]) {
                    context.guessPattern[i].rotate = angle;
                }
                squares[i].rotate = angle;
            }
        }
    }, 1);
}



export const stampClickTranslator = {
    state: "IDLE",
    // parameters for transitions
    movementThreshold: 50,
    timeThreshold: 1000, // milliseconds
    // for tracking thresholds
    startX: 0,
    startY: 0,
    startTime: 0,

    // returns a stampClick event if found
    update(fe: FundamentalEvent): SKMouseEvent | undefined {
        switch (this.state) {
            case "IDLE":
                if (fe.type == "mousedown") {
                    this.state = "DOWN";
                    this.startX = fe.x || 0;
                    this.startY = fe.y || 0;
                    this.startTime = fe.timeStamp;
                }
                break;
            case "DOWN":
                if(fe.type == "null" && fe.timeStamp - this.startTime > this.timeThreshold) {
                    return new SKMouseEvent(
                        "stampClick",
                        fe.timeStamp,
                        this.startX,
                        this.startY
                    );
                } else if(fe.type == "mousemove" && distance(fe.x || 0, fe.y || 0, this.startX, this.startY) <= this.movementThreshold && fe.timeStamp - this.startTime > this.timeThreshold) {
                    return new SKMouseEvent(
                        "stampClick",
                        fe.timeStamp,
                        this.startX,
                        this.startY
                    );
                } else if(fe.type == "mouseup" || (fe.type == "mousemove" && distance(fe.x || 0, fe.y || 0, this.startX, this.startY) > this.movementThreshold)) {
                    this.state = "IDLE";
                }
                break;
        }
        return;
    },
};
