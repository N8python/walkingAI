const dotProduct = (t1, t2) => t1.reduce((total, item, index) => total + item * t2[index], 0);
const sigmoid = (val) => 1 / (1 + Math.exp(-val))
const genRandVec = (length, multiplier = 2, bias = 1) => Array(length).fill(() => (Math.random() * multiplier) - bias).map(x => x());
const geneticMerge = (num1, num2) => {
    if (Math.random() <= 0.5) {
        return num1;
    }
    return num2;
}
const NN = ({
    inputs,
    hiddenLayers,
    outputs,
    weights,
    biases,
    activationFunction = sigmoid
}) => {
    if (!weights) {
        weights = [];

        layers = [inputs, ...hiddenLayers];
        layers.forEach((layer, idx) => {
            nextLayer = layers[idx + 1];
            if (nextLayer === undefined) {
                nextLayer = outputs;
            }
            weights.push(Array(nextLayer).fill(() => genRandVec(layer + 1)).map(x => x()))
        });
        // console.log("Weights: ", weights)
    }
    return {
        feedForward(inputs) {
            weights.forEach((weightList, idx) => {
                inputs = inputs.concat(1);
                const outputs = [];
                weightList.forEach((weights) => {
                    outputs.push(activationFunction(dotProduct(weights, inputs)))
                })
                inputs = outputs;
                // console.log(inputs)
            })
            return inputs;
        },
        weights() {
            return weights;
        },
        reproduce(change) {
            return NN({
                weights: weights.map(weightList =>
                    weightList.map(weights =>
                        weights.map(weight =>
                            (weight === 1) ?
                            1 :
                            (Math.random() > (1 - change)) ? weight + randomGaussian() / (5 + (Manager.generation / 25)) : weight
                        )
                    )
                ),
                ///biases: biases.map(bias => (Math.random() > (1 - change)) ? bias + randomGaussian() / 5 : bias)
            })
        },
        reproduceWith(nn) {
            const otherWeights = nn.weights();
            return NN({
                weights: weights.map((weightList, i1) => {
                    let randRow = Math.floor(Math.random() * weightList.length);
                    let randCol = Math.floor(Math.random() * weightList[0].length);
                    return weightList.map((weightRow, i2) => {
                        return weightRow.map((weight, i3) => (i1 < randRow || (i1 === randRow && i2 < randCol)) ? weight : otherWeights[i1][i2][i3])
                    })
                }),
                /*biases: biases.map((bias, idx) => {
                    return (idx <= randBiasRow) ? bias : otherBiases[idx];
                })*/
            })
        }
    }
}