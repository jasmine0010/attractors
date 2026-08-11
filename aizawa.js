class Aizawa extends Attractor {
    constructor(alpha, beta, gamma, delta, epsilon, rho, img, imgLight) {
        /* latex
        \begin{aligned}
        \frac{dx}{dt} &= (z - \beta)x - \delta y \\
        \frac{dy}{dt} &= \delta x + (z - \beta)y \\
        \frac{dz}{dt} &= \gamma + \alpha z - \frac{z^3}{3} - (x^2 + y^2)(1 + \epsilon z) + \rho z x^3
        \end{aligned}
        */
        
        const base = { alpha, beta, gamma, delta, epsilon, rho };

        const uiConfig = {
            titleConfig: {
                title: 'Aizawa Attractor',
                x: windowHeight * 0.06,
                y: windowHeight * 0.67
            },
            imgConfig: {
                img,
                imgLight,
                x: windowHeight * 0.025,
                y: windowHeight * 0.67,
                w: windowHeight * 0.8,
                h: windowHeight * 0.32
            }
        };

        super({
            name: 'Aizawa',
            dimension: 3,
            base,
            pos: { x: 0.01, y: 0, z: 0 },
            offset: { x: 0, y: 0, z: -windowHeight * 0.14 },
            numSteps: 100000,
            numIters: 1,
            scaleFactor: windowHeight * 0.25,
            bgOpactiy: windowHeight * 0.21,
            resetEachFrame: true,
            uiConfig
        });

        this.dt = 0.005;
        this.dir = 1;
    }

    f(x, y, z) {
        const { alpha, beta, gamma, delta, epsilon, rho } = this.params;
        return {
            dx: (z - beta) * x - delta * y,
            dy: delta * x + (z - beta) * y,
            dz: gamma + alpha * z - z * z * z / 3 -
                (x * x + y * y) * (1 + epsilon * z) +
                rho * z * x * x * x
        }
    }

    increment() {
        this.params.delta += 0.0005 * this.dir;
        this.params.epsilon += 0.0001 * this.dir;
        this.params.rho += 0.0001 * this.dir;

        if (Math.abs(this.params.delta - this.base.delta) > 1.5) {
            this.dir *= -1;
        }
    }

    randomize() {
        this.randomizeSafe(() => {
            this.params = {
                alpha: this.base.alpha + randomGaussian(-0.6, 0.6),
                beta: this.base.beta + randomGaussian(-0.1, 0.1),
                gamma: this.base.gamma + randomGaussian(-0.3, 0.3),
                delta: this.base.delta + randomGaussian(-0.3, 0.3),
                epsilon: this.base.epsilon + randomGaussian(-0.2, 0.2),
                rho: this.base.rho + randomGaussian(-0.1, 0.1)
            };

            this.x = 0.01;
            this.y = 0;
            this.z = 0;

            this.points = [];
        });
    }
}