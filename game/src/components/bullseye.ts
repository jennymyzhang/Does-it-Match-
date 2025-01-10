import { Drawable } from "./drawable";

export class Bullseye extends Drawable {
    constructor(public x: number, public y: number, public scale = 3.0, public type: number, public strokeColor: string, public transparency: number, public rotate: number) {
        super(x, y, rotate, transparency);
    }
    
    copy(): Bullseye {
        return new Bullseye(this.x, this.y, this.scale, this.type, this.strokeColor, this.transparency, this.rotate);
    }

    private colors: { [key: number]: string[] } = 
    {
        1: ['red', '#2a9df4', 'red'], 
        2: ['black', 'black', 'black', 'black'], 
        3: ['yellow', '#2a9df4', 'yellow', '#2a9df4', 'yellow']
    };

    private radius: { [key: number]: number[] } = {
        1:  [30, 20, 10],
        2:  [30, 22, 14, 6], 
        3: [30, 24, 18, 12, 6]
    };
    
    draw(gc: CanvasRenderingContext2D): void{
        gc.save(); //call save to save the current state of the drawing callee save registers

        gc.translate(this.x, this.y); // moves whole drawing to this x and y location
        gc.scale(this.scale, this.scale); // % scale factor to shrink / grow the cat
        gc.globalAlpha = this.transparency;
        gc.rotate(this.rotate);
        
        for (let i = 0; i < this.colors[this.type].length; i++) {
            gc.beginPath();
            gc.arc(0, 0, this.radius[this.type][i], 0, Math.PI * 2, false);
            gc.fillStyle = this.colors[this.type][i];
            gc.fill();
            gc.strokeStyle = this.strokeColor;
            gc.lineWidth = 2;
            gc.stroke();
        }

        gc.restore(); //pay attention to restore!
    }
}