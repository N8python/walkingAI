const gsize = 128;
let deathLines = [];
const Manager = {
    generation: 1,
    batch: 1,
    highScore: 0,
    highMeters: 0,
    generationSize: gsize,
    batchSize: 32,
    batchTimer: Infinity,
    deathX: 0,
    walkies: [],
    medianHistory: [],
    bestHistory: [],
    pop: Population({
        popSize: gsize,
        inputs: 13,
        outputs: 5,
        fullyConnected: true
    }),
    chooseParent(set) {
        let threshold = Math.random() * set.map(s => s.score).filter(s => Number.isFinite(s)).reduce((t, v) => t + v, 0);
        let sum = 0;
        const parents = [...set].sort(() => Math.random() - 0.5);
        const p = parents.find(p => {
            sum += p.score;
            if (sum > threshold) {
                return true;
            }
        })
        return p ? p : parents[0];
    },
    initGeneration(prev) {
        if (this.generation !== 1) {
            this.medianHistory.push(this.medianScore());
            this.bestHistory.push(this.highMeters);
            history.data.labels.push(this.generation);
            history.data.datasets.forEach(dataset => {
                if (dataset.label === "Median Score") {
                    dataset.data.push(this.medianScore())
                } else if (dataset.label === "High Score") {
                    dataset.data.push(this.highMeters);
                }
            })
            history.update();
            for (let i = 0; i < this.generationSize; i++) {
                this.walkies[i].brain.fitness = this.walkies[i].score;
            }
            this.pop.doGeneration();
        }
        this.walkies = [];
        this.batch = 1;
        const start = { x: 100, y: 420 };
        for (let i = 0; i < this.generationSize; i++) {
            this.walkies.push(Person({
                x: start.x,
                y: start.y,
                b: this.pop.netAt(i)
            }))
        }
        /*this.walkies = [];
        this.batch = 1;
        const start = { x: 100, y: 420 }
        for (let i = 0; i < this.generationSize; i++) {
            if (prev) {
                if (i < this.elitism) {
                    this.walkies.push(Person({
                        x: start.x,
                        y: start.y,
                        b: prev[i].brain.reproduce(0)
                    }))
                } else {
                    this.walkies.push(Person({
                        x: start.x,
                        y: start.y,
                        b: this.chooseParent(prev).brain.reproduceWith(this.chooseParent(prev).brain).reproduce(0.05)
                    }))
                }
            } else {
                this.walkies.push(Person({
                    x: start.x,
                    y: start.y
                }))
            }
        }*/
    },
    runBatch() {
        if (this.batch > this.generationSize / this.batchSize) {
            this.walkies.forEach(walkie => {
                if (walkie.inGame) {
                    walkie.remove();
                }
            });
            this.generation += 1;
            const walkieCopy = [...this.walkies].sort((a, b) => b.score - a.score);
            this.initGeneration(walkieCopy);
            this.runBatch();
        } else {
            this.deathX = 0;
            const startIndex = (this.batch - 1) * this.batchSize;
            const endIndex = this.batch * this.batchSize;
            this.batch += 1;
            this.walkies.forEach(walkie => {
                if (walkie.inGame) {
                    walkie.remove();
                }
            });
            for (let i = startIndex; i < endIndex; i++) {
                this.walkies[i].add();
            }
        }
    },
    decTimer() {
        this.batchTimer -= 1;
        if (this.batchTimer < 1 || this.walkies.every(walkie => !walkie.inGame)) {
            this.batchTimer = Infinity;
            this.runBatch();
        }
    },
    drawAll() {
        this.walkies.forEach(walkie => {
            if (walkie === Manager.leader) {
                fill(255);
            } else {
                fill(255, 255, 255, 100);
            }
            if (walkie.inGame) {
                walkie.draw();
                walkie.cc();
                if (tick % 5 === 0) {
                    walkie.think();
                }
            }
        })
        this.deathX += 0.5; //min(0.5 + 0.0025 * this.generation, 1);
        stroke(255, 0, 0);
        strokeWeight(5);
        line(this.deathX, 0, this.deathX, 502);
        strokeWeight(1);
        stroke(255);
        line(this.deathX, 0, this.deathX, 502);
        deathLines = []
        for (let i = 0; i < 3; i++) {
            deathLines.push([this.deathX, 505, this.deathX + map(noise((this.deathX * (i + 3)) ** 2), 0, 1, -20, 20), map(noise((this.deathX * (i + 1)) ** 2), 0, 1, 485, 505)])
        }
        deathLines.forEach(death => {
            stroke(255, 0, 0);
            strokeWeight(floor(random(2, 5)))
            line(...death);
            stroke(255);
            strokeWeight(1)
            line(...death);
        });
        strokeWeight(1);
        stroke(255, 0, 0);
        line(0, 500, this.deathX, 500);
        line(0, 505, this.deathX, 505);
        stroke(0);
    },
    checkHighScore() {
        if (this.currentTopScore > this.highScore) {
            this.highScore = Math.round(this.currentTopScore);
        }
        if (this.currentMeters > this.highMeters) {
            this.highMeters = this.currentMeters;
        }
    },
    medianScore() {
        const sorted = [...this.walkies].sort((a, b) => a.x - b.x);
        if (gsize % 2 === 0) {
            return ((sorted[Math.ceil(gsize / 2)].x - 100) / 200 + (sorted[Math.floor(gsize / 2)].x - 100) / 200) / 2;
        }
        return (sorted[Math.ceil(gsize / 2)].x - 100) / 200;
    },
    get currentTopScore() {
        const i = [...this.walkies].filter(walkie => walkie.inGame).sort((a, b) => b.score - a.score)[0];
        return i ? i.score : 0;
    },
    get currentMeters() {
        const i = [...this.walkies].filter(walkie => walkie.inGame).sort((a, b) => b.x - a.x)[0];
        return i ? ((i.x - 100) / 200) : 0;
    },
    get leader() {
        const i = [...this.walkies].filter(walkie => walkie.inGame).sort((a, b) => b.score - a.score)[0];
        return i ? i : undefined;
    },
    get toTranslate() {
        const i = [...this.walkies].filter(walkie => walkie.inGame).sort((a, b) => b.lengthAhead - a.lengthAhead)[0];
        return i ? i.lengthAhead : 0;
    }
};