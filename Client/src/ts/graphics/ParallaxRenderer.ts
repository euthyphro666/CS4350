
import Star from './Star';

class ParallaxRenderer {
    private bkgColor = '#151D29';
    private starColor = '#FFFFFF';

    private context: CanvasRenderingContext2D;
    private stars: Star[];
    private scale: number;
    private requestId: number;
    private cx: number;
    private cy: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
        this.scale = 1;
        this.stars = [];
        this.requestId = -1;
        this.cx = Math.cos(Math.PI / 4);
        this.cy = Math.cos(Math.PI / 4);

        this.initStars(1000);
        this.onResized();
        this.registerEvents();
    }

    public start(): void {
        this.requestId = requestAnimationFrame(this.render.bind(this));
    }

    private initStars(count: number): void {
        for (let i = 0; i < count; i++) {
            this.stars[i] = new Star();
        }
    }

    private registerEvents(): void {
        document.addEventListener('mousemove', this.onMouseMoved.bind(this));
        window.addEventListener('resize', this.onResized.bind(this));
    }

    private unRegisterEvents(): void {
        document.removeEventListener('mousemove', this.onMouseMoved.bind(this));
        window.removeEventListener('resize', this.onResized.bind(this));
    }

    private onMouseMoved(event: MouseEvent): void {
        const theta = Math.atan2(
            -((this.context.canvas.clientHeight / 2) + this.context.canvas.clientTop) + event.clientY,
            -((this.context.canvas.clientWidth / 2) + this.context.canvas.clientLeft) + event.clientX
        );
        this.cx = Math.cos(theta);
        this.cy = Math.sin(theta);
    }

    private onResized(): void {
        this.context.canvas.width = this.context.canvas.clientWidth;
        this.context.canvas.height = this.context.canvas.clientHeight;
        this.scale = this.context.canvas.width > this.context.canvas.height ?
            this.context.canvas.width : this.context.canvas.height;
    }

    private render(time: number): void {
        // Clears the canvas
        this.context.fillStyle = this.bkgColor;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        // Draws all stars
        this.context.fillStyle = this.starColor;
        this.context.beginPath();
        for (const star of this.stars) {
            star.render(this.context, this.scale);
            star.offset(this.cx, this.cy);
        }
        this.context.fill();
        requestAnimationFrame(this.render.bind(this));
    }

}

export default ParallaxRenderer;
