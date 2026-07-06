class Attractor {
    constructor({name, dimension = 2, base, pos, offset, numSteps = 50000, numIters = 1, scaleFactor, bgOpactiy = 130, uiConfig}) {
        this.name = name;
        this.dimension = dimension;

        this.base = { ...base };
        this.params = { ...base };

        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z ?? 0;

        this.offset = offset;

        this.numSteps = numSteps;
        this.numIters = numIters;
        this.maxTrajPoints = int(this.numSteps * 0.5);
        this.scaleFactor = scaleFactor;
        this.bgOpactiy = bgOpactiy;
        
        this.running = true;

        this.solver = 'rk4';

        this.renderModes = ['attractor', 'trajectory'];
        this.renderModeIdx = 0;
        this.renderMode = this.renderModes[this.renderModeIdx];
        
        this.geometryModes = ['points', 'line'];
        this.geometryModeIdx = 0;
        this.geometryMode = this.geometryModes[this.geometryModeIdx];

        this.points = [];

        this.attractorLayer = createGraphics(
            windowWidth,
            windowHeight,
            WEBGL
        );

        this.uiLayer = createGraphics(windowWidth, windowHeight, P2D);

        this.cam = {
            rotX: 0,
            rotY: 0,
            panX: 0,
            panY: 0,
            zoom: 1
        };

        this.dragging = false;
        this.lastMouse = { x: 0, y: 0 };

        this.ui = new UIDesign(
            this.uiLayer,
            uiConfig.titleConfig,
            uiConfig.imgConfig,
            this
        );
    }

    draw() {
        this.clearAttractorLayer();

        this.attractorLayer.stroke(lightMode ? 0 : 255);
        this.attractorLayer.strokeWeight(0.8);

        for (let i = 0; i < this.numIters; i++) {
            if (i > 0) {
                this.x = random(-1, 1);
                this.y = random(-1, 1);
                this.z = random(-1, 1);
            }
            if (this.dimension === 3) {
                this.drawAttractor3D();
            } else {
                this.drawAttractor2D();
            }
        }

        image(this.attractorLayer, -windowWidth / 2, -windowHeight / 2);
        
        this.uiLayer.clear();
        this.ui.drawUI(this.params);
        image(this.uiLayer, -windowWidth / 2, -windowHeight / 2);

        if (this.running) this.increment();

        this.ui.handleHover(mouseX, mouseY);
    }
    
    clearAttractorLayer() {
        if (this.dimension === 2) {
            this.attractorLayer.noStroke();
            this.attractorLayer.fill(lightMode ? 255 : 0, this.bgOpactiy);
            this.attractorLayer.rect(
                -windowWidth / 2,
                -windowHeight / 2,
                windowWidth,
                windowHeight
            );
        } else {
            this.attractorLayer.background(lightMode ? 255 : 0);
        }
    }

    drawAttractor2D() {
        this.attractorLayer.push();
        
        this.attractorLayer.translate(
            this.cam.panX + this.offset.x,
            this.cam.panY + this.offset.y
        );

        this.attractorLayer.scale(this.cam.zoom);
        
        this.attractorLayer.beginShape(POINTS);
        for (let i = 0; i < this.numSteps; i++) {
            const next = this.step(this.x, this.y);
            this.x = next.x;
            this.y = next.y;
            const sx = this.x * this.scaleFactor * this.cam.zoom;
            const sy = this.y * this.scaleFactor * this.cam.zoom;
            
            this.attractorLayer.vertex(sx, sy);
        }
        this.attractorLayer.endShape();
        
        this.attractorLayer.pop();
    }

    drawAttractor3D() {
        if (this.running && !this.dragging) {
            this.cam.rotX += 0.002;
            this.cam.rotY += 0.002;
        }
        
        this.attractorLayer.push();

        this.attractorLayer.scale(this.cam.zoom);
        this.attractorLayer.rotateX(this.cam.rotX);
        this.attractorLayer.rotateY(this.cam.rotY);

        this.attractorLayer.translate(
            this.cam.panX + this.offset.x,
            this.cam.panY + this.offset.y,
            this.offset.z
        );

        if (this.renderMode === 'trajectory') {
            if (this.running) {
                const next = this.stepSolver(this.x, this.y, this.z);
                this.x = next.x;
                this.y = next.y;
                this.z = next.z;

                this.points.push({
                    x: this.x * this.scaleFactor,
                    y: this.y * this.scaleFactor,
                    z: this.z * this.scaleFactor
                });

                this.attractorLayer.noFill();
                
                if (this.geometryMode === 'points') {
                    this.attractorLayer.beginShape(POINTS);
                } else {
                    this.attractorLayer.beginShape();
                }

                for (let p of this.points) {
                    this.attractorLayer.vertex(p.x, p.y, p.z);
                }
                
                this.attractorLayer.endShape();

                if (this.points.length > this.maxTrajPoints) {
                    this.points.shift();
                }
            }
        } else {
            this.attractorLayer.noFill();
            
            if (this.geometryMode === 'points') {
                this.attractorLayer.beginShape(POINTS);
            } else {
                this.attractorLayer.beginShape();
            }
            
            for (let i = 0; i < this.numSteps; i++) {
                const next = this.stepSolver(this.x, this.y, this.z);
                this.x = next.x;
                this.y = next.y;
                this.z = next.z;

                this.attractorLayer.vertex(
                    this.x * this.scaleFactor,
                    this.y * this.scaleFactor,
                    this.z * this.scaleFactor
                )
            }
            this.attractorLayer.endShape();
        }

        this.attractorLayer.pop();
    }

    stepEuler(x, y, z) {
        const d = this.f(x, y, z);
        
        return {
            x: x + d.dx * this.dt,
            y: y + d.dy * this.dt,
            z: z + d.dz * this.dt
        };
    }

    stepRK4(x, y, z) {
        const k1 = this.f(x, y, z);

        const k2 = this.f(
            x + 0.5 * k1.dx * this.dt,
            y + 0.5 * k1.dy * this.dt,
            z + 0.5 * k1.dz * this.dt
        );

        const k3 = this.f(
            x + 0.5 * k2.dx * this.dt,
            y + 0.5 * k2.dy * this.dt,
            z + 0.5 * k2.dz * this.dt
        );

        const k4 = this.f(
            x + k3.dx * this.dt,
            y + k3.dy * this.dt,
            z + k3.dz * this.dt
        );

        return {
            x: x + (this.dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx),
            y: y + (this.dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy),
            z: z + (this.dt / 6) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz)
        }
    }

    stepSolver(x, y, z) {
        if (this.solver === 'euler') return this.stepEuler(x, y, z);
        else return this.stepRK4(x, y, z);
    }

    f(x, y, z) {}
    step(x, y) {}
    increment() {}
    randomize() {}

    reset() {
        this.params = { ...this.base };
        this.x = 0.01;
        this.y = 0;
        this.z = 0;

        this.points = [];

        this.cam = {
            rotX: 0,
            rotY: 0,
            panX: 0,
            panY: 0,
            zoom: 1
        };
        
        this.lastMouse = { x: 0, y: 0 };
    }

    toggleRunning() {
        this.running = !this.running;
    }

    toggleRenderMode() {
        this.renderModeIdx = (this.renderModeIdx + 1) % this.renderModes.length;
        this.renderMode = this.renderModes[this.renderModeIdx];
    }

    toggleGeometryMode() {
        this.geometryModeIdx = (this.geometryModeIdx + 1) % this.geometryModes.length;
        this.geometryMode = this.geometryModes[this.geometryModeIdx];
    }

    mousePressed() {        
        this.ui.mousePressed(mouseX, mouseY);
    }

    startDrag() {
        this.dragging = true;
        this.lastMouse.x = mouseX;
        this.lastMouse.y = mouseY;
    }

    endDrag() {
        this.dragging = false;
    }

    mouseDragged() {
        const dx = mouseX - this.lastMouse.x;
        const dy = mouseY - this.lastMouse.y;

        if (this.dimension === 3) {
            this.cam.rotY += dx * 0.005;
            this.cam.rotX -= dy * 0.005;
        } else {
            this.cam.panX += dx;
            this.cam.panY += dy;
        }

        this.lastMouse.x = mouseX;
        this.lastMouse.y = mouseY;
    }

    mouseWheel(delta) {
        const zoomFactor = 1 - delta * 0.001;
        this.cam.zoom *= zoomFactor;
        this.cam.zoom = constrain(this.cam.zoom, 0.1, 10);
    }
}