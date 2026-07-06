class Lorenz extends Attractor {
    constructor(sigma, rho, beta, img, imgLight) {
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
                x: windowHeight * 0.06,
                y: windowHeight * 0.66
            },
            imgConfig: {
                img: img,
                imgLight: imgLight,
                x: windowHeight * 0.025,
                y: windowHeight * 0.66,
                w: windowHeight * 0.37,
                h: windowHeight * 0.32
            }
        };

        super({
            name: 'Lorenz',
            dimension: 3,
            base,
            pos: { x: 0.01, y: 0, z: 0 },
            offset: { x: 0, y: 0, z: -windowHeight * 0.4 },
            numSteps: 90000,
            numIters: 1,
            scaleFactor: windowHeight * 0.017,
            bgOpactiy: 130,
            uiConfig
        });

        this.dt = 0.01;
    }

    f(x, y, z) {
        const { sigma, rho, beta } = this.params;
        return {
            dx: sigma * (y - x),
            dy: x * (rho - z) - y,
            dz: x * y - beta * z
        }
    }

    increment() {
        this.params.sigma += 0.05;
        this.params.rho += 0.05;
        this.params.beta += 0.02;
    }

    randomize() {
        this.params = {
            sigma: this.base.sigma + randomGaussian(0, 5),
            rho: this.base.rho + randomGaussian(0, 5),
            beta: this.base.beta + randomGaussian(0, 5)
        };

        this.x = 0.01;
        this.y = 0;
        this.z = 0;

        this.points = [];
    }
}