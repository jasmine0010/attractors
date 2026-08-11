class Clifford extends Attractor {
    constructor(alpha, beta, gamma, delta, img, imgLight) {
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
                x: windowHeight * 0.06,
                y: windowHeight * 0.82
            },
            imgConfig: {
                img,
                imgLight,
                x: windowHeight * 0.03,
                y: windowHeight * 0.82,
                w: windowHeight * 0.55,
                h: windowHeight * 0.16
            }
        };

        super({
            name: 'Clifford',
            dimension: 2,
            base,
            pos: { x: 0.01, y: 0 },
            offset: { x: 0, y: 0, z: 0 },
            numSteps: 60000,
            numIters: 1,
            scaleFactor: windowHeight * 0.23,
            bgOpactiy: 100,
            resetEachFrame: true,
            uiConfig
        });
    }

    step(x, y) {
        const { alpha, beta, gamma, delta } = this.params;
        return {
            x: Math.sin(alpha * y) + gamma * Math.cos(alpha * x),
            y: Math.sin(beta * x) + delta * Math.cos(beta * y)
        }
    }

    increment() {
        for (let p in this.params) {
            this.params[p] += 0.001;
        }
    }

    randomize() {
        this.randomizeSafe(() => {
            this.params = {
                alpha: random(-3, 3),
                beta: random(-3, 3),
                gamma: random(-3, 3),
                delta: random(-3, 3)
            };
            this.x = 0.01;
            this.y = 0;
            this.z = 0;
            this.points = [];
        });
    }
}