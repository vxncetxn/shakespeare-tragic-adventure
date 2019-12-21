var windowWidth = window.innerWidth;
var width = window.matchMedia("(max-width: 897px)").matches
  ? windowWidth * 0.9
  : windowWidth * 0.5;
var height = window.innerHeight * 0.8;
var color = d3.scaleOrdinal(d3.schemeCategory10);

function sigmoid(t) {
  return 1 / (1 + Math.pow(Math.E, -t)) - 0.47;
}

var visualisation = "macbethActOverall";
var text = "macbeth";
var tuning = -2300;

function handleSelectChange() {
  const container = document.querySelector(".select-container").elements;
  switch (container[1].value) {
    case "Macbeth":
      text = "macbeth";
      break;
    case "Hamlet":
      text = "hamlet";
      break;
    case "Othello":
      text = "othello";
      break;
    case "King Lear":
      text = "kinglear";
      break;
    default:
      break;
  }
  switch (container[0].value) {
    case "Act I":
      visualisation = `${text}ActOne`;
      break;
    case "Act II":
      visualisation = `${text}ActTwo`;
      break;
    case "Act III":
      visualisation = `${text}ActThree`;
      break;
    case "Act IV":
      visualisation = `${text}ActFour`;
      break;
    case "Act V":
      visualisation = `${text}ActFive`;
      break;
    default:
      visualisation = `${text}ActOverall`;
      break;
  }

  d3.select(".canvas")
    .select("svg")
    .remove();
  d3.select(".tip").remove();
  var characterImages = document.querySelector("#character-images");
  while (characterImages.firstChild) {
    characterImages.removeChild(characterImages.firstChild);
  }
  makeViz(visualisation);
}

var resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (window.innerWidth - windowWidth) {
      windowWidth = window.innerWidth;
      width = window.matchMedia("(max-width: 897px)").matches
        ? windowWidth * 0.9
        : windowWidth * 0.5;

      d3.select(".canvas")
        .select("svg")
        .remove();
      d3.select(".tip").remove();
      var characterImages = document.querySelector("#character-images");
      while (characterImages.firstChild) {
        characterImages.removeChild(characterImages.firstChild);
      }
      makeViz(visualisation);
    }
  }, 250);
});

function makeViz(viz) {
  d3.json(
    `./processed/${text.charAt(0).toUpperCase() + text.slice(1)}/${viz}.json`
  ).then(function(graph) {
    var label = {
      nodes: [],
      links: []
    };

    graph.nodes.forEach(function(d, i) {
      label.nodes.push({ node: d });
      label.nodes.push({ node: d });
      label.links.push({
        source: i * 2,
        target: i * 2 + 1
      });
    });

    var maxFreq = d3.max(graph.nodes, d => {
      return d.freq;
    });

    graph.nodes.forEach(node => {
      const dim = sigmoid(node.freq / maxFreq) * (width * 0.7) * 2 - 76 + 90;
      var characterPattern = d3
        .select("#character-images")
        .append("pattern")
        .attr("id", `image${node.group}`)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", 1);

      var characterImage = characterPattern
        .append("image")
        .attr("x", 0)
        .attr("y", -6)
        .attr("width", dim)
        .attr("height", dim)
        .attr("href", node.img);
    });

    var graphLayout = d3
      .forceSimulation(graph.nodes)
      .force("charge", d3.forceManyBody().strength(tuning))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return sigmoid(d.freq / maxFreq) * width;
        })
      )
      .force("x", d3.forceX(width / 2).strength(1))
      .force("y", d3.forceY(height / 2).strength(1))
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id(function(d) {
            return d.id;
          })
          .distance(50)
          .strength(1)
      )
      .on("tick", ticked);

    var svg = d3
      .select(".canvas")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const tip = d3
      .tip()
      .attr("class", "tip")
      .html(d => {
        let content = `<span class="tip-name">${d.id}</span>`;
        content += `<span class="tip-count">${d.freq} words</span>`;
        document.querySelector(".tip").style.background = `${color(d.group)}`;
        return content;
      });

    svg.call(tip);

    var container = svg.append("g");

    var link = container.append("g").attr("class", "links");

    var node = container.append("g").attr("class", "nodes");

    node = node
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", d => {
        return "my-group-" + d.group + " group-" + d.group;
      })
      .attr("r", d => {
        return sigmoid(d.freq / maxFreq) * width * 0.7;
      })
      .attr("stroke", function(d) {
        return color(d.group);
      })
      .attr("stroke-width", "5px")
      .attr("fill", d => {
        return `url(#image${d.group})`;
      });

    link = link
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", d => {
        if (
          !document
            .querySelector(`circle.my-group-${d.groups[0]}`)
            .classList.contains(`group-${d.groups[1]}`)
        ) {
          document
            .querySelector(`circle.my-group-${d.groups[0]}`)
            .classList.add(`group-${d.groups[1]}`);
        }
        if (
          !document
            .querySelector(`circle.my-group-${d.groups[1]}`)
            .classList.contains(`group-${d.groups[0]}`)
        ) {
          document
            .querySelector(`circle.my-group-${d.groups[1]}`)
            .classList.add(`group-${d.groups[0]}`);
        }
        return "group-" + d.groups[0] + " group-" + d.groups[1];
      })
      .attr("stroke", "#b3b3b3")
      .attr("stroke-width", d => {
        return d.value * 1.5 + "px";
      });

    node
      .on("mouseover", (d, i, n) => {
        focus(d);
        tip.show(d, n[i]);
      })
      .on("mouseout", (d, i, n) => {
        unfocus(d);
        tip.hide();
      });

    function ticked() {
      node.call(updateNode);
      link.call(updateLink);
    }

    function focus(d) {
      const groupNum = d3.select(d3.event.target).datum().group;
      document
        .querySelectorAll(`.canvas circle:not(.group-${groupNum})`)
        .forEach(circle => {
          circle.style.opacity = 0.2;
        });
      document
        .querySelectorAll(`.canvas line:not(.group-${groupNum})`)
        .forEach(line => {
          line.style.opacity = 0.2;
        });
      document
        .querySelectorAll(`.canvas line.group-${groupNum}`)
        .forEach(line => {
          line.setAttribute("stroke", color(groupNum));
        });
    }

    function unfocus() {
      node.style("opacity", 1);
      link.style("opacity", 1);
      link.attr("stroke", "#b3b3b3");
    }

    function updateLink(link) {
      link
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });
    }

    function updateNode(node) {
      node.attr("transform", function(d) {
        let radius = sigmoid(d.freq / maxFreq) * width * 0.7;
        d.x = Math.max(radius, Math.min(width - radius, d.x));
        d.y = Math.max(radius, Math.min(height - radius, d.y));
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
  });
}

makeViz(visualisation);
