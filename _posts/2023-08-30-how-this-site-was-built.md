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

## Creating your own hosted website and blog, for free!

Hi all! I want to share with you how I built this blog.
Most of the features in this site I borrowed from [alshedivat/al-folio](https://github.com/alshedivat/al-folio) `al-folio`. In order to edit my posts I am currently using an open-source app called [Decap CMS](https://github.com/decaporg/decap-cms). In order to edit posts online, you need to validate against Github's OAuth, but there's no safe way to do that from a static site directly. Luckily, you can setup your own [Decap CMS-compatible Cloudflare Worker](https://github.com/sveltia/sveltia-cms-auth) to run the authentication for you at no charge.
I am currently running on Windows; if you want a Linux version of the tutorial, feel free to request it!
This tutorial assumes you're familiar with `docker-compose`.

### One, Two, Skip a Few...

Well, why reinvent the wheel. The `all-folio`'s [README](https://github.com/alshedivat/al-folio/blob/master/README.md) is an excellent place to get started. This tutorial assumes that you are able to get the base site up and running in github-pages and that you have [gisqus](https://giscus.app/) enabled.

### Almost there already!

So your site is up and running. Now we'll add posts to it!

#### Add a Content Management System (CMS)

We'll be working with `decaporg/decap-cms`. [README](https://github.com/decaporg/decap-cms/blob/master/README.md)
Setup is really easy if you're on Netlify. We're hosting it on Github Pages, so we'll need to create our own OAuth server for it. I made my own and tested out several of the ones provided in their documentation to no avail, except for one that runs on Cloudflare Workers. The best part-- it's also free. Score.

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
nav_order: 6
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

This config file tells the CMS that we have two different collections of posts that we want to be able to create. It requires some kinds of fields, and others are conventions that `al-folio`'s posts already follow. You can add/edit to this list to some degree.

Once you rebuild the website with docker-compose, you'll notice you have a login button on your site. It won't work out of the box because we're not on Netlify due to OAuth requirements, so we'll create one ourselves.

#### Create an OAuth "server"

Why go through all the trouble of creating an OAuth server just to login to a static site? Well, because you static sites can't do server-side logic, which means they can't exchange OAuth tokens with Github. For that, we need a tiny bit of server-side processing. So small, we could do without the server and run it off a Cloudflare worker.

[Follow this tutorial](https://github.com/sveltia/sveltia-cms-auth)

You will need to create a Github OAuth App, a Cloudflare account, and enable Cloudflare Workers. Don't worry, you can sign up for the free plan without payment info.

Follow it to a T! Don't be a smart guy like me and try to make sense out of Decap CMS's documentation. It will lead you astray!

#### Conclusion

Hope you liked it. I will be editing this as I go. If I'm missing something feel free to request it.
