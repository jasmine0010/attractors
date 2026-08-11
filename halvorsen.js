class Halvorsen extends Attractor {
    constructor(alpha, img, imgLight) {
        /* latex
        \begin{aligned}
        \frac{dx}{dt} &= -\alpha x - 4y - 4z - y^2 \\
        \frac{dy}{dt} &= -\alpha y - 4z - 4x - z^2 \\
        \frac{dz}{dt} &= -\alpha z - 4x - 4y - x^2
        \end{aligned}
        */
        
        const base = { alpha };

        const uiConfig = {
            titleConfig: {
                title: 'Halvorsen Attractor',
                x: windowHeight * 0.06,
                y: windowHeight * 0.67
            },
            imgConfig: {
                img,
                imgLight,
                x: windowHeight * 0.025,
                y: windowHeight * 0.67,
                w: windowHeight * 0.49,
                h: windowHeight * 0.32
            }
        };

        super({
            name: 'Halvorsen',
            dimension: 3,
            base,
            pos: { x: 0.01, y: 0, z: 0 },
            offset: { x: windowHeight * 0.2, y: windowHeight * 0.2, z: windowHeight * 0.2 },
            numSteps: 100000,
            numIters: 1,
            scaleFactor: windowHeight * 0.03,
            bgOpactiy: windowHeight * 0.21,
            resetEachFrame: true,
            uiConfig
        });

        this.dt = 0.01;
    }

    f(x, y, z) {
        const { alpha } = this.params;
        return {
            dx: -alpha * x - 4 * y - 4 * z - y * y,
            dy: -alpha * y - 4 * z - 4 * x - z * z,
            dz: -alpha * z - 4 * x - 4 * y - x * x 
        }
    }
    
    increment() {
        this.params.alpha += 0.0005;
    }

    randomize() {
        this.randomizeSafe(() => {
            this.params = {
                alpha: this.base.alpha + randomGaussian(0, 2)
            };

            this.x = 0.01;
            this.y = 0;
            this.z = 0;

            this.points = [];
        });
    }
}