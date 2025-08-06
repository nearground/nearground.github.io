---
layout: post
gisqus_comments: "true"
title: An Interactive 3d Sample Generator
date: 2025-08-05T0:37:00.000-07:00
description: Generating samples for statistical exercises
tags: linear-algebra
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/samples.gif
---

## Singular Value Decomposition: Warding off curses

Statistics deals with finding order out of chaos. Sometimes, estimating variables is easy
Oftentimes we find ourselves with more data than we know what to do with it. With more variables, more information. However, with more variables, there is also exponentially more complexity. This is called the _CURSE OF DIMENSIONALITY_. In order to avoid this fate, we use techniques for _dimensionality reduction_. That is, reducing the amount of variables down to just the most important ones. The techniques for achieving this fall under the umbrella of what is termed _Spectral Theory_. Spooky, but not so cursed.

## A three-dimensional example

In this example, we randomly sample from a multivariate (many-variable) normal (continuous, linear) distribution. In order to not just get random noise, I added the option to input a covariance matrix. This means that each row represents how each variable depends on the other two variables. For each sample point, three independent uniformly-distributed variables from -1 to 1 are first put through the _Mersenne Twister_ algorithm to generate normally-distributed samples, and then correlated via the _Cholesky decomposition_ of the covariance matrix to form a linear multivariate distribution. That is to say, the three-dimensional sample points are stretched and rotated according to whatever you put into the matrix. I made this app using browser javascript, but it's pretty computationally efficient. Feel free to give it a go! You can left-click and drag to pan around the axis center, and right-click drag to move the camera's center.

<div class= "row mt-3 mt-md-0">
  <div class ="left-column col-sm">
    <div class= "row">
      <div class="col-sm-3 mt-3 mt-md-0">
        <label class= "row" for="sample-mean">Means:</label>
        <label class= "row" for="sample-size">Sample Size:</label>
      </div>
      <div class="col">
        <div class="row">
          <input type="number" id="x-mean" value="0" style="width: 50px;">
          <input type="number" id="y-mean" value="0" style="width: 50px;">
          <input type="number" id="z-mean" value="0" style="width: 50px;">
        </div>
        <input type="number" class="row" id="sample-size" min="1" value="1000" style="width: 50px">
      </div>
    </div> 
    <div>Covariance matrix</div>
    <table>
      <tbody id="covariance-matrix">
        <!-- Rows and cells will be dynamically generated -->
      </tbody>
    </table>
    <button id="addPoints" onclick="addPointsAndAxes()">Generate samples</button>
    <button id="removePoints" onclick="clearPointsOnly()">Clear samples</button>
  </div>

  <div class = "right-column col-sm">
    <div class="row">
      <div id="eigenvectors">
      <div id="eigenvalues">
    </div>

  </div>

</div>

<div id="sample-canvas" style="max-width: 100%; aspect-ratio: 1 / 1;"></div>

<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.179.1/build/three.module.min.js",
      "three/addons/": "https://unpkg.com/three@0.179.1/examples/jsm/"
    }
  }
</script>

<script
    defer
    src="{{ site.third_party_libraries.pca-js.url.js }}"
    integrity="{{ site.third_party_libraries.pca-js.integrity.js }}"
    crossorigin="anonymous">
    </script>
<script
    defer
    src="{{ site.third_party_libraries.math.url.js }}"
    integrity="{{ site.third_party_libraries.math.integrity.js }}"
    crossorigin="anonymous">
    </script>

<link
  defer
  rel="stylesheet"
  href="{{ '/assets/css/pca-3d.css' | relative_url | bust_file_cache }}"
>

<script src="{{ '/assets/js/math/multivariatenormal.js' | relative_url | bust_file_cache }}"></script>

<script defer src="{{ '/assets/js/pca-example-full.js' | relative_url | bust_file_cache }}" type="module" ></script>
