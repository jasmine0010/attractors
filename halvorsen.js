class Halvorsen extends Attractor {
    constructor(alpha, img, imgLight) {
        /* latex
        \begin{aligned}
        \frac{dx}{dt} &= -\alpha x - 4y - 4z - y^2 \\
        \frac{dy}{dt} &= -\alpha y - 4z - 4x - z^2 \\
        \frac{dz}{dt} &= -\alpha z - 4x - 4y - x^2
        \end{aligned}
        */
        
        console.log(img.width, img.height);

        const base = { alpha };

        const uiConfig = {
            titleConfig: {
                title: 'Halvorsen Attractor',
                x: windowHeight * 0.06,
                y: windowHeight * 0.67
            },
            imgConfig: {
                img: img,
                imgLight: imgLight,
                x: windowHeight * 0.025,
                y: windowHeight * 0.67,
                w: windowHeight * 0.49,
                h: windowHeight * 0.32
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
            name: 'Halvorsen',
            dimension: 3,
            base,
            pos: { x: 0.01, y: 0, z: 0 },
            offset: { x: windowHeight * 0.2, y: windowHeight * 0.2, z: windowHeight * 0.2 },
            numPoints: 50000,
            numIters: 1,
            scaleFactor: windowHeight * 0.03,
            bgOpactiy: windowHeight * 0.21,
            uiConfig
        });

        this.dt = 0.005;
    }

    step() {
        const { alpha } = this.params;
        const dx = (-alpha * this.x - 4 * this.y - 4 * this.z - this.y * this.y) * this.dt;
        const dy = (-alpha * this.y - 4 * this.z - 4 * this.x - this.z * this.z) * this.dt;
        const dz = (-alpha * this.z - 4 * this.x - 4 * this.y - this.x * this.x) * this.dt;

        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    increment() {
        this.params.alpha += 0.0005;
    }

    randomize() {
        this.params = {
            alpha: this.base.alpha + randomGaussian(0, 2)
        };

        this.x = 0.01;
        this.y = 0;
        this.z = 0;
    }
}