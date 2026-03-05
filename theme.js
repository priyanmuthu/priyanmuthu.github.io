(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem("theme");
  } catch (e) {
    storedTheme = null;
  }

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initialTheme = storedTheme || (prefersDark ? "dark" : "light");

  function setTheme(theme) {
    var isDark = theme === "dark";
    root.setAttribute("data-theme", theme);
    toggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    toggle.setAttribute("aria-pressed", String(isDark));
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* Ignore storage failures in private mode/restricted contexts. */
    }
  }

  setTheme(initialTheme);
  toggle.addEventListener("click", function () {
    var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
})();

(function () {
  var section = document.getElementById("publications");
  if (!section) return;

  var graphPanel = section.querySelector(".related-works");
  if (!graphPanel) return;

  var graphMount = graphPanel.querySelector(".related-works-graph-mount");
  if (!graphMount) return;

  var topicConfig = [
    { id: "hci", label: "Human-Computer Interaction" },
    { id: "programming-languages", label: "Programming Languages" },
    { id: "ai", label: "Artificial Intelligence" },
  ];
  var topicSet = {};
  topicConfig.forEach(function (topic) {
    topicSet[topic.id] = true;
  });

  function trimText(value) {
    return (value || "").replace(/^\s+|\s+$/g, "");
  }

  function extractYear(publicationEl) {
    var branchEl = publicationEl.querySelector(".pub-branch");
    if (!branchEl) return "";
    var match = branchEl.textContent.match(/(19|20)\d{2}/);
    return match ? match[0] : "";
  }

  var publicationEls = Array.prototype.slice.call(section.querySelectorAll(".publication[data-paper-id]"));
  var publications = publicationEls
    .map(function (el) {
      var id = trimText(el.getAttribute("data-paper-id"));
      var label = trimText(el.getAttribute("data-graph-label"));
      var topics = trimText(el.getAttribute("data-topics"))
        .split(",")
        .map(trimText)
        .filter(function (topicId) {
          return !!topicId && topicSet[topicId];
        });

      if (!id || !label || !topics.length) return null;
      return {
        id: id,
        label: label,
        year: extractYear(el),
        topics: topics,
      };
    })
    .filter(function (paper) {
      return !!paper;
    });

  if (!publications.length) return;

  function renderGraph() {
    var svgNs = "http://www.w3.org/2000/svg";

    function svgEl(name, attrs, textValue) {
      var el = document.createElementNS(svgNs, name);
      Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
      });
      if (textValue) el.textContent = textValue;
      return el;
    }

    var graphWidth = 720;
    var minGraphHeight = 220;
    var paperX = 390;
    var paperWidth = 304;
    var paperHeight = 14;
    var paperStartY = 8;
    var paperGap = 15;
    var topicX = 20;
    var topicWidth = 262;
    var topicHeight = 14;

    var lastPaperY = paperStartY + (publications.length - 1) * paperGap;
    var graphHeight = Math.max(minGraphHeight, lastPaperY + paperHeight + 18);

    var firstPaperCenter = paperStartY + paperHeight / 2;
    var lastPaperCenter = lastPaperY + paperHeight / 2;
    var minTopicCenter = firstPaperCenter + 36;
    var maxTopicCenter = lastPaperCenter - 24;
    if (maxTopicCenter < minTopicCenter) {
      maxTopicCenter = minTopicCenter;
    }

    var topicCenters = {};
    topicConfig.forEach(function (topic, index) {
      var center;
      if (topicConfig.length === 1) {
        center = (minTopicCenter + maxTopicCenter) / 2;
      } else {
        center = minTopicCenter + ((maxTopicCenter - minTopicCenter) * index) / (topicConfig.length - 1);
      }
      topicCenters[topic.id] = Math.round(center);
    });

    var svg = svgEl(
      "svg",
      {
        class: "related-works-graph",
        viewBox: "0 0 " + graphWidth + " " + graphHeight,
        role: "img",
        "aria-label": "Graph connecting publication topics and papers",
      }
    );

    publications.forEach(function (paper, index) {
      var paperCenterY = paperStartY + index * paperGap + paperHeight / 2;
      paper.topics.forEach(function (topicId) {
        svg.appendChild(
          svgEl("line", {
            class: "rw-link",
            "data-topic": topicId,
            "data-paper": paper.id,
            x1: topicX + topicWidth,
            y1: topicCenters[topicId],
            x2: paperX,
            y2: paperCenterY,
          })
        );
      });
    });

    topicConfig.forEach(function (topic) {
      var centerY = topicCenters[topic.id];
      var group = svgEl("g", {
        class: "rw-node rw-topic",
        "data-type": "topic",
        "data-id": topic.id,
        tabindex: "0",
        role: "button",
        "aria-label": "Topic: " + topic.label,
      });

      group.appendChild(
        svgEl("rect", {
          x: topicX,
          y: centerY - topicHeight / 2,
          width: topicWidth,
          height: topicHeight,
          rx: 2,
        })
      );
      group.appendChild(svgEl("text", { x: topicX + 8, y: centerY + 3 }, "[" + topic.label + "]"));
      svg.appendChild(group);
    });

    publications.forEach(function (paper, index) {
      var y = paperStartY + index * paperGap;
      var displayLabel = paper.label + (paper.year ? " (" + paper.year + ")" : "");
      var group = svgEl("g", {
        class: "rw-node rw-paper",
        "data-type": "paper",
        "data-id": paper.id,
        tabindex: "0",
        role: "button",
        "aria-label": "Paper: " + paper.label,
      });

      group.appendChild(
        svgEl("rect", {
          x: paperX,
          y: y,
          width: paperWidth,
          height: paperHeight,
          rx: 2,
        })
      );
      group.appendChild(svgEl("text", { x: paperX + 8, y: y + 10 }, displayLabel));
      svg.appendChild(group);
    });

    return svg;
  }

  graphMount.innerHTML = "";
  graphMount.appendChild(renderGraph());

  var graph = graphMount.querySelector(".related-works-graph");
  var nodes = Array.prototype.slice.call(graph.querySelectorAll(".rw-node"));
  var links = Array.prototype.slice.call(graph.querySelectorAll(".rw-link"));
  var selectedNode = null;

  function findNode(target) {
    while (target && target !== graph) {
      if (target.classList && target.classList.contains("rw-node")) {
        return target;
      }
      target = target.parentNode;
    }
    return null;
  }

  function clearHighlight() {
    graphPanel.classList.remove("is-active");
    nodes.forEach(function (node) {
      node.classList.remove("rw-active");
    });
    links.forEach(function (link) {
      link.classList.remove("rw-active");
    });
  }

  function highlightNode(node) {
    if (!node) {
      clearHighlight();
      return;
    }

    var type = node.getAttribute("data-type");
    var id = node.getAttribute("data-id");
    var activeTopics = {};
    var activePapers = {};

    graphPanel.classList.add("is-active");
    nodes.forEach(function (n) {
      n.classList.remove("rw-active");
    });
    links.forEach(function (link) {
      link.classList.remove("rw-active");
    });

    links.forEach(function (link) {
      var match =
        (type === "topic" && link.getAttribute("data-topic") === id) ||
        (type === "paper" && link.getAttribute("data-paper") === id);

      if (!match) return;
      link.classList.add("rw-active");
      activeTopics[link.getAttribute("data-topic")] = true;
      activePapers[link.getAttribute("data-paper")] = true;
    });

    nodes.forEach(function (n) {
      var nodeType = n.getAttribute("data-type");
      var nodeId = n.getAttribute("data-id");
      var isRelated =
        (nodeType === "topic" && activeTopics[nodeId]) ||
        (nodeType === "paper" && activePapers[nodeId]);
      if (isRelated) {
        n.classList.add("rw-active");
      }
    });
  }

  function restoreState() {
    if (selectedNode) {
      highlightNode(selectedNode);
      return;
    }
    clearHighlight();
  }

  graph.addEventListener("mouseover", function (event) {
    var node = findNode(event.target);
    if (!node) return;
    highlightNode(node);
  });

  graph.addEventListener("mouseout", function (event) {
    var fromNode = findNode(event.target);
    if (!fromNode) return;
    var toNode = findNode(event.relatedTarget);
    if (toNode === fromNode) return;
    restoreState();
  });

  graph.addEventListener("focusin", function (event) {
    var node = findNode(event.target);
    if (!node) return;
    highlightNode(node);
  });

  graph.addEventListener("focusout", function (event) {
    var fromNode = findNode(event.target);
    if (!fromNode) return;
    var toNode = findNode(event.relatedTarget);
    if (toNode === fromNode) return;
    restoreState();
  });

  graph.addEventListener("click", function (event) {
    var node = findNode(event.target);
    if (!node) return;
    if (selectedNode === node) {
      selectedNode = null;
      clearHighlight();
      if (event.detail > 0 && node.blur) node.blur();
      return;
    }
    selectedNode = node;
    highlightNode(node);
    if (event.detail > 0 && node.blur) node.blur();
  });

  graph.addEventListener("keydown", function (event) {
    var node = findNode(event.target);
    if (!node) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      node.click();
    }
  });

  graph.addEventListener("mouseleave", function () {
    restoreState();
  });

  document.addEventListener("click", function (event) {
    if (graphPanel.contains(event.target)) return;
    selectedNode = null;
    clearHighlight();
  });
})();
