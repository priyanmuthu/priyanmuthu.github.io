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
  var graph = document.querySelector(".related-works");
  if (!graph) return;

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
    graph.classList.remove("is-active");
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

    graph.classList.add("is-active");
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
      return;
    }
    selectedNode = node;
    highlightNode(node);
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
    if (graph.contains(event.target)) return;
    selectedNode = null;
    clearHighlight();
  });
})();
