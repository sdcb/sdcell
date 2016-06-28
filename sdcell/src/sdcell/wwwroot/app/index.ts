class game extends gameBase {
    world = float3x2.identity();
    local = float3x2.identity();
    client = new cellClient();
    px = 0;
    py = 0;

    constructor() {
        super(<HTMLCanvasElement>document.querySelector('canvas'));
        addEventListener('mousemove', (ev) => {
            this.px = ev.x - this.size.w / 2;
            this.py = ev.y - this.size.h / 2;
        });
    }

    render() {
        this.ctxx.clear();

        // render circle
        this.ctx.save();
        this.ctxx.transform(float3x2.scale(3, 3, this.size.w / 2, this.size.h / 2));
        this.ctxx.transform(this.world.multiply(this.local).translation(-this.client.me.px, -this.client.me.py));
        this.ctx.translate(this.size.w / 2, this.size.h / 2);
        
        // render grid.
        this.ctx.lineWidth = 0.5;
        this.drawGrid(1500, 1500, 50);

        this.ctxx.fillCircle(
            this.client.me.px,
            this.client.me.py,
            this.client.me.r,
            'blue');

        for (var i of this.client.cells) {
            if (i.id !== this.client.me.id) {
                this.ctxx.fillCircle(
                    i.px,
                    i.py,
                    i.r,
                    'red');
            }
        }

        this.ctx.restore();

        this.client.moveTo(this.px, this.py);

        this.drawFps();
    }

    onmousewheel(ev: MouseWheelEvent) {
        //var scale = Math.pow(1.5, ev.wheelDeltaY / 120);
        //this.world.animate(this.world.scale(scale, scale, ev.x, ev.y), { duration: 150 });
    }

    onkeyup(ev: KeyboardEvent) {
        if (ev.which == 27) {
            this.world.animate(float3x2.identity());
        }
    }

    drawGrid(w: number, h: number, size: number) {
        this.ctx.beginPath();
        for (var x = -w / 2; x <= w / 2; x += size) {
            this.ctxx.line(x, -h / 2, x, h / 2);
        }
        for (var y = -h / 2; y <= h / 2; y += size) {
            this.ctxx.line(-w / 2, y, w / 2, y);
        }
        this.ctx.stroke();
    }
}

var g = new game();