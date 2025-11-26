---
layout: post
gisqus_comments: "true"
title: "Self Hosting Through A CGNAT For Free Part 3: Configuring an NGINX Reverse Proxies"
date: 2025-09-17T0:37:00.000-07:00
description: Demistifying reverse proxying. Or am I?
tags: vps google-cloud gce reverse-proxy
categories: devops
related_posts: "true"
# thumbnail: assets/img/nginx.png
toc:
  sidebar: "left"
---

## A Haiku

VPS forwards \n
Traffic through reverse proxy \n
Towards homeserver

Ponder over what this haiku means. Truly, become IT. Only then may you move on to the next step.

## What we need to accomplish

```
sudo apt install nginx
sudo systemctlm start service.nginx
```

Or something like that. Now, we configure it.-- in this case, NGINX will reverse proxy (aka serve as a proxy for an anonymous server, in our case a homeserver only accessible through wireguard). First, assuming you already know how to configure NGINX [see my previous blog post](/_posts/2025-09-14-serve-on-rootless-docker-selinux.md), the following config file is necessary for your home server to receive traffic.

```
server {
        listen 3456;
        server_name www.your-domain.here your-domain.here;
        location / {
                proxy_pass http://localhost:app_port; # the right address:port combination if you need
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                }
        }
```

We can now access our app locally via `http://localhost:app_port`, and externally (in theory) through port `3456` (or whatever VPN port you chose). After setting up both NGINX files (and configuring WireGuard to communicate through port `3456` or whatever you chose), the VPS will receive requests to `yourdomain.com` from your DNS of choice then forward them over to your home server. Below is the config you need to for your VPS to serve your app over HTTPS:

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

Both afraid.org and Cloudflare have web APIs that can generate SSL certificates, so I'm not going to go over those details.

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
