# CulebrAI

Snake game solved with Deep Q-Learning using TensorFlow.js.

### Features

- Double online and target networks
- Dueling architecture -> Advantage + Value = Q
- ~Prioritized experience replay~ Combined experience replay

by lropero

### Requires

- [Node v18.13.0](https://nodejs.org/)
- npm v9.3.1

### Installation

```sh
$ npm ci
```

### Usage

```sh
$ npm run start # serves game at http://localhost:3000 and starts agent at http://localhost:5000 concurrently
```

### Settings

- `index.js`

```js
const agentSettings = {
  epsilon: 1, // Exploration rate
  epsilonDecay: 0.00005, // Exploration decay
  epsilonMin: 0.01, // Exploration minimum
  gamma: 0.95, // Discount factor
  tau: 1000, // Update of target network
  memory: {
    batchSize: 64,
    cer: true, // Combined experience replay
    size: 21000
  },
  network: {
    alpha: 0.00025, // Learning rate
    inputSize: 9,
    layers: [
      // Hidden layers
      { activation: 'relu', units: 64 },
      { activation: 'relu', units: 64 }
    ],
    outputSize: 4
  }
}
```

- `public/arkanai.js`

```js
const settings = {
  alpha: 1,
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 2, sides: 12, speed: 3 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 8, padding: 2, width: 18 },
  padding: 20,
  paddle: { color: '#4020d0', height: 5, speed: 2, width: 30 },
  rows: 5,
  size: { height: 200, width: 200 },
  targetMeanScore: 1000 // 0 runs forever
}
```
