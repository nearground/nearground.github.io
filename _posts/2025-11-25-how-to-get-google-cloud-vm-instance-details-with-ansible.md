---
layout: post
gisqus_comments: "true"
title: How to get Google Cloud VM instance details with Ansible
date: 2025-11-11T12:26:00.000-08:00
description: In this post I document my working ansible playbook for finding a VM instance
tags: ansible google-cloud
categories: devops
related_posts: "false"
---
If you already followed my previous post, you should have a VM serving nginx. Suppose you want to automate the process to scale up the instance, or maybe spin up something else altogether.  My infrastructure automation tool of choice is ansible, so I'll share with you an example of how I went about it:
