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

I'm a **Research Fellow** in **Microsoft Research** India, currently working on [accessibility](https://priyan.info/codetalk) of Programming Environments, a whole new way to [search and interact](https://priyan.info/emailinsights) with emails, and a safer [asynchronous](https://priyan.info/psharp) programming language.


Currently working on
----
* [CodeTalk](https://priyan.info/projects/CodeTalk/)
* [PSharp](https://priyan.info/projects/PSharp/)
* [SmartStick](https://priyan.info/projects/SmartStick/)
* [Email Insights](https://priyan.info/projects/EmailInsights/)

<br/>

Updates
====

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
