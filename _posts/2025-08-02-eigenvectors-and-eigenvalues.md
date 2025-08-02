---
layout: post
gisqus_comments: "true"
title: Eigenvectors and Eigenvalues
date: 2025-07-29T17:37:00.000-07:00
description: Part 1 of a series on chemometrics
tags: linear-algebra
categories: fun work mathematics statistics
related_posts: "false"
---
# Chemometrics
In the field of chemometrics, hyperspectral cameras are used to capture a broad spectrum of wavelengths of objects of interest in order to capture variables of interest and extract features from them. Whereas a regular image has three color values for each pixel (R,G,B) a hyperspectral image may contain hundreds of variables, each representing a narrow spectral band ranging from infrared to ultraviolet. With more variables, more information. However, with more variables, there is also exponentially more complexity. This is called the *CURSE OF DIMENSIONALITY*. In order to avoid this fate, we use techniques for *dimensionality reduction*. That is, reducing the amount of variables down to just the most important ones. The techniques for achieving this fall under the umbrella of what is termed *Spectral Theory*. Spooky, but not so cursed.

# Spectral Theory
[Wikipedia](https://en.wikipedia.org/wiki/Spectral_theory):
>In mathematics, spectral theory is an inclusive term for theories extending the eigenvector and eigenvalue theory of a single square matrix to a much broader theory of the structure of operators in a variety of mathematical spaces.

# Eigenvalues and Eigenvectors
Consider an MxN matrix A of M datapoints with N variables each. The eigenvectors of the matrix describe the perpendicular directions over which the datapoints are spread out. Mathematically speaking, they are vectors such that Av = λv, where λ is their eigenvalue. The eigenvector when right-multiplying the matrix only shrinks or expands by a scalar λ, called the eigenvalue. These are incredibly useful because the higher the magnitude of λ, the more that eigenvector describes a feature of the dataset.

One algorithm that leverages eigenvectors and eigenvalues for effective dimensionality reduction is called Principal Component Analysis (PCA).

# Principal Component Analysis
From  [Fritz' Blog](https://fritz.ai/demystifying-principal-component-analysis-handling-the-curse-of-dimensionality/)
>Principal component analysis (PCA) is an algorithm that uses a statistical procedure to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components.

>This is one of the primary methods for performing dimensionality reduction — this reduction ensures that the new dimension maintains the original variance in the data as best it can.

>That way we can visualize high-dimensional data in 2D or 3D, or use it in a machine learning algorithm for faster training and inference.

They also lay out the steps for performing PCA.

1. Standardize (or normalize) the data: By default, this is the machine learning engineer’s responsibility.
2. Calculate the covariance matrix from this standardized data (with dimension d).
3. Obtain the Eigenvectors and Eigenvalues from the newly-calculated covariance matrix.
4. Sort the Eigenvalues in descending order, and choose the 𝑘 Eigenvectors that correspond to the 𝑘 largest Eigenvalues — where 𝑘 is the number of dimensions in the new feature subspace (𝑘≤𝑑).
5. Construct the projection matrix 𝑊 from the 𝑘 selected Eigenvectors.
6. Transform the original dataset 𝑋 by simple multiplication in 𝑊 to obtain a 𝑘-dimensional feature subspace 𝑌.

PCA has its own limitations. Mainly, that it doesn't work so well with non-linear correlations. Luckily, you can always apply your own kernel methods for translating polynomial relationships down to linear problems, but that's a horror story for another time.

In the meantime, stay tuned for a manual implementation of PCA.
