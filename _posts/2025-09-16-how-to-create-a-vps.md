---
layout: post
gisqus_comments: "true"
title: "Self Hosting Through A CGNAT For Free Part 2:  How to setup your a free VPS"
date: 2025-09-16T0:37:00.000-07:00
description: And still without spending any money!
tags: vps google-cloud aws gce digital-ocean
categories: devops
related_posts: "true"
thumbnail: assets/img/Compute_Engine.jpg
toc:
  sidebar: "left"
---

## Intro

This is for those of you who have gotten started on their dreams of self-hosting anything, only to be thwarted by CGNAT.
want a VPS no cost without worrying to much about switching providers after your free trial ends.

## The Main Providers are all Free, for a little bit

Azure does it, AWS does it, DigitalOcean does it, so does Google. The trick is finding one that will be _always_ free. Google's `micro` tier has a free plan! So we're going to use Google. If you just signed up, they also give you $300 in credits to spend over your first three months, after which you'll have to give financial details. Don't worry, as long as you stay within their Free plan, you won't be charged. [Read More Here](https://docs.cloud.google.com/free/docs/free-cloud-features#compute)

## Creating a new VM in Google Cloud

## Acquiring a domain

## Configuring it in Cloudflare

## You don't need to buy Static IPs

Free Tier VM's come with public-facing ephemeral ips. That means they're able to talk to the internet! So, technically we can set up our server or vpn or whatever. But it's not a permanent or elegant solution. Whenever your VM is spun up, and sometimes when it's restarted, its ip will refresh. This means it will lose contact with everything it's supposed to talk to. You have a few options: Setting up DDNS (which is trivial with `afraid.org` domains if you're going the _totally-free_ route), Updating everything manually whenever you notice the site is down, or setting up some kind of automation. In my case, I built an ansible playbook that would update my homeserver, the VPS, and Cloudflare records whenever the homeserver loses contact with the VPS. It's much too overkill to show you THAT approach, so I'll let you in on a little secret-- Cloudflare also offers DDNS for free by way of a lightweight service called `ddclient`.
