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

I'm a Research Fellow in Microsoft Research India, currently working on [Accessibility of Programming Environments](https://priyan.info/codetalk), [A whole new way to search and interact with emails](https://priyan.info/emailinsights), and [a safer asynchronous programming language](https://priyan.info/psharp).


Updates
====

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
