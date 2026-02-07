class Aizawa extends Attractor {
    constructor(alpha, beta, gamma, delta, epsilon, rho, img) {
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
                x: height * 0.06,
                y: height * 0.67
            },
            imgConfig: {
                img: img,
                x: height * 0.025,
                y: height * 0.67,
                w: height * 0.8,
                h: height * 0.32
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
        }

        super({
            name: 'Aizawa',
            dimension: 3,
            base,
            pos: { x: 0.01, y: 0, z: 0 },
            numPoints: 50000,
            numIters: 1,
            scaleFactor: 180,
            bgOpactiy: 130,
            uiConfig
        });

        this.dt = 0.01;
    }

    step() {
        const { alpha, beta, gamma, delta, epsilon, rho } = this.params;
        const dx = ((this.z - beta) * this.x - delta * this.y) * this.dt;
        const dy = (delta * this.x + (this.z - beta) * this.y) * this.dt;
        const dz = (gamma + alpha * this.z - this.z * this.z * this.z / 3 -
                 (this.x * this.x + this.y * this.y) * (1 + epsilon * this.z) +
                 rho * this.z * this.x * this.x * this.x) * this.dt;

        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    increment() {
        this.params.delta += 0.0005;
        this.params.epsilon += 0.0001;
        this.params.rho += 0.0001;
    }

    randomize() {
        this.params = {
            alpha: this.base.alpha + randomGaussian(0, 0.05),
            beta: this.base.beta + randomGaussian(0, 0.05),
            gamma: this.base.gamma + randomGaussian(0, 0.05),
            delta: this.base.delta + randomGaussian(0, 0.3),
            epsilon: this.base.epsilon + randomGaussian(0, 0.02),
            rho: this.base.rho + randomGaussian(0, 0.02)
        };
    }
}