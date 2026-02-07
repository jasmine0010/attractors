class Lorenz extends Attractor {
    constructor(sigma, rho, beta, img) {
        /* latex
        \begin{aligned}
        \frac{dx}{dt} &= \sigma (y - x) \\
        \frac{dy}{dt} &= x(\rho - z) - y \\
        \frac{dz}{dt} &= x y - \beta z
        \end{aligned}
        */

        const base = { sigma, rho, beta };

        const uiConfig = {
            titleConfig: {
                title: 'Lorenz Attractor',
                x: height * 0.06,
                y: height * 0.66
            },
            imgConfig: {
                img: img,
                x: height * 0.025,
                y: height * 0.66,
                w: height * 0.37,
                h: height * 0.32
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
            name: 'Lorenz',
            dimension: 3,
            base,
            pos: { x: 0.01, y: 0, z: 0 },
            numPoints: 90000,
            numIters: 1,
            scaleFactor: 9,
            bgOpactiy: 130,
            uiConfig
        });

        this.dt = 0.01;
    }

    step() {
        const { sigma, rho, beta } = this.params;
        const dx = (sigma * (this.y - this.x)) * this.dt;
        const dy = (this.x * (rho - this.z) - this.y) * this.dt;
        const dz = (this.x * this.y - beta * this.z) * this.dt;

        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    increment() {
        this.params.sigma += 0.05;
        this.params.rho += 0.05;
        this.params.beta += 0.02;
    }

    randomize() {
        this.params = {
            sigma: this.base.sigma + randomGaussian(0, 0.05),
            rho: this.base.rho + randomGaussian(0, 0.05),
            beta: this.base.beta + randomGaussian(0, 0.05)
        };
    }
}