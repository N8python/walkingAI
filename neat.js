function gaussianRand() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}

function std0() {
    return (gaussianRand() - 0.5) * 2;
}

function neatRandom(min, max) {
    return min + Math.random() * (max - min);
}
const sigmoid = (val) => 1 / (1 + Math.exp(-val));
let innovationNumber = 0;

function NN({
    nodeGenes,
    connectionGenes
}) {
    let storage = [...nodeGenes.map(gene => ({...gene, value: 0 }))].sort((a, b) => {
        if (a.type === b.type) {
            return a.id - b.id;
        } else if (a.type === "input") {
            return -1;
        } else if (a.type === "output") {
            return 1;
        } else if (b.type === "input") {
            return 1;
        } else if (b.type === "output") {
            return -1;
        }
    });
    let fitness = 0;
    return {
        feedForward(input) {
            storage.filter(({ type }) => type === "input").forEach((node, i) => node.value = input[i]);
            storage.filter(({ type }) => type !== "input").forEach((node) => {
                const ins = connectionGenes.filter(({ enabled }) => enabled).filter(({ out }) => out === node.id);
                ins.forEach(i => {
                    node.value += storage.find(({ id }) => id === i.in).value * i.weight;
                })
                node.value = Math.tanh(node.value);
            })
            const outputs = storage.filter(({ type }) => type === "output").sort((a, b) =>
                a.id - b.id).map(node => node.value);
            storage.forEach(node => {
                node.value = 0;
            });
            return outputs;
        },
        mutateWeights() {
            connectionGenes.forEach(gene => {
                const seed = Math.random();
                if (seed < 0.1) {
                    gene.weight = neatRandom(-1, 1);
                } else {
                    gene.weight += std0() / 10;
                }
            })
        },
        addConnection() {
            let connectionFound = false;
            [...nodeGenes].sort(() => Math.random() - 0.5).forEach(node1 => {
                nodeGenes.sort(() => Math.random() - 0.5).forEach(node2 => {
                    if ((node1.type === "input" && node2.type === "hidden") || (node1.type === "input" && node2.type === "output") || (node1.type === "hidden" && node2.type === "hidden") || (node1.type === "hidden" && node2.type === "output")) {
                        if (!connectionFound && (node1 !== node2)) {
                            const isConnection = connectionGenes.some(gene => {
                                return (gene.in === node1.id && gene.out === node2.id) || (gene.in === node2.id && gene.out === node1.id);
                            });
                            if (!isConnection) {
                                let c;
                                if (node1.id > node2.id) {
                                    c = {
                                        innov: ++innovationNumber,
                                        in: node2.id,
                                        out: node1.id,
                                        enabled: true,
                                        weight: neatRandom(-1, 1)
                                    };
                                } else {
                                    c = {
                                        innov: ++innovationNumber,
                                        in: node1.id,
                                        out: node2.id,
                                        enabled: true,
                                        weight: neatRandom(-1, 1)
                                    };
                                }
                                connectionGenes.push(c)
                                connectionFound = true;
                            }
                        }
                    }
                })
            })
        },
        addNode() {
            const chosen = connectionGenes[Math.floor(Math.random() * connectionGenes.length)]
            if (chosen) {
                chosen.enabled = false;
                const newNode = {
                    type: "hidden",
                    id: Math.max(...nodeGenes.map(node => node.id)) + 1
                }
                nodeGenes.push(newNode);
                connectionGenes.push({
                    innov: ++innovationNumber,
                    in: chosen.in,
                    out: newNode.id,
                    enabled: true,
                    weight: neatRandom(-1, 1)
                });
                connectionGenes.push({
                    innov: ++innovationNumber,
                    in: newNode.id,
                    out: chosen.out,
                    enabled: true,
                    weight: neatRandom(-1, 1)
                });
                storage = [...nodeGenes.map(gene => ({...gene, value: 0 }))].sort((a, b) => {
                    if (a.type === b.type) {
                        return a.id - b.id;
                    } else if (a.type === "input") {
                        return -1;
                    } else if (a.type === "output") {
                        return 1;
                    } else if (b.type === "input") {
                        return 1;
                    } else if (b.type === "output") {
                        return -1;
                    }
                });
            }


        },
        get nodeGenes() {
            return nodeGenes;
        },
        set nodeGenes(val) {
            nodeGenes = val;
        },
        get connectionGenes() {
            return connectionGenes;
        },
        set connectionGenes(val) {
            connectionGenes = val;
        },
        get storage() {
            return storage;
        },
        get fitness() {
            return fitness;
        },
        set fitness(val) {
            fitness = val;
        },
        crossover(otherNet) {
            const newNodeGenes = nodeGenes.map(gene => ({...gene }));
            const newConnectionGenes = connectionGenes.map(gene => {
                const otherGene = otherNet.connectionGenes.find(g => g.innov === gene.innov)
                if (otherGene) {
                    let toEnable = true;
                    if (!gene.enabled || !otherGene.enabled) {
                        if (Math.random() < 0.75) {
                            toEnable = false;
                        }
                    }
                    if (Math.random() < 0.5) {
                        return {...otherGene, enabled: toEnable };
                    } else {
                        return {...gene, enabled: toEnable };
                    }
                }
                return {...gene };
            })
            return NN({
                nodeGenes: newNodeGenes,
                connectionGenes: newConnectionGenes
            });
        },
        disjointAndExcess(otherNet) {
            const matching = connectionGenes.filter(({ innov }) => otherNet.connectionGenes.some(({ innov: i }) => innov === i)).length;
            return (connectionGenes.length + otherNet.connectionGenes.length - 2 * (matching));

        },
        weightDiff(otherNet) {
            //const mine = connectionGenes.filter(({ innov }) => otherNet.connectionGenes.some(({ innov: i }) => innov === i)).map(({ weight, innov }) => Math.abs(weight - otherNet.connectionGenes.find(({ innov: i }) => innov === i).weight)).reduce((t, v) => t + v, 0);

            //const theirs = otherNet.connectionGenes.filter(({ innov }) => connectionGenes.some(({ innov: i }) => innov === i)).map(({ weight, innov }) => Math.abs(weight - connectionGenes.find(({ innov: i }) => innov === i).weight)).reduce((t, v) => t + v, 0);

            //return (mine + theirs) / Math.max((connectionGenes.length + otherNet.connectionGenes.length), 1)
            let diff = 0;
            let matching = 0;
            connectionGenes.forEach(gene => {
                otherNet.connectionGenes.forEach(gene2 => {
                    if (gene.innov === gene2.innov) {
                        matching++;
                        diff += Math.abs(gene.weight - gene2.weight);
                    }
                })
            });
            if (matching === 0) {
                return 100;
            }
            return diff / matching;
        },
        clone() {
            return NN({
                nodeGenes: [...nodeGenes.map(gene => ({...gene }))],
                connectionGenes: [...connectionGenes.map(gene => ({...gene }))]
            })
        },
        mutate() {
            if (Math.random() < 0.8) {
                this.mutateWeights();
            }
            if (Math.random() < 0.25) {
                this.addConnection();
            }
            if (Math.random() < 0.05) {
                this.addNode();
            }
            return this;
        }
    }
}

