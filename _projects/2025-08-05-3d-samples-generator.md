---
layout: post
gisqus_comments: "true"
title: An Interactive PCA visualizer
date: 2025-08-05T0:37:00.000-07:00
description: Visualizing principal components in 3D space.
tags: linear-algebra
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/samples.gif
toc:
  sidebar: "left"
category: fun
---

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
          <input type="number" id="x-mean" value="5" style="width: 50px;">
          <input type="number" id="y-mean" value="7" style="width: 50px;">
          <input type="number" id="z-mean" value="-5" style="width: 50px;">
        </div>
        <input type="number" class="row" id="sample-size" min="1" value="1000" style="width: 150px">
      </div>
    </div> 
    <div>Covariance matrix (positive numbers only)</div>
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
