---
layout: post
gisqus_comments: "true"
title: Examples of Principal Component Analysis
date: 2025-08-04T0:05:00.000-07:00
description: A browser implementation of Principal Component Analysis using pca-js
tags: linear-algebra
categories: mathematics statistics
related_posts: "true"
thumbnail: assets/img/eigenvector.jpg
---

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

<script src="{{ '/assets/js/math/pca-example-simple.js' | relative_url | bust_file_cache }}" type="module" ></script>
