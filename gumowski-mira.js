class GumowskiMira extends Attractor {
    constructor(alpha, beta, img) {
        /* latex
        \begin{aligned}
        x_{n+1} &= \beta y_n + f(x_n) \\
        y_{n+1} &= f(x_{n+1}) - x_{n} \\
        f(x) &= \alpha x + \frac{2(1 - \alpha)x^2}{1 + x^2}
        \end{aligned}
        */

        const base = { alpha, beta };

        console.log(img.width, img.height);

        const uiConfig = {
            titleConfig: {
                title: 'Gumowski-Mira Attractor',
                x: height * 0.06,
                y: height * 0.69
            },
            imgConfig: {
                img: img,
                x: height * 0.03,
                y: height * 0.69,
                w: height * 0.56,
                h: height * 0.3
            },
            buttonsConfig: [
                {
                    label: 'Randomize',
                    action: () => this.randomize(),
                    x: height * 0.06, y: height * 0.1
                },
                {
                    label: 'Reset',
                    action: () => this.reset(),
                    x: height * 0.31, y: height * 0.1
                },
                {
                    label: 'Increment',
                    action: () => this.toggleIncrement(),
                    x: height * 0.49, y: height * 0.1
                }
            ]
        };

        super({
            name: 'Gumowski-Mira',
            dimension: 2,
            base,
            pos: { x: 0.01, y: 0 },
            numPoints: 1000,
            numIters: 110,
            scaleFactor: 70,
            bgOpactiy: 20,
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
            alpha: random(-1, 1),
            beta: random(-1, 1)
        }
    }
}