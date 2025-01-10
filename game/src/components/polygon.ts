import { Drawable } from './drawable';

export class Polygon extends Drawable {
    constructor(public x: number, public y: number, public scale = 3.0, public sides: number, public color: string, public transparency: number, public rotate: number) {
        super(x, y, rotate, transparency);
    }

    copy(): Polygon {
        return new Polygon(this.x, this.y, this.scale, this.sides, this.color, this.transparency, this.rotate);
    }
    
    draw(gc: CanvasRenderingContext2D): void {
        gc.save(); 

        gc.translate(this.x, this.y); 
        gc.scale(this.scale, this.scale);
        gc.rotate(this.rotate);
        gc.globalAlpha = this.transparency;
        
        gc.beginPath();
        gc.moveTo(0,0);

        const angle = Math.PI * 2 / this.sides;
        gc.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const dx = 0 + 30 * Math.cos(angle * i);
            const dy = 0 + 30 * Math.sin(angle * i);
            if (i === 0) {
                gc.moveTo(dx, dy);
            } else {
                gc.lineTo(dx, dy);
            }
        }
        gc.closePath();
        gc.fillStyle = this.color;
        gc.fill();
        gc.strokeStyle = 'black';
        gc.lineWidth = 2;
        gc.stroke();
        gc.restore();
    }

  

}