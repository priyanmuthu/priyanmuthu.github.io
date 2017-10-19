---
permalink: /
title: "About"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
  - /who
---

I'm a Research Fellow in Microsoft Research India, currently working on [accessibility](https://priyan.info/codetalk) of Programming Environments, a whole new way to [search and interact](https://priyan.info/emailinsights) with emails, and a safer [asynchronous](https://priyan.info/psharp) programming language.


Updates
====

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
