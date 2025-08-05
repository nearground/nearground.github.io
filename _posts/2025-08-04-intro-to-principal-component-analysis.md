---
layout: post
gisqus_comments: "true"
title: Intro to Principal Component Analysis
date: 2025-08-10T0:37:00.000-07:00
description: With an interactive app
tags: linear-algebra
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/eigenvector.jpg
---

(https://www.stat.cmu.edu/cmsac/sure/2022/materials/lectures/slides/14-PCA.html#6)

## PCA: Warding off curses

Statistics deals with finding order out of chaos. Sometimes, estimating variables is easy
Oftentimes we find ourselves with more data than we know what to do with it. With more variables, more information. However, with more variables, there is also exponentially more complexity. This is called the _curse of dimensionality_. In order to avoid this fate, we use techniques for _dimensionality reduction_. That is, reducing the amount of variables down to just the most important ones. The techniques for achieving this fall under the umbrella of what is termed _Spectral Theory_. Spooky, but not so cursed.

# Spectral Theory

[Wikipedia](https://en.wikipedia.org/wiki/Spectral_theory):

> In mathematics, spectral theory is an inclusive term for theories extending the eigenvector and eigenvalue theory of a single square matrix to a much broader theory of the structure of operators in a variety of mathematical spaces.

# Principal Component Analysis

From [Fritz' Blog](https://fritz.ai/demystifying-principal-component-analysis-handling-the-curse-of-dimensionality/)

> Principal component analysis (PCA) is an algorithm that uses a statistical procedure to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components. \[...\] This is one of the primary methods for performing dimensionality reduction — this reduction ensures that the new dimension maintains the original variance in the data as best it can. \[...\] That way we can visualize high-dimensional data in 2D or 3D, or use it in a machine learning algorithm for faster training and inference.

They also lay out the steps for performing PCA.

1. Standardize (or normalize) the data.
2. Calculate the covariance matrix from this standardized data (with dimension d).
3. Obtain the Eigenvectors and Eigenvalues from the newly-calculated covariance matrix.
4. Sort the Eigenvalues in descending order, and choose the 𝑘 Eigenvectors that correspond to the 𝑘 largest Eigenvalues — where 𝑘 is the number of dimensions in the new feature subspace (𝑘≤𝑑).
5. Construct the projection matrix 𝑊 from the 𝑘 selected Eigenvectors.
6. Transform the original dataset 𝑋 by simple multiplication in 𝑊 to obtain a 𝑘-dimensional feature subspace 𝑌.
7. (optional) Calculate the explained variance: how much variance is captured by the PCA algorithm. Higher value = better.

PCA has its own limitations. Mainly, that it doesn't work so well with non-linear correlations. Luckily, you can always apply your own kernel methods for translating polynomial relationships down to linear problems, but that's a horror story for another time.

For a step-by-step implementation of PCA, check out [Nikita Kozodoi's](https://kozodoi.me/blog/20230326/pca-from-scratch). If you just want to play around solving
In the meantime, check out this set of exercises on calculating eigenvalues from [Libretexts.org](<https://math.libretexts.org/Courses/Cosumnes_River_College/Math_420%3A_Differential_Equations_(Breitenbach)/11%3A_Appendices/06%3A_Eigenvalues_and_Eigenvectors/6.01%3A_Exercises_4.1>). And if you want to cheat, I also created this eigenvector solver for you to use!

## App: calculating eigenvectors and values from a matrix

<div class= "row">
  <div class ="left-column col-sm">
    <label for="matrix-rows">Rows:</label>
    <input type="number" id="matrix-rows" min="1" value="3" style="width: 50px;">
    <label for="matrix-cols">Columns:</label>
    <input type="number" id="matrix-cols" min="1" value="3" style="width: 50px;">
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
    src="{{ site.third_party_libraries.pca-js.url.js }}"
    integrity="{{ site.third_party_libraries.pca-js.integrity.js }}"
    crossorigin="anonymous">
    </script>

<script src="{{ '/assets/js/pca-example-simple.js' | relative_url | bust_file_cache }}" type="module" ></script>
