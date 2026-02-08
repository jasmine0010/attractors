class UIDesign {
    constructor(uiLayer, title, img, buttons) {
        this.title = title;
        this.buttons = buttons;
        this.img = img;

        this.fontSizeH = windowHeight * 0.065; // width * 0.03
        this.fontSizeP = windowHeight * 0.035; // width * 0.015

        this.uiLayer = uiLayer;
        this.uiLayer.textFont(font);

        this.modeButton = {
            sun: loadImage('data/sun.svg'),
            moon: loadImage('data/moon.svg'),
            x: windowWidth * 0.96,
            y: windowHeight * 0.07,
            w: windowHeight * 0.05,
            h: windowHeight * 0.05
        };
    }

    drawUI(params) {
        this.uiLayer.drawingContext.shadowBlur = 30;
        this.uiLayer.drawingContext.shadowColor = color(lightMode ? 255 : 0);

        this.uiLayer.fill(lightMode ? 0 : 255);
        
        this.drawHeader();
        this.drawButtons();
        this.drawParams(params);
        this.drawModeButton();
        
        this.uiLayer.drawingContext.shadowBlur = 0;
    }

    drawHeader() {
        this.uiLayer.imageMode(CORNER);
        this.uiLayer.image(lightMode ? this.img.imgLight : this.img.img, this.img.x, this.img.y, this.img.w, this.img.h);
        
        this.uiLayer.textSize(this.fontSizeH);
        this.uiLayer.text(this.title.title, this.title.x, this.title.y);
    }

    drawButtons() {
        this.uiLayer.textSize(this.fontSizeP);
        for (let b of this.buttons) {
            this.uiLayer.text(b.label, b.x, b.y);
        }
    }

    drawParams(params) {
        this.uiLayer.textSize(this.fontSizeP);

        const map = {
            alpha: 'α',
            beta: 'β',
            gamma: 'γ',
            delta: 'δ',
            epsilon: 'ε',
            sigma: 'σ',
            rho: 'ρ'
        };

        let py = this.buttons[0].y + this.fontSizeP * 2;
        for (let p in params) {
            this.uiLayer.text(map[p] + " = " + round(params[p], 2), this.title.x, py);
            py += this.fontSizeP * 1.5;
        }
    }

    drawModeButton() {
        this.uiLayer.imageMode(CENTER);
        this.uiLayer.textSize(this.fontSizeP);
        this.uiLayer.image(lightMode ? this.modeButton.moon : this.modeButton.sun, this.modeButton.x, this.modeButton.y, this.modeButton.w, this.modeButton.h);
    }

    buttonHover(mx, my, b) {
        let tw = this.uiLayer.textWidth(b.label);
        return (
            mx > b.x &&
            mx < b.x + tw &&
            my > b.y - this.fontSizeP &&
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