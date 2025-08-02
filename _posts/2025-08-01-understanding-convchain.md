---
layout: post
gisqus_comments: "true"
title: Understanding ConvChain
date: 2025-08-01T17:51:00.000-07:00
description: A not-so-gentle introduction to programming procedural generation with an interactive demo
tags: software-dev procgen
categories: personal-site
related_posts: "true"
thumbnail: assets/img/convchain/convchain.gif
toc:
  sidebar: "left"
---

I'd always wanted to know how videogame designers often make infinite worlds for players to explore, or how rogue-like games such as Diablo create levels.

<div class="row mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/d2-map.jpg.jpg" title="The den of evil!" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
A core memory of my childhood: Diablo II
</div>

The technique for creating random patterns is called procedural generation, and my first real introduction to it came, thanks to reddit, through a technique called [Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse), created by Maxim Gumin in like 2016.

<div class="row mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/wfc.png" title="The wave function collapse algorithm" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
The Wave Function Collapse algorithm takes in a sample image, extracts patterns out of it, defines adjacency rules for them, and recreates an image using said patterns and adjacencies.
</div>

The algorithm seemed quite simple and I will make its own post soon, however I just couldn't wrap my head around the implementation. I decided to start with an earlier algorithm of Gumin's called [ConvChain](https://github.com/mxgmn/ConvChain).

## The ConvChain algorithm

_ConvChain is a Markov chain of images that converges to input-like images. That is, the distribution of NxN patterns in the outputs converges to the distribution of NxN patterns in the input as the process goes on._

At its core, the ConvChain algorithm is itself an implementation of the Metropolis-Hastings algorithm.

Maxim Gumin describes his own algorithm as

> A markov chain of images that converges to input-like images. That is, the distribution of patterns of size N\*N in the outputs converges to the distribution of patterns of size N\*N in the input as the process goes on. This is because by definition, a MCMC should be a _reversible_ process, through which the input can be inferred from the output.

Credit goes to for designing the algorithm and writing it in C# and to [Kevin Chapelier](https://github.com/kchapelier) for porting it to javascript. I have made very minimal changes to the algorithm, mainly in how arrays are sorted, as I _think_ there was a mistake in how it's implemented. It doesn't actually seem to impact accuracy all that much, though, but I thought I'd leave the changes there.

### The Metropolis-Hastings Algorithm

> [Wikipedia](https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm): a Markov chain Monte Carlo (MCMC) method for obtaining a sequence of random samples from a probability distribution from which direct sampling is difficult. New samples are added to the sequence in two steps: first a new sample is proposed based on the previous sample, then the proposed sample is either added to the sequence or rejected depending on the value of the probability distribution at that point.

> The Metropolis–Hastings algorithm generates a sequence of sample values in such a way that, as more and more sample values are produced, the distribution of values more closely approximates the desired distribution. These sample values are produced iteratively in such a way, that the distribution of the next sample depends only on the current sample value, which makes the sequence of samples a Markov chain.

The crux of the algorithm goes like this:

1. Read the input image and count NxN patterns.
   (optional) Augment pattern data with rotations and reflections.
2. Initialize the image (for example, with independent random values) in some state S0.
3. Repeat the Metropolis step:
   Compute the energy E of the current state S.
   Choose a random pixel and change its value. Let's call the resulting state S'.
   Compute the energy E' of the state S'.
   Compare E' to E. If E' < E assign the current state to be E'. Otherwise, assign the current state to be E' with probability `exp(-(E'-E)/T)`.

S is the current state of any pixel. In his implementation, pixels can be either white or black (0, or 1). Energy is computed via an equation that I will describe later. T stands for temperature, a parameter that can be tweaked to determine how often a value can flip between 0 and 1.

Let's dive into the code.

## Step 0: The Beginning

This is the beginning of the main function. We have a boolean 2D array called `sample`, the size `N` of the patterns that we will extract from the input image, the `temperature` parameter that affects how frequently a given pixel flips between 0 and 1, the `size` of our output image, and the number of `iterations` the algorithm will run for.
Internally, it uses an array named `field` that will becomet the final output, and `weights`, where we will count the amount of times each pattern appears in our input and thus its probability distribution.

```c#
static bool[,] ConvChain(bool[,] sample, int N, double temperature, int size, int iterations)
{
  bool[,] field = new bool[size, size]; // the array of our final output
  double[] weights = new double[1 << (N * N)]; //This is where we will store the count of each pattern.
  Random random = new Random(); //the magical hat where we draw numbers from
```

### T is for Temperature

Temperature is a variable that we can tweak so that we can directly adjust the probability of a pixel being replaced by a new value. It changes the probability distribution of the state S to `p(S) ~ exp(-E(S)/T)`

### Why 1 << (N \* N)?

The expression means "bitwise shift the number 1 to the left N\*N times".
Bitwise shifting left means converting the number to binary, adding zeroes to the right of it and computing the end result. 1, in binary, is 2 to the power of zero, (_rock fact: that's why programmers count from zero_) and each zero you tack on to the right adds a power to that 2. So, the code reads "weights is an array of size 2^n\*n" in common parlance, but really we're working with bits here:

Consider an n-sized binary array. It has n\*n elements, each 0 or 1. All the combinations possible for the array can fit a binary number with n\*n zeros to the right of it, e.g. b10000 for n = 2, or 2^(2\*2)=16 in decimal, thus 1 << N\*N.
We will use `weight` to count how often often each pattern shows up.

## Step 1: Read the input image and count NxN patterns.

#### ...And also augment pattern data with rotations and reflections:

We iterate over each pixel in the input, read N pixels ahead and above to make an NxN array (the algorithm wraps around the image if there aren't enough pixels), rotate four times and get the mirror of each pattern (thus getting eight patterns total per pixel).

```c#
//for each point in the input, get eight patterns
for (int y = 0; y < sample.GetLength(1); y++) for (int x = 0; x < sample.GetLength(0); x++)
  {
    //The array of Patterns where we'll store them
    Pattern[] p = new Pattern[8];
    //Get the eight patterns mentioned before.
    //No special logic here except for the custom class Pattern which I'll hand-wave away *whoosh*.
    //Just take it as the pattern of size N that starts at coords (x,y) in the sample array.
    p[0] = new Pattern(sample, x, y, N);
    p[1] = p[0].Rotated();
    p[2] = p[1].Rotated();
    p[3] = p[2].Rotated();
    p[4] = p[0].Reflected();
    p[5] = p[1].Reflected();
    p[6] = p[2].Reflected();
    p[7] = p[3].Reflected();
    // each transformation of the pattern gets its own count.
    // It's my intuition that at the end of the day they all get the same amount of counts.
    for (int k = 0; k < 8; k++) weights[p[k].Index()] += 1;
  }
//using 0.1 instead of 0 makes the math easier *whoosh*.
for (int k = 0; k < weights.Length; k++) if (weights[k] <= 0) weights[k] = 0.1;
```

### The Index method

```c#
	public int Index()
	{
		int result = 0;
    ///Size() is just the size of the input array
		for (int y = 0; y < Size(); y++) for (int x = 0; x < Size(); x++) result += data[x, y] ? 1 << (y * Size() + x) : 0;
		return result;
	}
```

Remember how we calculated the weights array size with bitwise shifting? This method uses the same technique to turn the binary array into a number. Another way to do this would be to just concatenate them as strings, casting them to binary, then to decimal.

## Step 2: Initialize the image with independent random values.

This one is trivial: Just fill the array randomly with 1's and 0's.

```c#
for (int y = 0; y < size; y++) for (int x = 0; x < size; x++) field[x, y] = random.Next(2) == 1;
```

## Step 3: Repeat the Metropolis step

Initialize the metropolis algorithm in a random pixel, and run it enough times so that approximately every pixel in a square image of size `size` gets iterated on `iterations` times.

```c#
for (int k = 0; k < iterations * size * size; k++) metropolis(random.Next(size), random.Next(size));
```

### The Metropolis-Hastings algorithm

The Metropolis step refers to the Metropolis-Hastings algorithm for getting a random sample out of a probability distribution. From (Wikipedia):

> _First a new sample is proposed based on the previous sample, then the proposed sample is either added to the sequence or rejected depending on the value of the probability distribution at that point. The resulting sequence can be used to approximate the distribution (e.g. to generate a histogram) or to compute an integral (e.g. an expected value)._

In his code it looks like this:

```c#
void metropolis(int i, int j)
{
  double p = energyExp(i, j); //Calculate the energy state of the given pixel at i,j. This is E in the original description
  field[i, j] = !field[i, j]; //flip the bit at i,j
  double q = energyExp(i, j); // Re-calculate the energy state of the now-switched pixel at i,j. This is E' in the original description
  //If q > p, keep the changes, otherwise randomly revert the changes with P = exp(-(E'-E)/T)
  if (Math.Pow(q / p, 1.0 / temperature) < random.NextDouble()) field[i, j] = !field[i, j];
};
```

If E' is greater than E (q>p), then `q / p >= random.Nextdouble()` thus we keep that bit flipped (assuming temperature is less than 1). Otherwise, flip it back with a certain random chance. Does it actually match the probability distribution `exp(-(E'-E)/T)`? Let's try to figure it out:

### E is for energy

ExUtumno introduces the energy function as `E(S) := - sum over all patterns P in S of log(weight(P))` because in the metropolis part of his algorithm he uses `exp(-(E'-E)/T)`. Remember our weight array and how it was used for storing pattern counts? Turns out we will actually interpret said pattern counts as their log or something. I haven't done this kind of math in a while, so I'm still iffy on this part. I might update once I figure it out. Meanwhile, check out a closely-related algorithm:

### The Log-Normal Distribution

> A log-normal process is the statistical realization of the multiplicative product of many independent random variables, each of which is positive. This is justified by considering the central limit theorem in the log domain (sometimes called Gibrat's law). [The log-normal distribution](https://en.wikipedia.org/wiki/Log-normal_distribution) is the maximum entropy probability distribution for a random variate X—for which the mean and variance of ln X are specified.

Anyway, here's the energy function. Hold out your hand, it's quite cool:

```c#
double energyExp(int i, int j)
{
  double value = 1.0;
  for (int y = j - N + 1; y <= j + N - 1; y++) \
    for (int x = i - N + 1; x <= i + N - 1; x++) \
      value *= weights[new Pattern(field, x, y, N).Index()];
  return value;
};
```

Wow. The math checks out. It's got _logs_. It's got _multiplications_. It's got _entropy_.

So if E and E' are sums of logs probability densities... By _Log Magic_ the exponent of E'-E becomes q/p. Maybe the negative signs all cancel each other out. Maybe the probability of `Math.Pow(q / p, 1.0 / temperature) < random.NextDouble()` really equals `exp(-(E'-E)/T)`. Maybe, _just maybe_, all is right in the world.

```c#
  //If q > p, keep the changes, otherwise randomly revert the changes with P = exp(-(E'-E)/T)
  if (Math.Pow(q / p, 1.0 / temperature) < random.NextDouble()) field[i, j] = !field[i, j];
```

So that explains the Metropolis algorithm implementation. We can now return our output image and call it a day

## Finally

```c#
//the end result
return field;
```

Don't forget to like and subscribe !
┳━┳ ヽ(ಠل͜ಠ)ノ

<div class ="convchain-example row">
<div class="left-panel col-sm">
  <h1 clas="row d-flex align-items-center justify-content-center">ConvChain GPU example</h1>

  <h2 class="row d-flex align-items-center justify-content-center">Sample pattern</h2>
  <div class="row ">
    <div class="col d-flex align-items-center justify-content-center">
      <div class="sample-container">
          <canvas id="samplePattern" width="8" height="8" style="position:absolute; top: 50%; left: 50%; transform:translate(-50%, -50%); width:80px; height:80px; image-rendering: pixelated;"></canvas>
      </div>
    </div>
  </div>
  <div class="row d-flex align-items-center justify-content-center">
  <button id="clear" class="col-xs-1" style="padding: 10px 0;"> Clear </button>
  </div>

  <h2>Options</h2>
  <form class ="flex-column align-items-center justify-content-center">
      <div class="field option">
          <label for="sampleWidth">Sample width</label>
          <input type="range" id="sampleWidth" min="4" max="24" step="1" value="8" />
          <span class="value">8</span>
      </div>
      <div class="field option">
          <label for="sampleHeight">Sample height</label>
          <input type="range" id="sampleHeight" min="4" max="24" step="1" value="8" />
          <span class="value">8</span>
      </div>
      <div class="field option">
          <label for="receptorSize">Receptor size (n)</label>
          <input type="range" id="receptorSize" min="2" max="4" step="1" value="3" />
          <span class="value">3</span>
      </div>
      <div class="field option">
          <label for="temperature">Temperature</label>
          <input type="range" id="temperature" min="0" max="0.5" value="0.01" step="0.001" />
          <span class="value">0.01</span>
      </div>
  </form>
</div>
<div class="right-panel col-sm">
  <h2>Generated patterns </h2> 
  (iteration #<span id="iteration">0 + 0000</span> changes)
  <div class="buttons">
    <button id="play">Start</button> <button id="next">Next</button> <button id="reset">Reset</button>
  </div>
  <div class="convchain-canvas"></div>

</div>

<script>
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ConvChainGPU = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const Context = require('./webgl2/context');

/**
 * ConvChainGPU constructor.
 *
 * @param {Array|Uint8Array} sample Sample pattern as a flat array or a 2D array.
 * @param {int} [sampleSize] Indicate the width and height of the sample when used with a flat array, if omitted assume the sample is a square
 * @constructor
 */
function ConvChainGPU (sample, sampleSize) {
  this.context = new Context();

  this.textureWeights = null;
  this.texturesField = null;

  this.width = 16;
  this.height = 16;

  this.createProgram();
  this.setSample(sample, sampleSize);
}

/**
 * Create the program used to execute the convchain algorithm.
 *
 * @private
 */
ConvChainGPU.prototype.createProgram = function () {
  this.program = this.context.createProgram(
    `
    in vec3 position;

    void main() {
        gl_Position = vec4(position, 1.0);
    }
    `,
    `
    layout(location = 0) out vec4 fragColor;

    uniform sampler2D weights;
    uniform sampler2D field;
    uniform vec2 resolution;
    uniform float temperature;
    uniform float n;
    uniform float iteration;
    uniform float seed;

    #define rng() fract(seed * iteration * iteration * 0.1981 + 1. + sin(seed * 1453. + dot(gl_FragCoord.xy, vec2(12.9898, 4.1414 + sin(seed * 4801. + iteration*0.1393)))) * 43758.5453)
    #define pixelPicking(n,coord,frame) (mod(floor(n*n*0.5+1.)*frame, n*n) == mod(floor(coord.x), n) + mod(floor(coord.y), n) * n)

    #define getFieldValue(coord) round(mod(texelFetch(field, ivec2(coord.xy), 0).r + 0.00001, 2.))
    #define getRawFieldValue(coord) round(texelFetch(field, ivec2(coord.xy), 0).r + 0.00001)
    #define getWeightValue(index) texelFetch(weights, ivec2(mod(index, 1024.), floor((index) / 1024.)), 0).r

    float convchain (vec2 coord) {
      float q = 1.;
      float value = getRawFieldValue(coord);

      for (float syo = 1. - n; syo <= n - 1.; syo++) {
        for (float sxo = 1. - n; sxo <= n - 1.; sxo++) {
          float ind = 0.;
          float difference = 0.;

          for (float dy = 0.; dy < n; dy++) {
            for (float dx = 0.; dx < n; dx++) {
              float power = pow(2., dy * n + dx);
              vec2 ncoord = mod(coord + vec2(sxo + dx, syo + dy) + resolution.xy, resolution.xy);

              float nvalue = getFieldValue(ncoord);

              ind = ind + nvalue * power;

              if (ncoord.xy == coord.xy) {
                difference = mix(-power, power, nvalue);
              }
            }
          }

          q = q * getWeightValue(ind - difference) / getWeightValue(ind);
        }
      }

      if (value < 1.5 && pow(q, 1. / temperature) > rng()) {
        value = abs(value - 1.);
      }

      return value;
    }

    void main () {
      fragColor = pixelPicking(n, gl_FragCoord, iteration) ?
        vec4(convchain(floor(gl_FragCoord.xy)), 0., 0., 1.) :
        vec4(getRawFieldValue(floor(gl_FragCoord.xy)), 0., 0., 1.);
    }
    `,
    {
      resolution: '2f',
      weights: 't',
      field: 't',
      temperature: 'f',
      n: 'f',
      iteration: 'f',
      seed: 'f'
    }
  );
};

/**
 * Set the sample pattern
 * @param {Array|Uint8Array} sample Sample pattern as a flat array or a 2D array
 * @param {int|Array} [sampleSize] When used with a flat array indicate the width and height of the sample, if omitted assume the sample is a square
 *
 * @return {ConvChainGPU} Return self.
 */
ConvChainGPU.prototype.setSample = function (sample, sampleSize) {
  if (typeof sample[0] === 'number') {
    // assume flat array
    this.sample = sample;

    if (!sampleSize) {
      // assume square sample

      this.sampleWidth = this.sampleHeight = Math.sqrt(sample.length) | 0;
    } else {
      this.sampleWidth = typeof sampleSize === 'number' ? sampleSize : sampleSize[0];
      this.sampleHeight = typeof sampleSize === 'number' ? sampleSize : sampleSize[1];
    }
  } else {
    // assume 2D array
    this.sampleWidth = sample[0].length;
    this.sampleHeight = sample.length;

    const flatArray = new Uint8Array(this.sampleWidth * this.sampleHeight);

    for (let y = 0; y < this.sampleHeight; y++) {
      for (let x = 0; x < this.sampleWidth; x++) {
        flatArray[x + y * this.sampleWidth] = sample[y][x];
      }
    }

    this.sample = flatArray;
  }

  // invalidate cached weights
  this.cachedN = null;

  return this;
};

function processWeights (context, sample, sampleWidth, sampleHeight, n) {
  const count = (1 << (n * n)); //equivalent to 2^n^n.
  const width = Math.min(1024, count);
  const height = Math.max(1, count / width); 

  const weights = new Float32Array(4 * width * height);

  function pattern (fn) { //utility function for rotation, reflection, etc
    const result = new Array(n * n);

    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        result[x + y * n] = fn(x, y);
      }
    }

    return result;
  }

  function rotate (p) {
    return pattern(function (x, y) { return p[n - 1 - y + x * n]; });
  }

  function reflect (p) {
    return pattern(function (x, y) { return p[n - 1 - x + y * n]; });
  }

  function index (p) {
    let result = 0;
    let power = 1;

    for (let i = 0; i < p.length; i++) {
      result += p[p.length - 1 - i] ? power : 0;
      power *= 2;
    }

    return result;
  }

  for (let y = 0; y < sampleHeight; y++) {
    for (let x = 0; x < sampleWidth; x++) {
      const p0 = pattern(function (dx, dy) { return sample[((x + dx) % sampleWidth) + ((y + dy) % sampleHeight) * sampleHeight]; });
      const p1 = rotate(p0);
      const p2 = rotate(p1);
      const p3 = rotate(p2);
      const p4 = reflect(p0);
      const p5 = reflect(p1);
      const p6 = reflect(p2);
      const p7 = reflect(p3);

      weights[index(p0) * 4] += 1;
      weights[index(p1) * 4] += 1;
      weights[index(p2) * 4] += 1;
      weights[index(p3) * 4] += 1;
      weights[index(p4) * 4] += 1;
      weights[index(p5) * 4] += 1;
      weights[index(p6) * 4] += 1;
      weights[index(p7) * 4] += 1;
    }
  }

  for (let k = 0; k < count; k++) {
    if (weights[k * 4] <= 0) {
      weights[k * 4] = 0.1;
    }
  }

  return context.createTextureFromArray(weights, width, height, false);
}

/**
 * Get the weights for the sample pattern and the given receptor size.
 *
 * @param {int} n Receptor size, an integer in the range [2, 4].
 * @returns {Texture}
 * @private
 */
ConvChainGPU.prototype.getWeights = function (n) {
  if (n < 2 || n > 4) {
    throw new Error('ConvChainGPU: the receptor size must be in the [2, 4] range.')
  }
  // check if we have to generate new weights, otherwise return cached result
  if (this.cachedN !== n) {
    if (this.textureWeights) {
      this.textureWeights.dispose();
    }

    this.cachedN = n;
    this.textureWeights = processWeights(this.context, this.sample, this.sampleWidth, this.sampleHeight, n);
  }

  return this.textureWeights;
};

function generateBaseField (ctx, resultWidth, resultHeight) {
  const field = new Float32Array(resultWidth * resultHeight * 4);

  for (let i = 0; i < resultWidth * resultHeight; i++) {
    field[i * 4] = Math.random() < 0.5; // R
  }

  return [
    ctx.createTextureFromArray(field, resultWidth, resultHeight, true),
    ctx.createTextureFromArray(field, resultWidth, resultHeight, true)
  ];
}

/**
 * Set the field ConvChain should be applied on.
 *
 * @param {int} width Width of the field.
 * @param {int} height Height of the field.
 * @param {Uint8Array|Array} [values] Values to populate the field with.
 * @returns {ConvChainGPU} Return self.
 * @public
 */
ConvChainGPU.prototype.setField = function (width, height, values) {
  if (values && values.length !== width * height) {
    throw new Error('ConvChainGPU: Incorrect size for provided values.');
  }

  if (width < 4) {
    throw new Error('ConvChainGPU: Field width must be > 3.');
  }

  if (height < 4) {
    throw new Error('ConvChainGPU: Field height must be > 3.');
  }

  if (this.texturesField) {
    this.texturesField[0].dispose();
    this.texturesField[1].dispose();
    this.texturesField = null;
  }

  this.iteration = 0;
  this.width = width | 0;
  this.height = height | 0;

  if (values) {
    const field = new Float32Array(this.width * this.height * 4);

    for (let i = 0; i < this.width * this.height; i++) {
      field[i * 4] = Math.max(0, Math.round(values[(i % this.width) + (this.height - (i / this.width | 0) - 1) * this.width])); // R
    }

    this.texturesField = [
      this.context.createTextureFromArray(field, this.width, this.height, true),
      this.context.createTextureFromArray(field, this.width, this.height, true)
    ];
  }

  return this;
};

/**
 * Apply ConvChain on the field.
 *
 * @param {int} iterations Number of iterations to execute.
 * @param {int} n Receptor size, an integer in the range [2,4].
 * @param {float} temperature Temperature.
 * @param {float} [seed=0] Seed.
 * @returns {Texture} Generated pattern, returned as an object with the following methods : getUint8Array and getTexture.
 * @public
 */
ConvChainGPU.prototype.iterate = function (iterations, n, temperature, seed) {
  if (this.texturesField === null) {
    this.texturesField = generateBaseField(this.context, this.width, this.height);
  }

  seed = seed || 0;

  const textureWeights = this.getWeights(n);

  let frontTexture;
  let backTexture;

  for (let i = 0; i < iterations; i++) {
    frontTexture = this.texturesField[this.iteration%2];
    backTexture = this.texturesField[(this.iteration+1)%2];

    this.context.draw(
      this.program,
      {
        field: backTexture,
        weights: textureWeights,
        resolution: [this.width, this.height],
        temperature: temperature,
        n: n,
        iteration: this.iteration,
        seed: seed
      },
      frontTexture
    );

    this.iteration++;
  }

  return frontTexture;
};

/**
 * Free all the WebGL resources used by this instance.
 */
ConvChainGPU.prototype.dispose = function () {
  if (this.context) {
    if (this.texturesField) {
      this.texturesField[0].dispose();
      this.texturesField[1].dispose();
    }

    if (this.textureWeights) {
      this.textureWeights.dispose();
    }

    this.program.dispose();

    this.context.dispose();

    this.texturesField = null;
    this.context = null;
    this.textureWeights = null;
    this.program = null;
  }
};

/**
 * Returns whether the current environment supports all the feature necessary to use ConvChainGPU.
 *
 * @returns {boolean}
 */
ConvChainGPU.isSupported = function () {
  return Context.isSupported();
};

module.exports = ConvChainGPU;
},{"./webgl2/context":2}],2:[function(require,module,exports){
"use strict";

const Texture = require('./texture');
const Program = require('./program');

const planePositions = new Float32Array([-1, -1, 0, -1, 4, 0, 4, -1, 0]);

/**
 *
 * @constructor
 */
function Context () {
  this.canvas = document.createElement('canvas');
  this.width = this.canvas.width = this.height = this.canvas.height = 32;

  const options = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    premultipliedAlpha: false,
    preserveDrawingBuffer: false
  };

  this.context = this.canvas.getContext('webgl2', options);
  this.context.getExtension('EXT_color_buffer_float');

  this.context.disable(this.context.DITHER);
  this.context.disable(this.context.DEPTH_TEST);
  this.context.disable(this.context.BLEND);

  // 1x1 opaque black texture
  this.defaultTexture = this.context.createTexture();
  this.context.bindTexture(this.context.TEXTURE_2D, this.defaultTexture);
  this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, 1, 1, 0, this.context.RGBA, this.context.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 1]));
  this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
  this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);

  this.positionBuffer = this.context.createBuffer();
  this.context.bindBuffer(this.context.ARRAY_BUFFER, this.positionBuffer);
  this.context.bufferData(this.context.ARRAY_BUFFER, planePositions, this.context.STATIC_DRAW);
}

