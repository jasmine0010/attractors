class Attractor {
    constructor({name, dimension = 2, base, pos, numPoints = 50000, numIters = 1, scaleFactor, bgOpactiy = 130, uiConfig}) {
        this.name = name;
        this.dimension = dimension;

        this.base = { ...base };
        this.params = { ...base };

        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z ?? 0;

        this.numPoints = numPoints;
        this.numIters = numIters;
        this.scaleFactor = scaleFactor;
        this.bgOpactiy = bgOpactiy;
        this.incrementing = true;

        this.attractorLayer = createGraphics(
            windowWidth,
            windowHeight,
            WEBGL
        );

        this.uiLayer = createGraphics(windowWidth, windowHeight, P2D);
        
        this.ui = new UIDesign(
            this.uiLayer,
            uiConfig.titleConfig,
            uiConfig.imgConfig,
            uiConfig.buttonsConfig
        );

        this.attractorLayer.stroke(255);
        this.attractorLayer.strokeWeight(0.02);

        this.cam = {
            rotX: 0,
            rotY: 0,
            panX: 0,
            panY: 0,
            zoom: 1
        };

        this.dragging = false;
        this.lastMouse = { x: 0, y: 0 };
    }

    draw() {
        if (this.dimension === 2) {
            this.attractorLayer.noStroke();
            this.attractorLayer.fill(0, this.bgOpactiy);
            this.attractorLayer.rect(-width / 2, -height / 2, width, height);
        } else {
            this.attractorLayer.background(0);
        }

        if (this.numIters === 1) {
            if (this.dimension === 3) this.drawAttractor3D();
            else this.drawAttractor2D();
        } else {
            for (let i = 0; i < this.numIters; i++) {
                this.x = random(-1, 1);
                this.y = random(-1, 1);
                this.z = random(-1, 1);
                if (this.dimension === 3) this.drawAttractor3D();
                else this.drawAttractor2D();
            }
        }

        image(this.attractorLayer, -width / 2, -height / 2);
        
        this.uiLayer.clear();
        this.ui.drawUI(this.params);
        image(this.uiLayer, -width / 2, -height / 2);

        if (this.incrementing) this.increment();
    }

    drawAttractor2D() {
        this.attractorLayer.push();
        
        this.attractorLayer.translate(this.cam.panX, this.cam.panY);
        this.attractorLayer.scale(this.cam.zoom);

        this.attractorLayer.beginShape(POINTS);
        for (let i = 0; i < this.numPoints; i++) {
            this.step();
            const sx = this.x * this.scaleFactor * this.cam.zoom;
            const sy = this.y * this.scaleFactor * this.cam.zoom;
            this.attractorLayer.vertex(sx, sy);
        }
        this.attractorLayer.endShape();
        this.attractorLayer.pop();
    }

    drawAttractor3D() {
        if (this.incrementing && !this.dragging) {
            this.cam.rotX += 0.002;
            this.cam.rotY += 0.002;
        }
        
        this.attractorLayer.push();

        this.attractorLayer.translate(this.cam.panX, this.cam.panY);
        this.attractorLayer.scale(this.cam.zoom);
        this.attractorLayer.rotateX(this.cam.rotX);
        this.attractorLayer.rotateY(this.cam.rotY);

        this.attractorLayer.beginShape(POINTS);
        for (let i = 0; i < this.numPoints; i++) {
            this.step();
            const sx = this.x * this.scaleFactor;
            const sy = this.y * this.scaleFactor;
            const sz = this.z * this.scaleFactor;
            this.attractorLayer.vertex(sx, sy, sz);
        }
        this.attractorLayer.endShape();
        this.attractorLayer.pop();
    }

    step() {}
    increment() {}
    randomize() {}

    toggleIncrement() {
        this.incrementing = !this.incrementing;
    }

    reset() {
        this.params = { ...this.base };
        this.x = 0.01;
        this.y = 0;
        this.z = 0;

        this.cam = {
            rotX: 0,
            rotY: 0,
            panX: 0,
            panY: 0,
            zoom: 1
        };
        
        this.lastMouse = { x: 0, y: 0 };
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