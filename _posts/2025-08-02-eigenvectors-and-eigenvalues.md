---
layout: post
gisqus_comments: "true"
title: Eigenvectors and Eigenvalues
date: 2025-08-02T0:37:00.000-07:00
description: Building up to Principal Component Analysis
tags: linear-algebra
categories: fun work mathematics statistics
related_posts: "true"
thumbnail: assets/img/eigenvector.jpg
---

Statistics deals with finding order out of chaos. One field where chaos reigns and there is much more than meets the eye is the field of hyperspectral imaging in chemometrics.

In the field of chemometrics, hyperspectral cameras are sometimes used to capture a broad spectrum of wavelengths of objects of interest in order to extract features from them. Think of it as a photograph that records values from infrared up to ulraviolet. Whereas a regular image has three color values for each pixel (R,G,B) a hyperspectral image may contain hundreds of variables, each representing a narrow spectral band. With more variables, more information. However, with more variables, there is also exponentially more complexity. This is called the _CURSE OF DIMENSIONALITY_. In order to avoid this fate, we use techniques for _dimensionality reduction_. That is, reducing the amount of variables down to just the most important ones. The techniques for achieving this fall under the umbrella of what is termed _Spectral Theory_. Spooky, but not so cursed.

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

# Principal Component Analysis

From [Fritz' Blog](https://fritz.ai/demystifying-principal-component-analysis-handling-the-curse-of-dimensionality/)

> Principal component analysis (PCA) is an algorithm that uses a statistical procedure to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components. \[...\] This is one of the primary methods for performing dimensionality reduction — this reduction ensures that the new dimension maintains the original variance in the data as best it can. \[...\] That way we can visualize high-dimensional data in 2D or 3D, or use it in a machine learning algorithm for faster training and inference.

They also lay out the steps for performing PCA.

1. Standardize (or normalize) the data: involves usually applying a mask to the image. A mask is simply filtering out all the outliers in the dataset i.e. shiny things, scribbles on the image, calibration strips, etc. This is up to the expertise of the researcher/engineer.
2. Calculate the covariance matrix from this standardized data (with dimension d).
3. Obtain the Eigenvectors and Eigenvalues from the newly-calculated covariance matrix.
4. Sort the Eigenvalues in descending order, and choose the 𝑘 Eigenvectors that correspond to the 𝑘 largest Eigenvalues — where 𝑘 is the number of dimensions in the new feature subspace (𝑘≤𝑑).
5. Construct the projection matrix 𝑊 from the 𝑘 selected Eigenvectors.
6. Transform the original dataset 𝑋 by simple multiplication in 𝑊 to obtain a 𝑘-dimensional feature subspace 𝑌.
7. (optional) Calculate the explained variance: how much variance is captured by the PCA algorithm. Higher value = better.

PCA has its own limitations. Mainly, that it doesn't work so well with non-linear correlations. Luckily, you can always apply your own kernel methods for translating polynomial relationships down to linear problems, but that's a horror story for another time.

I'll lay out the rest of the steps soon in a new post on how to implement PCA from scratch.
