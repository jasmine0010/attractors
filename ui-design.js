class UIDesign {
    constructor(uiLayer, title, img, buttons) {
        this.title = title;
        this.buttons = buttons;
        this.img = img;

        this.fontSizeH = height * 0.065; // width * 0.03
        this.fontSizeP = height * 0.035; // width * 0.015

        this.uiLayer = uiLayer;
        this.uiLayer.textFont(font);
    }

    drawUI(params) {
        this.uiLayer.drawingContext.shadowBlur = 100;
        this.uiLayer.drawingContext.shadowColor = color(0);
        
        this.drawHeader();
        this.drawButtons();
        this.drawParams(params);
        
        this.uiLayer.drawingContext.shadowBlur = 0;
    }

    drawHeader() {
        this.uiLayer.fill(255);
        this.uiLayer.textSize(this.fontSizeH);
        this.uiLayer.text(this.title.title, this.title.x, this.title.y);
        this.uiLayer.image(this.img.img, this.img.x, this.img.y, this.img.w, this.img.h);
    }

    drawButtons() {
        this.uiLayer.fill(255);
        this.uiLayer.textSize(this.fontSizeP);
        for (let b of this.buttons) {
            this.uiLayer.text(b.label, b.x, b.y);
        }
    }

    drawParams(params) {
        this.uiLayer.fill(255);
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

        let py = height * 0.18;
        for (let p in params) {
            this.uiLayer.text(map[p] + " = " + round(params[p], 2), this.title.x, py);
            py += this.fontSizeP * 1.5;
        }
    }

    mousePressed(mx, my) {
        for (let b of this.buttons) {
            let tw = this.uiLayer.textWidth(b.label);
            if (mx > b.x && mx < b.x + tw &&
                my > b.y - this.fontSizeP && my < b.y) {
                b.action();
            }
        }
    }
}