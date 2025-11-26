---
layout: post
gisqus_comments: "true"
title: "Self Hosting Through A CGNAT For Free Part 4:  Getting a subdomain"
date: 2025-09-18T0:37:00.000-07:00
description: How to get a subdomain and pay next to nothing or less
tags: vps google-cloud gce reverse-proxy
categories: devops
related_posts: "true"
thumbnail: assets/img/spaceship-domains-783627529.png
toc:
  sidebar: "left"
---

## A Haiku

VPS forwards \n
Traffic through reverse proxy \n
Towards homeserver

Ponder over what this haiku means. Truly, become IT. Only then may you move on to the next step.

## What we need to accomplish

In the pu
We first need to install NGINX, enable it, then configure it-- in this case, NGINX will reverse proxy (aka serve as a proxy for an anonymous server, in our case a homeserver only accessible through wireguard).

```
server {
        listen 443 ssl;
        server_name www.your-domain.here your-domain.here;
        ssl_certificate /.ssh/id_rsa.pub;
        ssl_certificate_key /.ssh/id_rsa;
        location / {
                proxy_pass http://10.0.0.2:3456; # Replace with your backend application's address and port. No need to change if you followed my guide on VPN setup.
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                }
        }
```

Ok, so we don't have an ssl certificate yet. There's a few places you can get those, but I won't get into details here, as I just used the Cloudflare Web API to create them, then I SSH'd to my VPS and stored them there. Don't share your ssl key with anyone. Consider restricting access to it:

```
chmod 600 /.ssh/id_rsa
chown nginx:nginx /.ssh/id_rsa
```

Wait, so it receives HTTPS traffic, then it forwards it over a different port altogether through the VPN. That's actually cool.
Now we need to set up serve our application in our homeserver with another reverse proxy:

## TBD
