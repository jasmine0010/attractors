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
                y: height * 0.82
            },
            imgConfig: {
                img: img,
                x: height * 0.03,
                y: height * 0.82,
                w: height * 0.55,
                h: height * 0.16
            },
            buttonsConfig: [
                {
                    label: 'Randomize',
                    action: () => this.randomize(),
                    x: height * 0.06, y: height * 0.08
                },
                {
                    label: 'Reset',
                    action: () => this.reset(),
                    x: height * 0.31, y: height * 0.08
                },
                {
                    label: 'Increment',
                    action: () => this.toggleIncrement(),
                    x: height * 0.49, y: height * 0.08
                }
            ]
        };

        super({
            name: 'Clifford',
            dimension: 2,
            base,
            pos: { x: 0.01, y: 0 },
            numPoints: 60000,
            numIters: 1,
            scaleFactor: 200,
            bgOpactiy: 60,
            uiConfig
        });
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
            alpha: random(-3, 3),
            beta: random(-3, 3),
            gamma: random(-3, 3),
            delta: random(-3, 3)
        }

        this.x = 0.01;
        this.y = 0;
        this.z = 0;
    }

    /*
            alpha: -1.22,
            beta: 1.47,
            gamma: 1.59,
            delta: 0.36

            alpha: -1.82,
            beta: -0.65,
            gamma: 1.86,
            delta: -1.36

            alpha: -1.04,
            beta: 1.31,
            gamma: 1.9,
            delta: 1.25

            alpha: -1.35,
            beta: 2,
            gamma: -0.34,
            delta: 2

            alpha: -1.72,
            beta: -1.82,
            gamma: -1.78,
            delta: 1.88
            
            alpha: -1.1,
            beta: 1.85,
            gamma: 1.77,
            delta: 0.78

            alpha: -1.65,
            beta: -1.55,
            gamma: -1.71,
            delta: -0.95

            alpha: -1.84,
            beta: -1.65,
            gamma: 1.57,
            delta: -1

            alpha: -1.52,
            beta: -1.31,
            gamma: 0.69,
            delta: -1.9

            alpha: 1.13,
            beta: 1.48,
            gamma: -1.63,
            delta: 1.44
    */
}