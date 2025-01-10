import { Drawable } from "./drawable";


export class Square2 extends Drawable {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public rotate: number,
    public styleOptions: {
      // optional parameter with specified style options!
      fill: string;
      stroke: string;
      lineWidth: number;
    },
    public transparency: number = 1,
  ) {
    super(x, y, rotate, transparency);
  }

  changeHover(): void {
      this.styleOptions.lineWidth = 5;
      this.styleOptions.stroke = "yellow";
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    gc.fillStyle = this.styleOptions.fill;
    gc.strokeStyle = this.styleOptions.stroke;
    gc.lineWidth = this.styleOptions.lineWidth;

    gc.translate(this.x, this.y);
    gc.globalAlpha = this.transparency;
    gc.rotate(this.rotate);
    gc.beginPath();

    gc.rect(
      0 - this.size / 2,
      0 - this.size / 2,
      this.size,
      this.size
    );

    if (this.styleOptions !== undefined) {
      if (this.styleOptions.fill) gc.fill();
      if (this.styleOptions.stroke) gc.stroke();
    }
    gc.restore();
  }
  get isFilled() {
    return this.styleOptions?.fill != "";
  }

  get isStroked() {
    return this.styleOptions?.stroke != "" && (this.styleOptions?.lineWidth ?? 0) > 0;
  }

  hitTest(mx: number, my: number) {
    let hit = false;
    if (this.isFilled) {
      hit ||= insideHitTestRectangle(
        mx,
        my,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
    if (this.isStroked) {
      hit ||= edgeHitTestRectangle(
        mx,
        my,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size,
        this.styleOptions?.lineWidth ?? 0
      );
    }
    return hit;
  }

}

function edgeHitTestRectangle(
  mx: number,
  my: number,
  x: number, y: number,
  w: number, h: number,
  strokeWidth: number
) {
  // width of stroke on either side of edges
  const s = strokeWidth / 2;
  // inside rect after adding stroke
  const outer = mx >= x - s && mx <= x + w + s &&
  my >= y - s && my <= y + h + s;
  // but NOT inside inner rect after subtracting stroke
  const inner = mx > x + s && mx < x + w - s &&
  my > y + s && my < y + h - s;
  return outer && !inner;
}

function insideHitTestRectangle(
  mx: number,
  my: number,
  x: number, y: number,
  w: number, h: number
) {
  return (mx >= x &&
  mx <= x + w &&
  my >= y &&
  my <= y + h);
}
