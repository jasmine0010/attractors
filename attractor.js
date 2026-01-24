class Attractor {
    constructor(name, dimension = 2, base, pos, numPoints = 50000, scaleFactor, uiConfig) {
        this.name = name;
        this.dimension = dimension;

        this.base = { ...base };
        this.params = { ...base };

        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z ?? 0;

        this.numPoints = numPoints;
        this.scaleFactor = scaleFactor;
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
        this.attractorLayer.strokeWeight(0.6);
    }

    draw() {
        if (this.dimension === 3) this.drawAttractor3D();
        else this.drawAttractor2D();

        image(this.attractorLayer, -width / 2, -height / 2);
        
        this.uiLayer.clear();
        this.ui.drawUI(this.params);
        image(this.uiLayer, -width / 2, -height / 2);

        if (this.incrementing) this.increment();
    }

    drawAttractor2D() {
        this.attractorLayer.noStroke();
        this.attractorLayer.fill(0, 130);
        this.attractorLayer.rect(-width / 2, -height / 2, width, height);
        
        this.attractorLayer.push();
        this.attractorLayer.scale(this.scaleFactor);

        this.attractorLayer.beginShape(POINTS);
        for (let i = 0; i < this.numPoints; i++) {
            this.step();
            this.attractorLayer.vertex(this.x, this.y);
        }
        this.attractorLayer.endShape();
        this.attractorLayer.pop();
    }

    drawAttractor3D() {
        this.attractorLayer.background(0);
        
        this.attractorLayer.push();
        this.attractorLayer.scale(this.scaleFactor);

        this.attractorLayer.beginShape(POINTS);
        for (let i = 0; i < this.numPoints; i++) {
            this.step();
            this.attractorLayer.vertex(this.x, this.y, this.z);
        }
        this.attractorLayer.endShape();
        this.attractorLayer.pop();

        if (this.incrementing) {
            this.attractorLayer.rotateX(0.002);
            this.attractorLayer.rotateY(0.002);
        }
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
    }

    mousePressed() {        
        this.ui.mousePressed(mouseX, mouseY);
    }
}