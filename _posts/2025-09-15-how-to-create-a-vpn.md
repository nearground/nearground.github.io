---
layout: post
gisqus_comments: "true"
title: "Self Hosting Through A CGNAT For Free Part 1:  How to setup your own VPN"
date: 2025-09-15T0:37:00.000-07:00
#description: For Free (No, Actually)
tags: vpn ipv4 cgnat firewall
categories: devops
related_posts: "true"
# thumbnail: assets/img/wireguard.png
toc:
  sidebar: "left"
---

## The Dream

When I first got the idea of becoming an entrepreneur, I decided I would start small: set up a little home server with some fediverse apps and open it up to the world! Everyone dreams of hosting their own server, and it seems enough people succeed that it's a whole community. Surely, it can't be too tough, right?

Well, my carrier had other plans for me.

## CGNAT in the Way

Carrier-Grade Network Address Translators are a pain. They are NAT Gateways your carrier may use to recycle ipv4 addresses. Within the gateway you have an internal ip address. Outside of it, people see your traffic as coming from the CGNAT ip. Thus, when trying to, for example, link your awesome website `martinmunguia.com` to your homeserver via a CNAME in Cloudflare, it will never resolve past the CGNAT ip.

You need a way for your DNS provider to always reach your website, and that means getting around CGNAT.

## Your Options

### Cloudflare Tunnels

The fast approach. It's easy to set up and free. Honestly, probably the best out of any solution out there for a beginning selfhoster. I just didn't want implement it as it abstracts away all of the networking you need to do, and I wanted to learn doing this without relying on SaaS too much so I skipped this one.

### Tailscale

I have heard a lot of good things about this open-source VPN software, it's SaaS and I was still looking for a self-hosted version that could better suit my specific problem of working behind a CGNAT.

### WireGuard

There are a myriad other VPN apps you can use, but WireGuard is just cool and it does the trick.
Wireguard secures communication between two peers by storing each other peers' public keys to encrypt content while also employing firewall rules on the exposed Wireguard port to only allow authorized internal ip addresses to communicate with it.

You first enable port forwarding and decide on an out of the way, unused port. You decide on an internal ip address block. You configure two peers (your publicly accessible VPS and your homeserver) to share the same internal ip block, assign to each of them unique internal ips, route all traffic coming and going from each other to a specific Wireguard port, and set a keepalive in your homeserver so that the tunnel between your peers doesn't fizzle out. You open said port to udp in both your VPS and your home server.

<div class="row mt-3 mt-md-0 rounded mx-auto d-block">
  {% include figure.liquid path="assets/img/wg2.png" title="Wireguard config for your VPS" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
</div>
The config for your VPS. Few things to note here:
`wg genkey` will generate that peer's PrivateKey for you e.g. `wg genkey > private`.
Passing said key to `wg pubkey` will in turn give you the `PublicKey` value, eg `wg pubkey < private`. Other than that, you are pretty much free to use the exact config I have, and save it to `/etc/wireguard/wg0.conf`. After that, run `wireguard-quick /etc/wireguard/wg0.conf` and you're good to go on this end.

<div class="row mt-3 mt-md-0 rounded mx-auto d-block">
  {% include figure.liquid path="assets/img/wg1.png" title="Wireguard config for homeserver" class="img-fluid rounded z-depth-1" %}
</div>
<div class="caption">
</div>
Same things to look out for here. Finish with `wireguard-quick /etc/wireguard/wg0.conf`, then test by pinging `10.0.0.1`.

### And that's your VPN!

Once the connection is established, you can set up reverse proxying in both.

### Disclaimer

I tested this process by running Wireguard directly off my Ubuntu server. I originally tried to do it with docker within WSL, but it was just too complicated for me to figure everything out at once. Spinning up an SELinux instance in a spare partition and seting up wireguard directly was a compromise I had to adopt. I will update this article later on for working with a docker instance of wireguard or a WSL instance, or... docker within wsl, depending on how much time I have.