/**
 * Update the size of the canvas.
 */
Context.prototype.setCanvasSize = function (width, height) {
  this.width = this.canvas.width = width;
  this.height = this.canvas.height = height;
  this.context.viewport(0, 0, this.width, this.height);
};

/**
 * Draw using the given program.
 *
 * @param {Program} program
 * @param {object} uniforms
 * @param {Texture|null}target
 */
Context.prototype.draw = function (program, uniforms, target) {
  if (target) {
    this.context.viewport(0, 0, target.width, target.height);
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, target.getFrameBuffer());
  } else {
    this.context.viewport(0, 0, this.width, this.height);
    this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
  }

  if (this.lastUsedProgram !== program) {
    this.context.useProgram(program.getProgram());
    this.lastUsedProgram = program;
  }

  for (let i = 0; i < program.uniformsInfo.length; i++) {
    const uniform = program.uniformsInfo[i];
    const typeOfValue = typeof uniforms[uniform.id];
    const uniformValue = typeOfValue === 'undefined' ? uniform.defaultValue : uniforms[uniform.id];

    this.context[uniform.method].apply(this.context, [uniform.location].concat(uniformValue));
  }

  for (let i = 0; i < program.texturesInfo.length; i++) {
    const texture = program.texturesInfo[i];
    const textureValue = uniforms[texture.id];

    this.context.activeTexture(texture.textureUnit);
    this.context.bindTexture(this.context.TEXTURE_2D, textureValue && textureValue.isReady() ? textureValue.getTexture() : this.defaultTexture);
    this.context.uniform1i(texture.location, texture.textureNumber);
  }

  this.context.vertexAttribPointer(program.positionAttribute, 3, this.context.FLOAT, false, 0, 0);

  this.context.drawArrays(this.context.TRIANGLES, 0, 3);

  this.context.finish();
};

