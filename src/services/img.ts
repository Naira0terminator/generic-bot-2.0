import { createCanvas, Canvas, CanvasRenderingContext2D, CanvasGradient, CanvasPattern, loadImage } from 'canvas';

interface drawOptions {
    width?: number,
    cap?: 'round' | 'square' | 'butt',
}

interface circleOptions {
    color?: string,
    clip?: boolean,
    anticlockwise?: boolean,
    width?: number
}

export default class Img {
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
    }

    public scaleFont(text: string, font: string | undefined) {
        let fontSize = 70;
        
        do {
            this.ctx.font = `${fontSize -= 10}px ${!font ? 'sans-serif' : font}`;
        } while(this.ctx.measureText(text).width > this.canvas.width - 300);

        return this.ctx.font;
    }

    public setText(text: string, color: string | CanvasPattern | CanvasGradient, x: number, y: number, font?: string) {
        this.ctx.fillStyle = color;
        this.ctx.font = this.scaleFont(text, font);

        this.ctx.fillText(text, x, y);
    }

    public async load(path: string, x: number = 0, y: number = 0, width: number = this.canvas.width, height: number = this.canvas.height) {
        const img = await loadImage(path);
        this.ctx.drawImage(img, x, y, width, height);
    }

    public drawRect(color: string | CanvasPattern | CanvasGradient, x: number, y: number, width: number, height: number, ops?: drawOptions) {
        if(ops?.width)
            this.ctx.lineWidth = ops.width;
        if(ops?.cap)
            this.ctx.lineCap = ops.cap;

        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, width, height);
    }

    public drawCircle(x: number, y: number, radius: number, startAngle: number, endAngle: number, ops: circleOptions) {

        if(ops.color)
            this.ctx.strokeStyle = ops.color;
        if(ops.width)
            this.ctx.lineWidth = ops.width;

        this.ctx.beginPath();
        this.ctx.lineWidth = 15;
        this.ctx.arc(x, y, radius, startAngle, endAngle, ops.anticlockwise);
        this.ctx.closePath();
        ops.clip ? this.ctx.clip() : this.ctx.stroke()
    }

    public buffer() {
        return this.canvas.toBuffer();
    }
}