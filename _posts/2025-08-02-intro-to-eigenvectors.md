---
layout: post
gisqus_comments: "true"
title: Intro to Eigenvectors
date: 2025-08-03T0:37:00.000-07:00
description: With an interactive app
tags: linear-algebra
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/eigenvector.jpg
---

# Eigenvalues and Eigenvectors

Consider a square matrix of size n. The eigenvectors of the matrix describe the directions over which the datapoints are scaled (e.g. only stretch or shrink without changing their direction) when a linear transformation is applied to them. Mathematically speaking, they are vectors such that Av = λv, where λ is a scalar. This number is called its eigenvalue, and represents the amount by which they stretch.

To find the eigenvectors of a matrix, first find the eigenvalues by solving the characteristic equation `det(A - λI) = 0`, where A is the matrix, λ is the eigenvalue, I is the identity matrix, and **0** is the zero vector.
Knowing the eigenvalues, we then solve for `(A-λI)x=0`, where the possible solutions for the vector x are the eigenvectors.

<div class="row mt-3 mt-md-0 rounded mx-auto d-block">
  {% include figure.liquid path="assets/img/eigenvector.jpg" title="stretched dog" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
Woo-o-f!
</div>

Check out this set of exercises on calculating eigenvalues from [Libretexts.org](<https://math.libretexts.org/Courses/Cosumnes_River_College/Math_420%3A_Differential_Equations_(Breitenbach)/11%3A_Appendices/06%3A_Eigenvalues_and_Eigenvectors/6.01%3A_Exercises_4.1>). If you want to cheat, I've included a solver that somewhat works most of the time.

<div class= "row">
  <div class ="left-column col-sm">
    <label for="matrix-rows">Matrix size:</label>
    <input type="number" id="matrix-size" min="1" value="3" style="width: 50px;">
    <button id="matrix-submit">Update Size</button>
    <div id="matrix-container"></div>
    <button id="solve-matrix">Get eigenvectors</button>
  </div>

  <div class = "right-column col-sm">
    <div class="row">
      <div id="eigenvectors">
      <div id="eigenvalues">
    </div>
  </div>
</div>

<script
    defer
    src="{{ site.third_party_libraries.math.url.js }}"
    integrity="{{ site.third_party_libraries.math.integrity.js }}"
    crossorigin="anonymous">
    </script>

<script src="{{ '/assets/js/math/eigenvectors-example-simple.js' | relative_url | bust_file_cache }}" type="module" ></script>
