import { Drawable } from "./drawable";

export class CenterText extends Drawable {
  constructor(public x: number, public y: number, public scale = 3.0, public text: string, public textAlign: string, public textBaseline: string) {
    super(x, y, 0, 1);
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    gc.font = "24px sans-serif";
    gc.fillStyle = "black";
    gc.textAlign = this.textAlign as CanvasTextAlign;
    gc.textBaseline = this.textBaseline as CanvasTextBaseline;

    gc.fillText(this.text, this.x, this.y);

    gc.restore();
  }
}
