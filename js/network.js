// eslint-disable-next-line no-unused-vars
class NeuralNetwork {
  constructor(layers) {
    this.layers = [];
    for (let i = 0; i < layers.length - 1; i++) {
      this.layers.push(
        new Layer({ inputCount: layers[i], outputCount: layers[i + 1] })
      );
    }
  }

  static feedForward({ inputs, network }) {
    // eslint-disable-next-line no-undef
    let outputs = Layer.feedForward({
      activate: relu,
      inputs,
      layer: network.layers[0],
    });
    for (let i = 1; i < network.layers.length; i++) {
      // eslint-disable-next-line no-undef
      outputs = Layer.feedForward({
        activate: i === network.layers.length - 1 ? (x) => x : relu,
        inputs: outputs,
        layer: network.layers[i],
      });
    }
    // eslint-disable-next-line no-undef
    return softmax(outputs);
  }

  // (1 - 1 / (1 + RS))

  static mutate({ amount, network }) {
    for (const layer of network.layers) {
      for (let o = 0; o < layer.biases.length; o++) {
        // eslint-disable-next-line no-undef
        // debugger
        layer.biases[o] = lerp(layer.biases[o], Math.random(), amount);
      }
      for (let i = 0; i < layer.weights.length; i++) {
        for (let o = 0; o < layer.weights[i].length; o++) {
          // eslint-disable-next-line no-undef
          // debugger
          layer.weights[i][o] = lerp(
            layer.weights[i][o],
            Math.random(),
            amount
          );
        }
      }
    }
  }
}

class Layer {
  constructor({ inputCount, outputCount }) {
    this.biases = new Array(outputCount);
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }
    Layer.randomize(this);
  }

  static feedForward({ activate, inputs, layer }) {
    for (let i = 0; i < layer.inputs.length; i++) {
      layer.inputs[i] = inputs[i];
    }
    for (let o = 0; o < layer.outputs.length; o++) {
      let sum = 0;
      for (let i = 0; i < layer.inputs.length; i++) {
        sum += layer.inputs[i] * layer.weights[i][o];
      }
      layer.outputs[o] = activate(sum + layer.biases[o]);
    }
    return layer.outputs;
  }

  static randomize(layer) {
    for (let o = 0; o < layer.biases.length; o++) {
      layer.biases[o] = Math.random();
    }
    for (let i = 0; i < layer.inputs.length; i++) {
      for (let o = 0; o < layer.outputs.length; o++) {
        layer.weights[i][o] = Math.random();
      }
    }
  }
}
