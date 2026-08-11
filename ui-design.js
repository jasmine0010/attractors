class UIDesign {
    constructor(uiLayer, title, img, attractor) {
        this.uiLayer = uiLayer;
        this.title = title;
        this.img = img;
        this.attractor = attractor;

        this.fontSizeH = windowHeight * 0.065;
        this.fontSizeP1 = windowHeight * 0.035;
        this.fontSizeP2 = windowHeight * 0.025;

        this.uiLayer.textFont(font);

        this.modeButton = {
            sun: loadImage('data/sun.svg'),
            moon: loadImage('data/moon.svg'),
            x: windowWidth * 0.96,
            y: windowHeight * 0.08,
            w: windowHeight * 0.09,
            h: windowHeight * 0.09
        };

        this.viewModeButton = {
            attr: loadImage('data/attractor-1.svg'),
            attrLight: loadImage('data/attractor-light-1.svg'),
            traj: loadImage('data/trajectory.svg'),
            trajLight: loadImage('data/trajectory-light.svg'),
            x: windowWidth * 0.91,
            y: windowHeight * 0.081,
            w: windowHeight * 0.045,
            h: windowHeight * 0.045
        };

        this.instructions = {
            lines: [
                'Pan/Rotate  –  Drag',
                'Zoom  –  Scroll',
                'Switch  –  Space'
            ],
            x: windowWidth * 0.97,
            y: windowHeight * 0.82
        };

        this.buttons = this.getButtons();
    }

    getButtons() {
        const a = this.attractor;
        return [
            {
                label: () => 'Randomize',
                action: () => a.randomize(),
                x: windowHeight * 0.06,
                y: windowHeight * 0.08
            },
            {
                label: () => 'Reset',
                action: () => a.reset(),
                x: windowHeight * 0.31,
                y: windowHeight * 0.08
            },
            {
                label: () => a.running ? 'Pause' : 'Run',
                action: () => a.toggleRunning(),
                x: windowHeight * 0.49,
                y: windowHeight * 0.08
            }
        ];
    }

    drawUI(params) {
        this.uiLayer.drawingContext.shadowBlur = 30;
        this.uiLayer.drawingContext.shadowColor = color(lightMode ? 255 : 0);
        
        this.drawHeader();
        this.drawButtons();
        this.drawParams(params);
        //this.drawSliders(params);
        this.drawModeButton();
        this.drawInstructions();
        
        this.uiLayer.drawingContext.shadowBlur = 0;
    }

    drawHeader() {
        this.uiLayer.noTint();
        this.uiLayer.fill(lightMode ? 0 : 255);
        this.uiLayer.noStroke();
        this.uiLayer.textAlign(LEFT, BASELINE);
        this.uiLayer.imageMode(CORNER);
        this.uiLayer.image(
            lightMode ? this.img.imgLight : this.img.img,
            this.img.x,
            this.img.y,
            this.img.w,
            this.img.h
        );
        
        this.uiLayer.textSize(this.fontSizeH);
        this.uiLayer.text(this.title.title, this.title.x, this.title.y);
    }

    drawButtons() {
        this.uiLayer.noStroke();
        this.uiLayer.textAlign(LEFT, BASELINE);
        this.uiLayer.textSize(this.fontSizeP1);

        for (let b of this.buttons) {
            if (this.buttonHover(mouseX, mouseY, b)) {
                this.uiLayer.fill(lightMode ? 20 : 200);
            } else {
                this.uiLayer.fill(lightMode ? 0 : 255);
            }
            this.uiLayer.text(b.label(), b.x, b.y);
        }
    }

    drawParams(params) {
        this.uiLayer.noStroke();
        this.uiLayer.fill(lightMode ? 0 : 255);
        this.uiLayer.textAlign(LEFT, BASELINE);
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

        let px = this.title.x;
        let py = this.buttons[0].y + this.fontSizeP1 * 2;

        for (let p in params) {
            this.uiLayer.text(map[p] + " = " + round(params[p], 2), px, py);
            py += this.fontSizeP1 * 1.5;
        }
    }

    drawInstructions() {
        this.uiLayer.fill(lightMode ? 0 : 255);
        this.uiLayer.noStroke();
        this.uiLayer.textAlign(LEFT, BASELINE);
        this.uiLayer.textSize(this.fontSizeP1);

        let w = 0;
        for (let i of this.instructions.lines) {
            w = max(w, textWidth(i));
        }

        let py = this.instructions.y;
        for (let line of this.instructions.lines) {
            this.uiLayer.text(
                line,
                this.instructions.x - this.uiLayer.textWidth(line),
                py
            );
            py += this.fontSizeP1 * 1.8;
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
        if (this.modeButtonHover(mouseX, mouseY)) {
            this.uiLayer.tint(lightMode ? 255 : 200);
        } else {
            this.uiLayer.noTint();
        }
        
        this.uiLayer.imageMode(CENTER);
        this.uiLayer.image(
            lightMode ? this.modeButton.moon : this.modeButton.sun,
            this.modeButton.x,
            this.modeButton.y,
            this.modeButton.w,
            this.modeButton.h
        );

        if (this.viewModeButtonHover(mouseX, mouseY)) {
            this.uiLayer.tint(lightMode ? 255 : 200);
        } else {
            this.uiLayer.noTint();
        }

        let img = this.viewModeButton.attrLight;
        if (lightMode) img = this.attractor.renderMode === 'attractor' ? this.viewModeButton.trajLight : this.viewModeButton.attrLight;
        else img = this.attractor.renderMode === 'attractor' ? this.viewModeButton.traj : this.viewModeButton.attr;
        
        this.uiLayer.imageMode(CENTER);
        this.uiLayer.image(
            img,
            this.viewModeButton.x,
            this.viewModeButton.y,
            this.viewModeButton.w,
            this.viewModeButton.h
        );
    }

    buttonHover(mx, my, b) {
        this.uiLayer.textFont(font);
        this.uiLayer.textSize(this.fontSizeP1);
        this.uiLayer.textAlign(LEFT, BASELINE);
        
        const tw = this.uiLayer.textWidth(b.label());
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

    viewModeButtonHover(mx, my) {
        return (
            mx > this.viewModeButton.x - this.viewModeButton.w / 2 &&
            mx < this.viewModeButton.x + this.viewModeButton.w / 2 &&
            my > this.viewModeButton.y - this.viewModeButton.h / 2 &&
            my < this.viewModeButton.y + this.viewModeButton.h / 2
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

        if (this.viewModeButtonHover(mx, my)) {
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

        if (this.viewModeButtonHover(mx, my)) {
            this.attractor.toggleRenderMode();
        }
    }
}