class EnsembleSpread {
    constructor(attractor, n = 30, epsilon = 1e-6) {
        this.attractor = attractor;
        this.n = n;
        this.epsilon = epsilon;
        this.reset();
    }

    reset() {
        const a = this.attractor;
        this.ref = { x: a.x, y: a.y, z: a.z ?? 0 };
        this.ensemble = [];
        for (let i = 0; i < this.n; i++) {
            const u = p5.Vector.random3D();
            this.ensemble.push({
                x: this.ref.x + u.x * this.epsilon,
                y: this.ref.y + u.y * this.epsilon,
                z: this.ref.z + u.z * this.epsilon,
                points: []
            });
        }
        this.spread = [];
        this.t = 0;
    }

    step() {
        const a = this.attractor;
        
        this.ref = a.dimension === 3 ? a.stepSolver(this.ref.x, this.ref.y, this.ref.z) : { ...a.step(this.ref.x, this.ref.y), z: 0 };
        
        this.ensemble = this.ensemble.map(p => {
            const next = a.dimension === 3
                ? a.stepSolver(p.x, p.y, p.z)
                : { ...a.step(p.x, p.y), z: 0 };
            
            const updated = {
                x: next.x,
                y: next.y,
                z: next.z ?? 0,
                points: p.points ?? []
            };

            updated.points.push({
                x: updated.x,
                y: updated.y,
                z: updated.z
            });

            if (updated.points.length > a.maxTrajPoints / 5) {
                updated.points.shift();
            }

            return updated;
        });

        let sum = 0;
        for (const p of this.ensemble) {
            const dx = p.x - this.ref.x;
            const dy = p.y - this.ref.y;
            const dz = p.z - this.ref.z;
            sum += dx * dx + dy * dy + dz * dz;
        }
        const rms = Math.sqrt(sum / this.n);
        this.t += a.dimension === 3 ? a.dt : 1;

        this.spread.push({ t: this.t, spread: rms });

        if (this.spread.length > 3000) this.spread.shift();
    }
    
    draw(layer, x, y, w, h) {
        layer.push();
        layer.stroke(lightMode ? 0 : 255);
        layer.noFill();
        layer.strokeWeight(1);
        layer.rect(x, y, w, h);

        if (this.spread.length < 2) {
            layer.pop();
            return;
        }

        const domain = this.spread[this.spread.length - 1].t - this.spread[0].t;
        const logSpread = this.spread.map(p => Math.log10(Math.max(p.spread, 1e-12)));
        const logMin = Math.min(...logSpread);
        const logMax = Math.max(...logSpread);
        const range = Math.max(logMax - logMin, 1e-9);

        layer.beginShape();
        for (let i = 0; i < this.spread.length; i++) {
            const px = x + (this.spread[i].t - this.spread[0].t) / domain * w;
            const py = y + (logMax - logSpread[i]) / range * h;
            layer.vertex(px, py);
        }
        layer.endShape();

        layer.textSize(h * 0.07);
        layer.textAlign(RIGHT, CENTER);
        for (let i = Math.ceil(logMin); i <= Math.floor(logMax); i++) {
            const py = y + (logMax - i) / range * h;
            layer.text(`1e${i}`, x - 4, py);
            layer.line(x, py, x + 4, py);
        }

        const latest = this.spread[this.spread.length - 1];
        layer.textAlign(LEFT, TOP);
        layer.text(`t = ${latest.t.toFixed(2)}`, x, y + h + 4);
        layer.textAlign(RIGHT, TOP);
        layer.text(`RMS = ${latest.spread.toExponential(2)}`, x + w, y + h + 4);
        layer.pop();
    }
}