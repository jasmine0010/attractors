class GumowskiMira extends Attractor {
    constructor(alpha, beta, img, imgLight) {
        /* latex
        \begin{aligned}
        x_{n+1} &= \beta y_n + f(x_n) \\
        y_{n+1} &= f(x_{n+1}) - x_{n} \\
        f(x) &= \alpha x + \frac{2(1 - \alpha)x^2}{1 + x^2}
        \end{aligned}
        */

        const base = { alpha, beta };

        const uiConfig = {
            titleConfig: {
                title: 'Gumowski-Mira Attractor',
                x: windowHeight * 0.06,
                y: windowHeight * 0.69
            },
            imgConfig: {
                img: img,
                imgLight: imgLight,
                x: windowHeight * 0.03,
                y: windowHeight * 0.69,
                w: windowHeight * 0.56,
                h: windowHeight * 0.3
            },
            buttonsConfig: [
                {
                    label: 'Randomize',
                    action: () => this.randomize(),
                    x: windowHeight * 0.06, y: windowHeight * 0.08
                },
                {
                    label: 'Reset',
                    action: () => this.reset(),
                    x: windowHeight * 0.31, y: windowHeight * 0.08
                },
                {
                    label: 'Increment',
                    action: () => this.toggleIncrement(),
                    x: windowHeight * 0.49, y: windowHeight * 0.08
                }
            ]
        };

        super({
            name: 'Gumowski-Mira',
            dimension: 2,
            base,
            pos: { x: 0.01, y: 0 },
            zOffset: 0,
            numPoints: 1000,
            numIters: 110,
            scaleFactor: windowHeight * 0.05,
            bgOpactiy: 50,
            uiConfig
        });
    }

    f(x) {
        return this.params.alpha * x + 2 * (1 - this.params.alpha) * x * x / (1.0 + x * x);
    }

    step() {
        const xn = this.params.beta * this.y + this.f(this.x);
        const yn = this.f(xn) - this.x;

        this.x = xn;
        this.y = yn;
    }

    increment() {
        for (let p in this.params) {
            this.params[p] += 0.0002;
        }
    }

    randomize() {
        this.params = {
            alpha: random(-1, -0.5),
            beta: random(0.5, 1)
        }

        this.x = 0.01;
        this.y = 0;
        this.z = 0;
    }
}