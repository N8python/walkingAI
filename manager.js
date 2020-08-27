const gsize = 128;
const Manager = {
    generation: 1,
    batch: 1,
    highScore: 0,
    generationSize: gsize,
    batchSize: 32,
    batchTimer: Infinity,
    deathX: 0,
    walkies: [],
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
        line(this.deathX, 0, this.deathX, 800);
        strokeWeight(1);
        stroke(0);
    },
    checkHighScore() {
        if (this.currentTopScore > this.highScore) {
            this.highScore = Math.round(this.currentTopScore);
        }
    },
    get currentTopScore() {
        const i = [...this.walkies].filter(walkie => walkie.inGame).sort((a, b) => b.score - a.score)[0];
        return i ? i.score : 0;
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