function Population({
    inputs,
    outputs,
    popSize,
    initialConnectionsMin = 0,
    initialConnectionsMax = 0,
    excessCoeff = 1,
    weightDiffCoeff = 2,
    diffThresh = 1.5,
    fullyConnected = false
}) {
    let population = [];
    const nodes = [];
    let species = [];

    function speciatePopulation() {
        population.forEach(nn => {
            let speciesFound = false;
            species.forEach(s => {
                if (s.length !== 0) {
                    if (!speciesFound) {
                        const rep = s[Math.floor(Math.random() * s.length)];
                        const diff = ((excessCoeff * nn.disjointAndExcess(rep)) / (Math.max(rep.connectionGenes.length + nn.connectionGenes.length), 1)) + weightDiffCoeff * nn.weightDiff(rep);
                        if (diff < diffThresh) {
                            s.push(nn);
                            speciesFound = true;
                        }
                    }
                }
            })
            if (!speciesFound) {
                const newSpecies = [nn];
                species.push(newSpecies);
            }
        })
    }
    for (let i = 0; i < inputs; i++) {
        nodes.push({ id: i, type: "input" })
    }
    for (let i = 0; i < outputs; i++) {
        nodes.push({ id: i + inputs, type: "output" })
    }
    for (let i = 0; i < popSize; i++) {
        const nn = NN({
            nodeGenes: [...nodes.map(node => ({...node }))],
            connectionGenes: []
        });
        for (let i = 0; i < Math.floor(neatRandom(initialConnectionsMin, initialConnectionsMax)); i++) {
            nn.addConnection();
        }
        nn.mutate();
        population.push(nn)

    }
    if (fullyConnected) {
        const connections = [];
        for (let i = 0; i < inputs; i++) {
            for (let j = 0; j < outputs; j++) {
                connections.push({ in: i,
                    out: j + inputs,
                    enabled: true,
                    innov: ++innovationNumber
                })
            }
        }
        population.forEach(nn => {
            nn.connectionGenes = [...connections.map(c => ({...c, weight: neatRandom(-1, 1) }))];
        })
    }
    speciatePopulation();
    return {
        get population() {
            return population;
        },
        get species() {
            return species;
        },
        get popSize() {
            return popSize;
        },
        setFitness(i, fitness) {
            if (population[i]) {
                population[i].fitness = fitness;
            }
        },
        netAt(i) {
            return population[i];
        },
        doGeneration() {
            const popFitness = this.avgFitness();
            population = [];
            let amtLeft = popSize;
            species.forEach(s => {
                let newIndividualsCount = Math.ceil((s.map(nn => nn.fitness / s.length).reduce((t, v) => t + v, 0) / popFitness) * s.length);
                amtLeft -= newIndividualsCount;
                if (amtLeft < 0) {
                    newIndividualsCount += amtLeft;
                    amtLeft = 0;
                }
                let newPeeps = [];
                for (let i = 0; i < newIndividualsCount; i++) {
                    const parent1 = this.chooseParent(s);
                    const parent2 = this.chooseParent(s);
                    let baby;
                    if (parent1.fitness > parent2.fitness) {
                        baby = parent1.crossover(parent2);
                    } else {
                        baby = parent2.crossover(parent1);
                    }
                    baby.mutate();
                    newPeeps.push(baby);
                }
                population.push(...newPeeps);
            });
            //console.log(species.map(x => x.length).reduce((t, v) => t + v));
            let k = 0;
            species.forEach(s => {
                    s.forEach(nn => {
                        nn.vestigal = true;
                        k++;
                    })
                })
                //console.log(k);
            species.forEach((s, i) => {
                if (s.length === 0) {
                    species.splice(i, 1);
                }
            })
            speciatePopulation();
            //console.log(species.map(x => x.length).reduce((t, v) => t + v));
            //console.log("Vestigal bois:"+ species.map(x => x.filter(x => x.vestigal).length).reduce((t, v) => t + v))
            species = species.map(s => s.filter(x => !x.vestigal));
            //console.log(species.map(x => x.length).reduce((t, v) => t + v));
            species.forEach((s, i) => {
                if (s.length === 0) {
                    species.splice(i, 1);
                }
            })
        },
        chooseParent(s) {
            const sorted = [...s].sort((a, b) => b.fitness - a.fitness);
            const seed = Math.random();
            if (seed < 0.25) {
                return sorted[0];
            }
            if (seed < 0.375 && s.length > 1) {
                return sorted[1];
            }
            if (seed < 0.5 && s.length > 2) {
                return sorted[2];
            }
            let threshold = Math.random() * s.map(nn => nn.fitness).reduce((t, v) => t + v);
            let sum = 0;
            return s.find((p, i) => {
                sum += p.fitness;
                if (sum > threshold) {
                    return true;
                }
            });
        },
        avgFitness() {
            return population.map(nn => nn.fitness).reduce((t, v) => t + v, 0) / population.length;
        }
    }
}