---
layout: post
gisqus_comments: "true"
title: How to Estimate Multivariate Normal Distribution
date: 2025-10-30T0:37:00.000-07:00
description: Or as I like to call it, Samples for Examples
tags: linear-algebra statistics javascript
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/eigenvector.jpg
---

Google "how to estimate multivariate normal distribution" a bunch of times
Find multivariate-js and realize it doesn't work anymore or maybe you just can't figure it out. Distraught yourself to sleep.
Google again.
One method is the box-muller transform. It takes two uniformly distributed numbers and calculates a normal variable using trig and logs.
Discard the Box-Muller transform because it's not performant enough.

Another method is to calculate the inverse of the cumulative density function of the normal distribution. Then using a uniformly distributed variable, icdf(x) yields a normally-distributed variable.

But calculating the inverse of a normally-distributed cdf is hard, but also once you have one normally distributed function you pretty much have them all. Surely there are people out there who have already estimated one inverse cdf? What about python libraries?

read up in scipy.stats's method of estimating it.
Nevermind, don't have time for finding out the source code.

Go on stackoverflow
Calculating ppf (another way of calling the icdf): answer by chrslg
https://stackoverflow.com/questions/74817976/alternative-for-scipy-stats-norm-ppf

Skim their reference

https://people.maths.ox.ac.uk/gilesm/files/gems_erfinv.pdf

Implement it

```js
   var w = - math.log((1-x)*(1+x));
    if (w < 5){
        w = w - 2.5
        p = 2.81022636e-08
        p = 3.43273939e-07 + p*w
        p = -3.5233877e-06 + p*w
        p = -4.39150654e-06 + p*w
        p = 0.00021858087 + p*w
        p = -0.00125372503 + p*w
        p = -0.00417768164 + p*w
        p = 0.246640727 + p*w
        p = 1.50140941 + p*w
    }
    else{
        w = math.sqrt(w) - 3
        p = -0.000200214257
        p = 0.000100950558 + p*w
        p = 0.00134934322 + p*w
        p = -0.00367342844 + p*w
        p = 0.00573950773 + p*w
        p = -0.0076224613 + p*w
        p = 0.00943887047 + p*w
        p = 1.00167406 + p*w
        p = 2.83297682 + p*w
    }
    return p*x;
}
```

Ask Gemini:

To generate random numbers from a multivariate distribution, you can use the inverse CDF method and the covariance matrix. This involves transforming a vector of uniform random numbers into a desired multivariate distribution using the Cholesky decomposition of the covariance matrix and the inverse cumulative distribution functions of the marginal distributions.
Here's a step-by-step explanation:

1. Generate Uniform Random Numbers:
   Create a vector of independent uniform random numbers (u) between 0 and 1, with the same dimensionality as your desired multivariate distribution.
2. Cholesky Decomposition:
   Perform the Cholesky decomposition on the covariance matrix (Σ) of the target multivariate distribution. This results in a lower triangular matrix (L) such that Σ = LLᵀ.
3. Transform to Standard Normals:
   Apply the inverse of the standard normal cumulative distribution function (Φ⁻¹) to each element of the uniform vector (u) to obtain a vector (z) of standard normal random variables.
4. Linear Transformation:
   Multiply the transpose of the Cholesky factor (Lᵀ) by the vector of standard normals (z) and add the mean vector (μ) to obtain the desired multivariate random vector (x): x = μ + Lᵀz.
5. Apply Inverse CDFs (for non-normal distributions):
   If the target distribution is not normal, you will need to transform the standard normal variables (z) to the desired marginal distributions using their respective inverse CDFs. This can be done element-wise.
6. Example:
   For a multivariate normal distribution with mean μ and covariance Σ, generate u from Unif(0,1) and then z = Φ⁻¹(u). Then, compute x = μ + Lᵀz where Σ = LLᵀ.
   Key points:
   The Cholesky decomposition is crucial for generating correlated multivariate random variables.
   The inverse CDF method allows you to generate random variables from any distribution, given its CDF.
   For non-normal multivariate distributions, you'll need to apply the inverse CDF of the marginal distributions after the Cholesky decomposition.
   This method can be used to simulate various multivariate distributions, including normal, t-distributions, and others with specified marginals.
