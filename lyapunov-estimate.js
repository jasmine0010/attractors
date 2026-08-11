class LyapunovEstimate {
    constructor(attractor, epsilon) {
        this.attractor = attractor;
        this.epsilon = epsilon;

        this.reset();
    }

    reset() {
        this.steps = 0;
        this.sum = 0;

        this.x1 = this.attractor.x, this.y1 = this.attractor.y, this.z1 = this.attractor.z ?? 0;
        this.x2 = this.x1 + this.epsilon, this.y2 = this.y1, this.z2 = this.z1;
    }
    
    step() {
        const a = this.attractor;

        const next1 = a.dimension === 3 ? a.stepSolver(this.x1, this.y1, this.z1) : a.step(this.x1, this.y1);
        const next2 = a.dimension === 3 ? a.stepSolver(this.x2, this.y2, this.z2) : a.step(this.x2, this.y2);
        this.x1 = next1.x; this.y1 = next1.y, this.z1 = next1.z ?? 0;
        this.x2 = next2.x; this.y2 = next2.y, this.z2 = next2.z ?? 0;

        const dx = this.x2 - this.x1, dy = this.y2 - this.y1, dz = this.z2 - this.z1;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        this.sum += Math.log(d / this.epsilon);
        this.steps++;

        const scale = this.epsilon / d;
        this.x2 = this.x1 + dx * scale;
        this.y2 = this.y1 + dy * scale;
        this.z2 = this.z1 + dz * scale;
    }

    getCurrent() {
        if (this.steps === 0) return 0;

        return this.sum / (this.steps * (this.attractor.dimension === 3 ? this.attractor.dt : 1));
    }

    draw(g, x, y) {
        g.textAlign(LEFT, TOP);
        const val = this.getCurrent();
        g.text(`λ = ${round(val, 4)}`, x, y);
    }
}