/**
 * Load an standard texture from an url.
 *
 * @param {string} url
 *
 * @returns {Texture}
 */
Context.prototype.loadTextureImage = function(url) {
  const texture = new Texture(this.context);

  const img = document.createElement('img');
  img.onload = () => {
    texture.initializeFromImage(img);
  };
  img.src = url;

  return texture;
};

/**
 * Create a texture from an array of values.
 *
 * @param {Float32Array} floatArray
 * @param {int} width
 * @param {int} height
 * @param {boolean} withFrameBuffer
 *
 * @returns {Texture}
 */
Context.prototype.createTextureFromArray = function (floatArray, width, height, withFrameBuffer) {
  const texture = new Texture(this.context);

  texture.initializeFromArray(floatArray, width, height, withFrameBuffer);

  return texture;
};

/**
 * Create program.
 *
 * @param {string} vertexShader
 * @param {string} fragmentShader
 * @param {object} uniforms
 *
 * @returns {Program}
 */
Context.prototype.createProgram = function (vertexShader, fragmentShader, uniforms) {
  return new Program(this.context, vertexShader, fragmentShader, uniforms);
};


Context.prototype.dispose = function () {
  const loseContextExt = this.context.getExtension('WEBGL_lose_context');

  this.context.deleteBuffer(this.positionBuffer);

  if (loseContextExt) {
    loseContextExt.loseContext();
  }

  this.positionBuffer = null;
  this.context = null;
};

