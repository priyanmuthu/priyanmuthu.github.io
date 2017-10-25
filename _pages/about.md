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
I'm a **Research Fellow** in **Microsoft Research** India, a guitarist and a writer. An aspiring researcher in Human-Computer Interaction concentrated on interactivity and interface design. In Microsoft Research, I'm currently working on [accessibility](https://priyan.info/codetalk) of Programming Environments, a [smarter walking cane](https://priyan.info/projects/SmartStick/) for Visually Impaired people, a whole new way to [search and interact](https://priyan.info/emailinsights) with emails, and a safer [asynchronous](https://priyan.info/psharp) programming language.  

For more details on my current work, please visit my [projects](https://priyan.info/projects) page.  

Why HCI?
---
Interactivity is a key concern in interface design. I'm form India, where technological penetration, though rising, is not as high as other developed countries. This is due to many reasons like literacy, economic buying power etc. But the main concern is usability. Traditional design in tech products is not inclusive to all ages and demographics (this is even without considering differently-abled people). I believe judiciously designed interfaces can bring a cohesive experience to all. I have worked on many projects challenge the traditional ways of interacting with a system. I'm currently exploring Machine Learning and IoT, and I believe these small intelligent devices powered by efficient ML algorithms can change the way we interact with the world.  

Art
---

I also indulge deeply in [Art](https://priyan.info/art). I also collaborate in [*The Onion Art Project*](https://theonionart.wordpress.com) and maintain a personal blog : [*Broken Typewriter*](https://priyanmuthu.wordpress.com).

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
