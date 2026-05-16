---
layout: page
permalink: /experience/
title: experience
nav: true
nav_order: 2
---

<div class="cv">
  {% for entry in site.data.experience %}
    <a class="anchor" id="{{ entry.title }}"></a>
    <div class="card mt-3 p-3">
      <h3 class="card-title font-weight-medium">{{ entry.title }}</h3>
      <div>
        {% if entry.type == 'time_table' %}
          {% include cv/time_table.liquid %}
        {% else %}
          {{ entry.contents }}
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>
