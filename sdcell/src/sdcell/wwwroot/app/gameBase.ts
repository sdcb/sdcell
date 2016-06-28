class fpsContext {
    fps = NaN;
    frames = 0;
    lastSecond = 0;

    update(diffTime: number) {
        this.lastSecond += diffTime;
        this.frames += 1;
        if (this.lastSecond >= 1) {
            this.fps = this.frames / this.lastSecond;
            this.frames = 0;
            this.lastSecond = 0;
        }
    }
}

class canvasExtensions {
    ctx: CanvasRenderingContext2D;
    size: { w: number, h: number };

    constructor(ctx: CanvasRenderingContext2D, size: { w: number, h: number }) {
        this.ctx = ctx;
        this.size = size;
    }

    fillRect(x: number, y: number, w: number, h: number, brush: any) {
        this.ctx.fillStyle = brush;
        this.ctx.fillRect(x, y, w, h);
    }

    strokeRect(x: number, y: number, w: number, h: number, brush: any, lineWidth?: number) {
        if (lineWidth) this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = brush;
        this.ctx.strokeRect(x, y, w, h);
    }

    fillText(text: string, x: number, y: number, brush: any, maxWidth?: number): void {
        this.ctx.fillStyle = brush;
        maxWidth && this.ctx.fillText(text, x, y, maxWidth);
        maxWidth || this.ctx.fillText(text, x, y);
    }

    strokeText(text: string, x: number, y: number, brush: any, maxWidth?: number): void {
        this.ctx.strokeStyle = brush;
        maxWidth && this.ctx.strokeText(text, x, y, maxWidth);
        maxWidth || this.ctx.strokeText(text, x, y);
    }

    line(p1x: number, p1y: number, p2x: number, p2y: number) {
        this.ctx.moveTo(p1x, p1y);
        this.ctx.lineTo(p2x, p2y);
    }

    drawLine(p1x: number, p1y: number, p2x: number, p2y: number, brush?: any, lineWidth?: number) {
        if (lineWidth) this.ctx.lineWidth = lineWidth;
        if (brush) this.ctx.strokeStyle = brush;
        this.ctx.beginPath();
        this.ctx.moveTo(p1x, p1y);
        this.ctx.lineTo(p2x, p2y);
        this.ctx.stroke();
    }

    fillCircle(x: number, y: number, r: number, brush?: any) {
        if (brush) this.ctx.fillStyle = brush;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    circle(x: number, y: number, r: number) {
        this.ctx.moveTo(x, 0);
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
    }

    rotate(angle: number, centerX?: number, centerY?: number) {
        this.ctx.rotate(angle);
        centerX && this.ctx.translate(-centerX, -centerY);
    }

    setIdentity() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    clear() {
        this.setIdentity();
        this.ctx.clearRect(0, 0, this.size.w, this.size.h);
    }

    transform(matrix: float3x2) {
        this.ctx.transform.apply(this.ctx, matrix.get());
    }
}

class gameBase {
    ctx: CanvasRenderingContext2D;
    ctxx: canvasExtensions;
    fps = new fpsContext();
    time = 0;
    size = { w: 0, h: 0 };
    private beginTime = new Date();

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
        this.ctxx = new canvasExtensions(this.ctx, this.size);
        this.initContext();
        requestAnimationFrame(() => this.gameLoop());

        addEventListener('resize', (...args) => {
            this.initContext();
        });

        addEventListener('mousewheel', ev => {
            this.onmousewheel(ev);
        });

        addEventListener('keyup', ev => {
            this.onkeyup(ev);
        });
    }

    onmousewheel(ev: MouseWheelEvent) {
    }

    onkeyup(ev: KeyboardEvent) {
    }

    render() {
    }

    drawFps() {
        this.ctx.save();
        this.ctxx.setIdentity();
        this.ctx.textAlign = 'right';
        this.ctxx.fillText('FPS: ' + this.fps.fps.toFixed(0), this.size.w, 0, 'black');
        this.ctx.restore();
    }

    private initContext() {
        this.ctx.canvas.width = innerWidth;
        this.ctx.canvas.height = innerHeight;

        this.ctx.textBaseline = 'top';
        this.ctx.font = "14pt Consolas";

        var rect = this.ctx.canvas.getBoundingClientRect();
        this.size.w = rect.width;
        this.size.h = rect.height;
    }

    private innerUpdate() {
        var now = new Date();
        var diff = (now.getTime() - this.beginTime.getTime()) / 1000;
        if (diff > 1) {
            console.warn('running slow: ' + diff);
            diff = 1 / 60;
        }
        this.beginTime = now;
        this.time += diff;

        this.fps.update(diff);
    }

    private innerRender() {
        this.render();
    }

    private gameLoop() {
        this.innerUpdate();
        this.innerRender();
        requestAnimationFrame(() => this.gameLoop());
    }

    // utils:
    clockAngle(x: number, circle: number) {
        return x / circle * Math.PI * 2;
    }
}