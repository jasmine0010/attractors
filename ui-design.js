class UIDesign {
    constructor(uiLayer, title, img, buttons) {
        this.title = title;
        this.buttons = buttons;
        this.img = img;

        this.fontSizeH = windowHeight * 0.065;
        this.fontSizeP1 = windowHeight * 0.035;
        this.fontSizeP2 = windowHeight * 0.025;

        this.uiLayer = uiLayer;
        this.uiLayer.textFont(font);

        this.modeButton = {
            sun: loadImage('data/sun.svg'),
            moon: loadImage('data/moon.svg'),
            x: windowWidth * 0.96,
            y: windowHeight * 0.07,
            w: windowHeight * 0.08,
            h: windowHeight * 0.08
        };

        this.instructions = {
            lines: [
                'Drag (2D): Pan',
                'Drag (3D): Rotate',
                'Scroll: Zoom +/-',
            ],
            x: windowWidth * 0.8,
            y: windowHeight * 0.08
        }
    }

    drawUI(params) {
        this.uiLayer.drawingContext.shadowBlur = 30;
        this.uiLayer.drawingContext.shadowColor = color(lightMode ? 255 : 0);

        this.uiLayer.fill(lightMode ? 0 : 255);
        
        this.drawHeader();
        this.drawButtons();
        this.drawParams(params);
        this.drawSliders(params);
        this.drawModeButton();
        this.drawInstructions();
        
        this.uiLayer.drawingContext.shadowBlur = 0;
    }

    drawHeader() {
        this.uiLayer.noStroke();
        textAlign(LEFT, BASELINE);
        this.uiLayer.imageMode(CORNER);
        this.uiLayer.image(lightMode ? this.img.imgLight : this.img.img, this.img.x, this.img.y, this.img.w, this.img.h);
        
        this.uiLayer.textSize(this.fontSizeH);
        this.uiLayer.text(this.title.title, this.title.x, this.title.y);
    }

    drawButtons() {
        this.uiLayer.noStroke();
        textAlign(LEFT, BASELINE);
        this.uiLayer.textSize(this.fontSizeP1);
        for (let b of this.buttons) {
            this.uiLayer.text(b.label, b.x, b.y);
        }
    }

    drawParams(params) {
        textAlign(LEFT, BASELINE);
        this.uiLayer.noStroke();
        this.uiLayer.textSize(this.fontSizeP1);

        const map = {
            alpha: 'α',
            beta: 'β',
            gamma: 'γ',
            delta: 'δ',
            epsilon: 'ε',
            sigma: 'σ',
            rho: 'ρ'
        };

        let py = this.buttons[0].y + this.fontSizeP1 * 2;
        let px = this.title.x;
        for (let p in params) {
            this.uiLayer.text(map[p] + " = " + round(params[p], 2), px, py);
            py += this.fontSizeP1 * 1.5;
        }
    }

    drawSliders(params) {
        this.uiLayer.strokeWeight(2);
        this.uiLayer.stroke(255);
        let py = this.buttons[0].y + this.fontSizeP1 * 2;
        let px = this.title.x;
        for (let p in params) {
            this.uiLayer.line(px + height * 0.15, py - this.fontSizeP1 * 0.2, px + height * 0.35, py - this.fontSizeP1 * 0.2);
            this.uiLayer.fill(255);
            this.uiLayer.ellipse(px + height * 0.15, py - this.fontSizeP1 * 0.2, height * 0.01, height * 0.01);
            py += this.fontSizeP1 * 1.5;
        }
    }

    drawModeButton() {
        this.uiLayer.imageMode(CENTER);
        this.uiLayer.textSize(this.fontSizeP1);
        this.uiLayer.image(lightMode ? this.modeButton.moon : this.modeButton.sun, this.modeButton.x, this.modeButton.y, this.modeButton.w, this.modeButton.h);
    }

    drawInstructions() {
        this.uiLayer.noStroke();
        textAlign(LEFT, BASELINE);
        this.uiLayer.textSize(this.fontSizeP2);

        let py = this.instructions.y;
        for (let i of this.instructions.lines) {
            this.uiLayer.text(i, this.instructions.x, py);
            py += this.fontSizeP1 * 1.5;
        }
    }

    buttonHover(mx, my, b) {
        this.uiLayer.textFont(font);
        this.uiLayer.textSize(this.fontSizeP1);
        this.uiLayer.textAlign(LEFT, BASELINE);
        
        let tw = this.uiLayer.textWidth(b.label);
        return (
            mx > b.x &&
            mx < b.x + tw &&
            my > b.y - this.fontSizeP1 &&
            my < b.y
        );
    }

    modeButtonHover(mx, my) {
        return (
            mx > this.modeButton.x - this.modeButton.w / 2 &&
            mx < this.modeButton.x + this.modeButton.w / 2 &&
            my > this.modeButton.y - this.modeButton.h / 2 &&
            my < this.modeButton.y + this.modeButton.h / 2
        );
    }

    handleHover(mx, my) {
        let hovering = false;

        for (let b of this.buttons) {
            if (this.buttonHover(mx, my, b)) {
                hovering = true;
                break;
            }
        }

        if (this.modeButtonHover(mx, my)) {
            hovering = true;
        }

        cursor(hovering ? HAND : ARROW);
    }

    mousePressed(mx, my) {
        for (let b of this.buttons) {
            if (this.buttonHover(mx, my, b)) {
                b.action();
                return;
            }
        }

        if (this.modeButtonHover(mx, my)) {
            lightMode = !lightMode;
        }
    }
}