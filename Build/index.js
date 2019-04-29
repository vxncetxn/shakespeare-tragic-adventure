var width = 760;
var height = 680;
var color = d3.scaleOrdinal(d3.schemeCategory10);

function sigmoid(t) {
  return 1 / (1 + Math.pow(Math.E, -t)) - 0.47;
}

var visualisation = "macbethActOverall";
var text = "macbeth";
var tuning = -2300;
var collision = 700;

function handleSelectChange() {
  collision = 700;
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
      if (text === "hamlet" || text === "othello") {
        tuning = -2800;
      } else if (text === "kinglear") {
        tuning = -800;
      } else {
        tuning = -2700;
      }
      break;
    case "Act II":
      visualisation = `${text}ActTwo`;
      if (text === "othello") {
        tuning = -3000;
      } else if (text === "kinglear") {
        collision = 600;
        tuning = -600;
      } else if (text === "macbeth") {
        tuning = -2700;
      } else {
        tuning = -3200;
      }
      break;
    case "Act III":
      visualisation = `${text}ActThree`;
      if (text === "kinglear") {
        collision = 550;
        tuning = -700;
      } else if (text === "othello") {
        tuning = -3000;
      } else {
        tuning = -2700;
      }
      break;
    case "Act IV":
      visualisation = `${text}ActFour`;
      if (text === "othello") {
        collision = 600;
        tuning = -300;
      } else if (text === "kinglear") {
        collision = 575;
        tuning = -150;
      } else {
        tuning = -2600;
      }
      break;
    case "Act V":
      visualisation = `${text}ActFive`;
      if (text === "kinglear") {
        collision = 600;
        tuning = -700;
      } else if (text === "othello") {
        tuning = -2400;
      } else {
        tuning = -2500;
      }
      break;
    default:
      visualisation = `${text}ActOverall`;
      if (text === "kinglear") {
        collision = 600;
        tuning = -500;
      } else if (text === "othello") {
        tuning = -2400;
      } else {
        tuning = -2300;
      }
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
  makeViz(visualisation, tuning);
}

function makeViz(viz, tune) {
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
      const dim = sigmoid(node.freq / maxFreq) * 500 * 2 - 76 + 90;
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
      .force("charge", d3.forceManyBody().strength(tune))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return sigmoid(d.freq / maxFreq) * collision;
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
    // .style("border", "1px solid black");

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
        return sigmoid(d.freq / maxFreq) * 500;
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

    function fixna(x) {
      if (isFinite(x)) return x;
      return 0;
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
          return fixna(d.source.x);
        })
        .attr("y1", function(d) {
          return fixna(d.source.y);
        })
        .attr("x2", function(d) {
          return fixna(d.target.x);
        })
        .attr("y2", function(d) {
          return fixna(d.target.y);
        });
    }

    function updateNode(node) {
      node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
      });
    }
  });
}

makeViz(visualisation, tuning);