/**
 * Check whether WebGl is supported on the device.
 *
 * @returns {boolean}
 */
Context.isSupported = function () {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;

  const context = canvas.getContext('webgl2');
  const colorBufferFloatExt = context ? context.getExtension('EXT_color_buffer_float') : null;
  const loseContextExt = context ? context.getExtension('WEBGL_lose_context') : null;

  const success = !!context && !!colorBufferFloatExt;

  if (loseContextExt) {
    loseContextExt.loseContext();
  }

  return success;
};

module.exports = Context;
},{"./program":3,"./texture":4}],3:[function(require,module,exports){
"use strict";

const types = {
  'f': {
    method: 'uniform1f',
    defaultValue: 0
  },
  '2f': {
    method: 'uniform2f',
    defaultValue: [0, 0]
  },
  '3f': {
    method: 'uniform3f',
    defaultValue: [0, 0, 0]
  },
  '4f': {
    method: 'uniform4f',
    defaultValue: [0, 0, 0, 0]
  }
};

/**
 *
 * @param {WebGLRenderingContext} context
 * @param {string} vertexShaderSrc
 * @param {string} fragmentShaderSrc
 * @param {object} uniforms
 * @param {object} defines
 *
 * @constructor
 */
function Program (context, vertexShaderSrc, fragmentShaderSrc, uniforms, defines) {
  this.context = context;
  this.initialize(vertexShaderSrc, fragmentShaderSrc, uniforms, defines);
}

/**
 * Initialize the shaders and program.
 *
 * @param {string} vertexShaderSrc
 * @param {string} fragmentShaderSrc
 * @param {object} uniforms
 * @param {object} defines
 *
 * @protected
 */
Program.prototype.initialize = function (vertexShaderSrc, fragmentShaderSrc, uniforms) {
  const quality = 'highp';

  vertexShaderSrc = `#version 300 es
    precision ${quality} float;
    precision ${quality} int;

    ${vertexShaderSrc}
  `;

  fragmentShaderSrc = `#version 300 es
    precision ${quality} float;
    precision ${quality} int;
    precision ${quality} sampler2D;

    ${fragmentShaderSrc}
  `;

  this.vertexShader = this.createShader(this.context.VERTEX_SHADER, vertexShaderSrc);
  this.fragmentShader = this.createShader(this.context.FRAGMENT_SHADER, fragmentShaderSrc);
  this.program = this.context.createProgram();

  this.context.attachShader(this.program, this.vertexShader);
  this.context.attachShader(this.program, this.fragmentShader);

  this.context.linkProgram(this.program);
  //this.context.validateProgram(this.program); //throw warning in firefox on mac

  //if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS)) {
  //  throw new Error('Could not initialise shaders: ' + this.context.getProgramInfoLog(this.program));
  //}

  const uniformsKeys = Object.keys(uniforms);
  this.uniformsInfo = [];
  this.texturesInfo = [];
  let textureNumber = 0;

  for (let i = 0; i < uniformsKeys.length; i++) {
    const uniform = uniformsKeys[i];
    const type = uniforms[uniform];

    if (type === 't') {
      this.texturesInfo.push({
        id: uniform,
        textureNumber: textureNumber,
        textureUnit: this.context['TEXTURE' + textureNumber],
        location: this.context.getUniformLocation(this.program, uniform)
      });

      textureNumber++;
    } else {
      this.uniformsInfo.push({
        id: uniform,
        method: types[type].method,
        defaultValue: types[type].defaultValue,
        location: this.context.getUniformLocation(this.program, uniform)
      });
    }
  }

  this.positionAttribute = this.context.getAttribLocation(this.program, 'position');
  this.context.enableVertexAttribArray(this.positionAttribute);
};


/**
 * Create a shader.
 *
 * @param {int} type FRAGMENT_SHADER or VERTEX_SHADER
 * @param {string} src Source of the shader
 * @returns {WebGLShader}
 */
Program.prototype.createShader = function (type, src) {
  const shader = this.context.createShader(type);
  this.context.shaderSource(shader, src);
  this.context.compileShader(shader);

  if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
    throw new Error('Error creating shader : ' + this.context.getShaderInfoLog(shader) + '\n' + src);
  }

  return shader;
};

/**
 * Retrieve the WebGLProgram.
 *
 * @returns {WebGLProgram}
 * @public
 */
Program.prototype.getProgram = function () {
  return this.program;
};

/**
 * Free the resources used for the program.
 *
 * @public
 */
Program.prototype.dispose = function () {
  this.context.deleteProgram(this.program);
  this.context.deleteShader(this.vertexShader);
  this.context.deleteShader(this.fragmentShader);

  this.program = null;
  this.vertexShader = null;
  this.fragmentShader = null;
  this.context = null;
};

module.exports = Program;
},{}],4:[function(require,module,exports){
"use strict";

/**
 *
 * @param {WebGLRenderingContext} context
 *
 * @constructor
 */
function Texture (context) {
  this.context = context;
  this.ready = false;
  this.floatArray = null;
}

/**
 * Initialize the texture with a loaded image.
 *
 * @param img
 */
Texture.prototype.initializeFromImage = function (img) {
  if (this.context !== null) {
    this.width = img.naturalWidth || img.width;
    this.height = img.naturalHeight || img.height;
    this.texture = this.context.createTexture();
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, true);
    this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA, this.context.RGBA, this.context.UNSIGNED_BYTE, img);
    this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, false);

    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.LINEAR);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.LINEAR);

    this.context.bindTexture(this.context.TEXTURE_2D, null);
    this.ready = true;
  }
};

