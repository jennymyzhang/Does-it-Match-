export abstract class Drawable {
  x: number; // Add an initializer or assign a value to 'x'
  y: number;
  rotate: number;
  transparency: number;
  constructor(x: number, y: number, rotate: number, transparency: number) { this.x = x; this.y = y; this.rotate = rotate; this.transparency = transparency;}
  abstract draw (gc: CanvasRenderingContext2D): void;
  hitTest?(mx: number, my: number): void;
}
  