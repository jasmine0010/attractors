class Clifford extends Attractor {
    constructor(alpha, beta, gamma, delta, img) {
        /* latex
        \begin{aligned}
        x_{n+1} &= \sin(\alpha y_n) + \gamma \cos(\alpha x_n) \\
        y_{n+1} &= \sin(\beta x_n) + \delta \cos(\beta y_n)
        \end{aligned}
        */

        const base = { alpha, beta, gamma, delta };

        const uiConfig = {
            titleConfig: {
                title: 'Clifford Attractor',
                x: height * 0.06,
                y: height * 0.78
            },
            imgConfig: {
                img: img,
                x: height * 0.03,
                y: height * 0.78,
                w: height * 0.55,
                h: height * 0.16
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

        super(
            'Clifford',
            2,
            base,
            { x: 0.01, y: 0 },
            60000,
            150,
            uiConfig
        );
    }

    step() {
        const { alpha, beta, gamma, delta } = this.params;
        const xn = Math.sin(alpha * this.y) + gamma * Math.cos(alpha * this.x);
        const yn = Math.sin(beta * this.x) + delta * Math.cos(beta * this.y);
        this.x = xn;
        this.y = yn;
    }

    increment() {
        for (let p in this.params) {
            this.params[p] += 0.001;
        }
    }

    randomize() {
        this.params = {
            alpha: random(-2, 2),
            beta: random(-2, 2),
            gamma: random(-2, 2),
            delta: random(-2, 2)
        }
    }
}