/**
 * Initialize the texture with an array of float values.
 *
 * @param {Float32Array} floatArray
 * @param {int} width
 * @param {int} height
 * @param {boolean} withFrameBuffer
 */
Texture.prototype.initializeFromArray = function (floatArray, width, height, withFrameBuffer) {
  if (this.context !== null) {
    this.width = width;
    this.height = height;
    this.texture = this.context.createTexture();
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, false);
    this.context.texImage2D(this.context.TEXTURE_2D, 0, this.context.RGBA32F, this.width, this.height, 0, this.context.RGBA, this.context.FLOAT, floatArray);

    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);

    if (withFrameBuffer) {
      this.frameBuffer = this.context.createFramebuffer();
      this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.frameBuffer);
      this.context.framebufferTexture2D(this.context.FRAMEBUFFER, this.context.COLOR_ATTACHMENT0, this.context.TEXTURE_2D, this.texture, 0);
      this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);
    }

    this.context.bindTexture(this.context.TEXTURE_2D, null);
    this.ready = true;
  }
};

/**
 * Retrieve the result as a Uint8Array.
 *
 * @returns {Uint8Array}
 * @public
 */
Texture.prototype.getUint8Array = function () {
  const floatArrayLength = 4 * this.width * this.height;
  const floatArray = (this.floatArray && this.floatArray.length === floatArrayLength) ? this.floatArray : new Float32Array(4 * this.width * this.height);
  const resultArray = new Uint8Array(this.width * this.height);

  this.context.bindFramebuffer(this.context.FRAMEBUFFER, this.frameBuffer);
  this.context.readPixels(0, 0, this.width, this.height, this.context.RGBA, this.context.FLOAT, floatArray, 0);
  this.context.bindFramebuffer(this.context.FRAMEBUFFER, null);

  for (let i = 0; i < resultArray.length; i++) {
    resultArray[(i % this.width) + (this.height - (i / this.width | 0) - 1) * this.width] = Math.round(floatArray[i * 4]);
  }

  this.floatArray = floatArray;

  return resultArray;
};

