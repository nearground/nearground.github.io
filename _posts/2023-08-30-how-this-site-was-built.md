---
layout: post
gisqus_comments: "true"
title: How To Create a Personal Website and Blog for Free
date: 2023-08-30T01:11:44.605Z
description: How to build a blog on Github Pages
giscus_comments: "true"
related_posts: "true"
tags: jekyll blog
categories: personal-site
toc:
  sidebar: "left"
---

## Adding a headless CMS to your Jekyll theme

I want to share with you how I publish my blog to Github pages.
It's been a while since I originally wrote this article, titled "How to build your own website and host it for free". However, most of the steps involved just a recap of setting up the Jekyll template [alshedivat/al-folio](https://github.com/alshedivat/al-folio) `al-folio`. While it comes with its own set of quirks, most if not all of them can be solved by going searching in the discussions for your particular bug. One feature that is sorely missing from this template is the ability to edit and publish your own content, so this is what we'll cover here. We will use a headless CMS called [Decap CMS](https://github.com/decaporg/decap-cms), and a CMS authentication system, both free for use.

## Decap CMS

1. In the root folder, create an `admin` folder. We'll add two files there:

```markdown
admin
├ index.html
└ config.yml
```

`index.html`

```markdown
---
layout: default
title: Admin
permalink: /admin/
subtitle: login screen for decap
title: Login
nav: true
nav_order: 10
dropdown: false
publish_mode: editorial_workflow
media_folder: "assets/uploads"
---

<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Content Manager</title>
</head>
<body>
  <!-- Include the script that builds the page and powers Decap CMS -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

`config.yml`

```markdown
backend:
name: github
branch: master # Branch to update (optional; defaults to master)
repo: your-repo/your-repo.github.io

publish_mode: editorial_workflow
media_folder: "assets/img/uploads"
public_folder: static/media

collections:

- name: "blog" # Used in routes, e.g., /admin/collections/blog
  label: "Blog" # Used in the UI
  folder: "\_posts" # The path to the folder where the documents are stored
  create: true # Allow users to create new documents in this collection
  slug: "{{year}}-{{month}}-{{day}}-{{slug}}" # Filename template, e.g., YYYY-MM-DD-title.md
  fields: # The fields for each document, usually in front matter

  - {label: "Layout", name: "layout", widget: "hidden", default: "post"}
  - {label: "Comments", name: "gisqus_comments", widget: "hidden", default: "true"}
  - {label: "Title", name: "title", widget: "string"}
  - {label: "Publish Date", name: "date", widget: "datetime"}
  - {label: "Description", name: "description", widget: "string"}
  - {label: "Body", name: "body", widget: "markdown"}
  - {label: "Tags", name: "tags", widget: "markdown"}
  - {label: "Categories", name: "categories", widget: "markdown"}
  - {label: "related", name: "related_posts", widget: "hidden", default: "false"}

- name: "news"
  label: "News"
  folder: "posts"
  create: true
  fields:
  - {label: "Layout", name: "layout", widget: "hidden", default: "post"}
  - {label: "Comments", name: "gisqus_comments", widget: "hidden", default: "true"}
  - {label: "Publish Date", name: "date", widget: "datetime"}
  - {label: "Body", name: "body", widget: "markdown"}
  - {label: "gisqus", name: "giscus_comments", widget: "hidden", default: "true"}
    inline: true
```

This config file tells the CMS that we have two different collections of posts that we want to be able to create. It requires some kinds of fields, and others are conventions that `al-folio`'s posts already follow. You can add/edit to this list to some degree, like adding another collection for publishing your own book reviews.

Once you rebuild the website with docker-compose, you'll notice you have a login button on your site. It won't work out of the box because we're not on Netlify due to OAuth requirements, so we'll create one ourselves.

#### Adding OAuth

Luckily for us, we can run OAuth logic for free with the help of `sveltia`, a CMS authenticator that relies on an also-free Cloudflare workers script.

[Follow this tutorial](https://github.com/sveltia/sveltia-cms-auth)

Make sure to follow the tutorial exactly, or you won't be able to make sense of what went wrong.

#### Conclusion

There ya go.
If I'm missing something feel free to request it.
