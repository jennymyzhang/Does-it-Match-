import { Drawable } from "./drawable";

export class Cat extends Drawable {
  constructor(public x: number, public y: number, public scale = 3.0, public color: string, public eyeballDirection: string, public transparency: number, public rotate: number) {
      super(x, y, rotate, transparency);
  }
  copy(): Cat {
    return new Cat(this.x, this.y, this.scale, this.color, this.eyeballDirection, this.transparency, this.rotate);
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save(); //call save to save the current state of the drawing callee save registers

    gc.translate(this.x, this.y + 2.8); // moves whole drawing to this x and y location
    gc.scale(this.scale, this.scale); // % scale factor to shrink / grow the cat
    gc.rotate(this.rotate);

    gc.fillStyle = this.color;

    
    gc.strokeStyle = "black";
    gc.lineWidth = 8;

    // head white outline
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    
    gc.stroke();

    // ears
    gc.beginPath();
    // left
    gc.moveTo(-40, -48);
    gc.lineTo(-8, -36);
    gc.lineTo(-35, -14);
    gc.closePath();
    // right
    gc.moveTo(40, -48);
    gc.lineTo(8, -36);
    gc.lineTo(35, -14);
    gc.closePath();
    
    gc.stroke();
    gc.fill();
    // head
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.fill();

    // whites of eyes
    gc.strokeStyle = "black";
    gc.fillStyle = "white";
    gc.lineWidth = 1;
    gc.beginPath();
    // left
    gc.ellipse(-16, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();
    // right
    gc.beginPath();
    gc.ellipse(16, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();

    // eyeballs
    gc.fillStyle = "black";
    gc.beginPath();
    // left
    if(this.eyeballDirection === "middle") { //symmetrical eyes bc centered at 0,0
        gc.arc(-16, -9, 5, 0, Math.PI * 2);
    } else if(this.eyeballDirection === "left") {
        gc.arc(-20, -9, 5, 0, Math.PI * 2);
    } else if(this.eyeballDirection === "right") {
        gc.arc(-12, -9, 5, 0, Math.PI * 2);
    }
    gc.fill();

    // right
    gc.beginPath();
    if(this.eyeballDirection === "middle") {
        gc.arc(16, -9, 5, 0, Math.PI * 2);
    } else if(this.eyeballDirection === "left") {
        gc.arc(12, -9, 5, 0, Math.PI * 2);
    } else if(this.eyeballDirection === "right") {
        gc.arc(20, -9, 5, 0, Math.PI * 2);
    
    }
    gc.fill();

    gc.restore();
  }
}