/**
 * Check whether the texture is ready to be used.
 *
 * @returns {boolean|*}
 */
Texture.prototype.isReady = function () {
  return this.ready;
};

/**
 * Return the texture.
 *
 * @returns {WebGLTexture|null}
 */
Texture.prototype.getTexture = function () {
  return this.texture;
};

/**
 * Return the framebuffer
 *
 * @returns {WebGLFramebuffer}
 */
Texture.prototype.getFrameBuffer = function () {
  return this.frameBuffer;
};

/**
 * Free the resources used for the texture.
 *
 * @public
 */
Texture.prototype.dispose = function () {
  if (this.frameBuffer) {
    this.context.deleteFramebuffer(this.frameBuffer);
  }

  this.context.deleteTexture(this.texture);

  this.texture = null;
  this.frameBuffer = null;
  this.context = null;
};

module.exports = Texture;
},{}]},{},[1])(1)
});
if(!ConvChainGPU.isSupported()) {

  alert('Your browser does not implement the required features to run ConvChainGPU');

} else {

  const options = {
    receptorSize: 3,
    temperature: 0.01,
    changes: 32,
    sampleWidth: 8,
    sampleHeight: 8,
    useTiles: 0
  };

  let previousSampleWidth = 8;
  let previousSampleHeight = 8;

  let sample = [
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1
  ]; //2D array

  const convchain = new ConvChainGPU(sample);
  convchain.setField(40, 40);
  document.querySelector('.convchain-canvas').appendChild(convchain.context.canvas);

  var samplePattern = document.getElementById('samplePattern'),
    sampleContext = samplePattern.getContext('2d'),
    drawMode = null;

  var resizeSample = function resizeSample () {
    var previousTestSample = sample;

    samplePattern.width = options.sampleWidth;
    samplePattern.height = options.sampleHeight;

    samplePattern.style.width = options.sampleWidth * 10 + 'px';
    samplePattern.style.height = options.sampleHeight * 10 + 'px';

    sample = new Array(options.sampleWidth * options.sampleHeight);

    sampleContext.fillStyle = '#000000';
    sampleContext.fillRect(0, 0, options.sampleWidth, options.sampleHeight);
    sampleContext.fillStyle = '#FFFFFF';

    for (var x = 0; x < options.sampleWidth; x++) {
      for (var y = 0; y < options.sampleHeight; y++) {
        if (x < previousSampleWidth && y < previousSampleHeight && previousTestSample[x + y * previousSampleWidth]) {
          sample[x + y * options.sampleWidth] = 1;
          sampleContext.fillRect(x, y, 1, 1);
        } else {
          sample[x + y * options.sampleWidth] = 0;
        }
      }
    }

    previousSampleWidth = options.sampleWidth;
    previousSampleHeight = options.sampleHeight;

    convchain.setSample(sample, [options.sampleWidth, options.sampleHeight]);
  };

  resizeSample();

  samplePattern.addEventListener('mousedown', function (e) {
    const x = e.offsetX / 10 | 0;
    const y = e.offsetY / 10 | 0;

    drawMode = (!sample[x + y * options.sampleWidth] ? 1 : 0);

    sample[x + y * options.sampleWidth] = drawMode;

    sampleContext.fillStyle = drawMode ? "#FFFFFF" : "#000000";

    sampleContext.fillRect(x, y, 1, 1);
  });

  function stopDrawMode () {
    if (drawMode !== null) {
      drawMode = null;
      convchain.setSample(sample, [options.sampleWidth, options.sampleHeight]);
    }
  }

  samplePattern.addEventListener('mouseup', stopDrawMode);
  samplePattern.addEventListener('mouseleave', stopDrawMode);

  samplePattern.addEventListener('mousemove', function (e) {
    if (drawMode !== null) {
      var x = e.offsetX / 10 | 0,
        y = e.offsetY / 10 | 0;

      sample[x + y * options.sampleWidth] = drawMode;
      sampleContext.fillRect(x, y, 1, 1);
    }
  });

  document.getElementById('clear').addEventListener('click', function () {
    for (var i = 0; i < sample.length; i++) {
      sample[i] = 0;
    }

    sampleContext.fillStyle = '#000000';
    sampleContext.fillRect(0, 0, options.sampleWidth, options.sampleHeight);

    convchain.setSample(sample, [options.sampleWidth, options.sampleHeight]);
  });

  var textureTiles1 = convchain.context.loadTextureImage('./dungeon_tiles-reduced.png');
  var textureTiles2 = convchain.context.loadTextureImage('./dungeon_tiles-reduced2.png');

  var program = convchain.context.createProgram(
    `
    in vec3 position;

    void main() {
      gl_Position = vec4(position, 1.0);
    }
    `,
    `
    #define rng() fract(40.3299 * sin(dot(floor(gl_FragCoord.xy / 16.), vec2(5.43939, 4.4938))))
    #define value(x, y) (mod(texelFetch(backgroundTexture, ivec2(gl_FragCoord.xy / 16.) + ivec2(x, y), 0).r + 0.0001, 2.) > 0.5)

    layout(location = 0) out vec4 fragColor;

    uniform sampler2D backgroundTexture;
    uniform sampler2D textureTiles;
    uniform vec2 resolution;
    uniform float useTiles;

    const ivec2 voidTile = ivec2(3, 0);
    const ivec2 voidTileVar1 = ivec2(4, 0);
    const ivec2 fallTile = ivec2(0, 1);
    const ivec2 fallTileVar1 = ivec2(1, 1);
    const ivec2 groundTile = ivec2(1, 3);
    const ivec2 groundTileVar1 = ivec2(3, 5);

    const ivec2 cornerDL = ivec2(0, 2);
    const ivec2 edgeD = ivec2(1, 2);
    const ivec2 edgeDVar1 = ivec2(2, 2);
    const ivec2 edgeDVar2 = ivec2(3, 2);
    const ivec2 cornerDR = ivec2(4, 2);

    const ivec2 edgeL = ivec2(0, 5);
    const ivec2 edgeLVar1 = ivec2(0, 4);
    const ivec2 edgeLVar2 = ivec2(0, 3);

    const ivec2 edgeR = ivec2(4, 5);
    const ivec2 edgeRVar1 = ivec2(4, 4);
    const ivec2 edgeRVar2 = ivec2(4, 3);

    const ivec2 cornerUL = ivec2(0, 6);
    const ivec2 edgeU = ivec2(1, 6);
    const ivec2 edgeUVar1 = ivec2(2, 6);
    const ivec2 edgeUVar2 = ivec2(3, 6);
    const ivec2 cornerUR = ivec2(4, 6);

    const ivec2 lineV = ivec2(5, 5);
    const ivec2 lineH = ivec2(6, 6);

    const ivec2 endL = ivec2(0, 0);
    const ivec2 endR = ivec2(1, 0);
    const ivec2 endU = ivec2(5, 2);
    const ivec2 endD = ivec2(5, 1);
    const ivec2 isolated = ivec2(2, 0);

    ivec2 map () {
      float r = rng();
      bool valueSelf = value(0, 0);
      bool valueBottom = value(0, -1);
      bool valueUp = value(0, 1);
      bool valueLeft = value(-1, 0);
      bool valueRight = value(1, 0);

      if (!valueSelf) {
        return valueUp ? (r < 0.97 ? fallTile : fallTileVar1) : (r < 0.97 ? voidTile : voidTileVar1);
      } else {
        if (!valueBottom && valueUp && valueLeft && valueRight) {
          return r < 0.9 ? edgeD : (r < 0.95 ? edgeDVar1 : edgeDVar2);
        }

        if (!valueUp && valueBottom && valueLeft && valueRight) {
          return r < 0.9 ? edgeU : (r < 0.95 ? edgeUVar1 : edgeUVar2);
        }

        if (!valueLeft && valueUp && valueBottom && valueRight) {
          return r < 0.9 ? edgeL : (r < 0.95 ? edgeLVar1 : edgeLVar2);
        }

        if (!valueRight && valueUp && valueBottom && valueLeft) {
          return r < 0.9 ? edgeR : (r < 0.95 ? edgeRVar1 : edgeRVar2);
        }

        if (!valueLeft && !valueUp && valueBottom && valueRight) {
          return cornerUL;
        }

        if (!valueLeft && !valueBottom && valueUp && valueRight) {
          return cornerDL;
        }

        if (!valueRight && !valueUp && valueBottom && valueLeft) {
          return cornerUR;
        }

        if (!valueRight && !valueBottom && valueUp && valueLeft) {
          return cornerDR;
        }

        if (valueRight && !valueLeft && !valueUp && !valueBottom) {
          return endL;
        }

        if (valueLeft && !valueRight && !valueUp && !valueBottom) {
          return endR;
        }

        if (valueBottom && !valueLeft && !valueUp && !valueRight) {
          return endU;
        }

        if (valueUp && !valueRight && !valueLeft && !valueBottom) {
          return endD;
        }

        if (!valueLeft && !valueRight && !valueUp && !valueBottom) {
          return isolated;
        }

        if (valueLeft && valueRight && !valueUp && !valueBottom) {
          return lineH;
        }

        if (!valueLeft && !valueRight && valueUp && valueBottom) {
          return lineV;
        }
      }

      return r < 0.97 ? groundTile : groundTileVar1;
    }

    void main () {
      if (useTiles > 0.5) {
        ivec2 inTileCoord = ivec2(mod(gl_FragCoord.xy, vec2(16.)));
        fragColor = texelFetch(textureTiles, map() * 16 + inTileCoord, 0);
      } else {
        fragColor = vec4(vec3(value(0, 0)), 1.);
      }
    }
    `,
    {
      backgroundTexture: 't',
      textureTiles: 't',
      resolution: '2f',
      useTiles: 'f'
    }
  );

  convchain.context.setCanvasSize(40 * 16, 40 * 16);

  var display = function display () {
    convchain.context.draw(program, {
      resolution: [convchain.width, convchain.height],
      backgroundTexture: texture,
      textureTiles: options.useTiles > 1 ? textureTiles2 : textureTiles1,
      useTiles: 0
    }, null);
  };

  var iterationElement = document.getElementById('iteration');

  var texture = null;
  var i = 0;
  var iterating = false;
  var forceDisplay = false;
  var changed = false;

  document.getElementById('reset').addEventListener('click', function () {
    texture = null;
    changed = false;
    i = 0;
    iterationElement.innerText = '0 + 0000';
    convchain.setField(40, 40);
  });

  document.getElementById('play').addEventListener('click', function () {
    iterating = !iterating;
    document.getElementById('play').innerText = iterating ? 'Stop' : 'Start';
  });

  document.getElementById('next').addEventListener('click', function () {
    iterating = false;
    _compute();
    _display();
  });

  function _compute () {
    texture = convchain.iterate(1, options.receptorSize, options.temperature);
    i += Math.pow(40 / options.receptorSize, 2) | 0;
  }

  function _display () {
    var remainder = (i % (40 * 40));
    iterationElement.innerText = (i / (40 * 40) | 0) + ' + ' + '0000'.substr(0, 4 - remainder.toString().length) + remainder;
    display();
  }

  var loop = function loop () {
    requestAnimationFrame(loop);
    if (iterating) {
      _compute();
    }

    if (iterating || forceDisplay) {
      _display();
      forceDisplay = false;
    }
  };

  requestAnimationFrame(loop);

  var inputs = document.querySelectorAll('.field input');

  for (let input of inputs) {
    const valueLabel = input.parentNode.querySelector('.value');
    const option = input.id;

    input.addEventListener('input', function () {
      options[option] = parseFloat(input.value);

      if (option === 'sampleWidth' || option === 'sampleHeight') {
        resizeSample();
      }

      if (option === 'useTiles') {
        forceDisplay = true;
        valueLabel.innerText = options[option] ? 'Tile set #' + options[option] : 'None';
      } else {
        valueLabel.innerText = input.value;
      }
    });
  }

}
</script>

<link
  defer
  rel="stylesheet"
  href="{{ '/assets/css/convchain.css' | relative_url | bust_file_cache }}"
>
