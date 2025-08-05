---
layout: post
gisqus_comments: "true"
title: Intro to Principal Component Analysis
date: 2025-08-10T0:37:00.000-07:00
description: Building up to Principal Component Analysis
tags: linear-algebra
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/eigenvector.jpg
---

## PCA: Warding off curses

Statistics deals with finding order out of chaos. Sometimes, estimating variables is easy
Oftentimes we find ourselves with more data than we know what to do with it. With more variables, more information. However, with more variables, there is also exponentially more complexity. This is called the _CURSE OF DIMENSIONALITY_. In order to avoid this fate, we use techniques for _dimensionality reduction_. That is, reducing the amount of variables down to just the most important ones. The techniques for achieving this fall under the umbrella of what is termed _Spectral Theory_. Spooky, but not so cursed.

In the field of chemometrics, hyperspectral cameras are sometimes used to capture a broad spectrum of wavelengths of objects of interest in order to extract features from them. Think of it as a photograph that records values from infrared up to ulraviolet. Whereas a regular image has three color values for each pixel (R,G,B) a hyperspectral image may contain hundreds of variables, each representing a narrow spectral band.

<div class="row mt-3 mt-md-0 rounded mx-auto d-block">
  {% include figure.liquid path="assets/img/Hyperspectral_image_data_cube.jpg" title="too many dimensions!" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
A hyperspectral image, also called a hypercube
</div>

# Spectral Theory

[Wikipedia](https://en.wikipedia.org/wiki/Spectral_theory):

> In mathematics, spectral theory is an inclusive term for theories extending the eigenvector and eigenvalue theory of a single square matrix to a much broader theory of the structure of operators in a variety of mathematical spaces.

# Eigenvalues and Eigenvectors

Consider an MxN matrix A of M datapoints with N variables each. The eigenvectors of the matrix describe the perpendicular directions over which the datapoints are spread out. Mathematically speaking, they are vectors such that Av = λv, where λ is their eigenvalue. They're special vector that, when transformed by a matrix, only changes in length (gets stretched or shrunk) but not in direction. The amount by which they shrink or stretch is the eigenvalue.

To find the eigenvectors of a matrix, first find the eigenvalues by solving the characteristic equation `det(A - λI) = 0`, where A is the matrix, λ is the eigenvalue, I is the identity matrix, and **0** is the zero vector.
Knowing the eigenvalues, we then solve for `(A-λI)x=0`, where the possible solutions for the vector x are the eigenvectors.

<div class="row mt-3 mt-md-0 rounded mx-auto d-block">
  {% include figure.liquid path="assets/img/eigenvector.jpg" title="stretched dog" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
Woo-o-f!
</div>

One algorithm that leverages eigenvectors and eigenvalues for effective dimensionality reduction is called Principal Component Analysis (PCA).

I'll lay out an implementation for .
In the meantime, check out this set of exercises on calculating eigenvalues from [Libretexts.org](<https://math.libretexts.org/Courses/Cosumnes_River_College/Math_420%3A_Differential_Equations_(Breitenbach)/11%3A_Appendices/06%3A_Eigenvalues_and_Eigenvectors/6.01%3A_Exercises_4.1>)

<div class="sample-canvas" style="max-width: 100%; max-height=auto"></div>

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

<script src="{{ '/assets/js/math/cholesky.js' | relative_url | bust_file_cache }}"></script>

<script src="{{ '/assets/js/pca-example-full.js' | relative_url | bust_file_cache }}" type="module" ></script>
