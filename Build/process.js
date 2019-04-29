const fs = require("fs");

function capitalize(string) {
  const processedArray = string.split(" ").map(part => {
    const lowered = part.toLowerCase();
    return lowered.charAt(0).toUpperCase() + lowered.slice(1);
  });
  var result = "";
  processedArray.forEach(part => {
    result += " " + part;
  });
  return result.slice(1);
}

function makeResultantJson(
  rawCountsDataFile,
  rawLinksDataFile,
  text,
  fileName
) {
  var groups = [];
  var groupCounter = 0;
  const nodes = Object.keys(rawCountsDataFile).flatMap(key => {
    var id = capitalize(key.replace(".", ""));
    switch (id) {
      // Hamlet cases
      case "King":
        id = "King Claudius";
        break;
      case "Queen":
        id = "Queen Gertrude";
        break;
      // Othello cases
      case "Duke":
        id = "Duke of Venice";
        break;
      // King Lear cases
      case "Lear":
        id = "King Lear";
        break;
      case "Albany":
        id = "Duke of Albany";
        break;
      case "Cornwall":
        id = "Duke of Cornwall";
        break;
      case "France":
        id = "King of France";
        break;
      case "Burgundy":
        id = "Duke of Burgundy";
        break;
      case "Gloucester":
        id = "Earl of Gloucester";
        break;
      case "Kent":
        id = "Earl of Kent";
        break;
      case "Oldman":
        id = "Old Man";
        break;
      default:
        break;
    }
    if (rawCountsDataFile[key] > 0) {
      groupCounter++;
      groups.push(id);
      return {
        id,
        freq: rawCountsDataFile[key],
        img: `./Assets-webp/${text}/${id
          .split(" ")
          .join("")
          .toLowerCase()}.webp`,
        group: groupCounter
      };
    } else {
      return [];
    }
  });

  const links = Object.keys(rawLinksDataFile).flatMap(key => {
    var source = key.split("-")[0];
    switch (source) {
      // Macbeth cases
      case "LadyMB":
        source = "Lady Macbeth";
        break;
      case "LadyMD":
        source = "Lady Macduff";
        break;
      case "YS":
        source = "Young Siward";
        break;
      // Hamlet cases
      case "King":
        source = "King Claudius";
        break;
      case "Queen":
        source = "Queen Gertrude";
        break;
      // Othello cases
      case "Duke":
        source = "Duke of Venice";
        break;
      // King Lear cases
      case "Lear":
        source = "King Lear";
        break;
      case "Albany":
        source = "Duke of Albany";
        break;
      case "Cornwall":
        source = "Duke of Cornwall";
        break;
      case "France":
        source = "King of France";
        break;
      case "Burgundy":
        source = "Duke of Burgundy";
        break;
      case "Gloucester":
        source = "Earl of Gloucester";
        break;
      case "Kent":
        source = "Earl of Kent";
        break;
      case "Oldman":
        source = "Old Man";
        break;

      default:
        break;
    }
    var target = key.split("-")[1];
    switch (target) {
      // Macbeth cases
      case "LadyMB":
        target = "Lady Macbeth";
        break;
      case "LadyMD":
        target = "Lady Macduff";
        break;
      case "YS":
        target = "Young Siward";
        break;
      // Hamlet cases
      case "King":
        target = "King Claudius";
        break;
      case "Queen":
        target = "Queen Gertrude";
        break;
      // Othello cases
      case "Duke":
        target = "Duke of Venice";
        break;
      // King Lear cases
      case "Lear":
        target = "King Lear";
        break;
      case "Albany":
        target = "Duke of Albany";
        break;
      case "Cornwall":
        target = "Duke of Cornwall";
        break;
      case "France":
        target = "King of France";
        break;
      case "Burgundy":
        target = "Duke of Burgundy";
        break;
      case "Gloucester":
        target = "Earl of Gloucester";
        break;
      case "Kent":
        target = "Earl of Kent";
        break;
      case "Oldman":
        target = "Old Man";
        break;
      default:
        break;
    }

    if (groups.includes(source) && groups.includes(target)) {
      return {
        source,
        target,
        groups: [groups.indexOf(source) + 1, groups.indexOf(target) + 1],
        value: rawLinksDataFile[key]
      };
    } else {
      return [];
    }
  });

  const result = {
    nodes,
    links
  };

  fs.writeFile(
    `./processed/${text}/${fileName}.json`,
    JSON.stringify(result),
    "utf8",
    function(err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    }
  );
}

var macbethRawCountsDataOverall = require("./raw/count/Macbeth/macbethRawCountsDataOverall.json");
var macbethRawCountsDataOne = require("./raw/count/Macbeth/macbethRawCountsDataOne.json");
var macbethRawCountsDataTwo = require("./raw/count/Macbeth/macbethRawCountsDataTwo.json");
var macbethRawCountsDataThree = require("./raw/count/Macbeth/macbethRawCountsDataThree.json");
var macbethRawCountsDataFour = require("./raw/count/Macbeth/macbethRawCountsDataFour.json");
var macbethRawCountsDataFive = require("./raw/count/Macbeth/macbethRawCountsDataFive.json");

var macbethRawLinksDataOverall = require("./raw/links/Macbeth/macbethRawLinksDataOverall.json");
var macbethRawLinksDataOne = require("./raw/links/Macbeth/macbethRawLinksDataOne.json");
var macbethRawLinksDataTwo = require("./raw/links/Macbeth/macbethRawLinksDataTwo.json");
var macbethRawLinksDataThree = require("./raw/links/Macbeth/macbethRawLinksDataThree.json");
var macbethRawLinksDataFour = require("./raw/links/Macbeth/macbethRawLinksDataFour.json");
var macbethRawLinksDataFive = require("./raw/links/Macbeth/macbethRawLinksDataFive.json");

var hamletRawCountsDataOverall = require("./raw/count/Hamlet/hamletRawCountsDataOverall.json");
var hamletRawCountsDataOne = require("./raw/count/Hamlet/hamletRawCountsDataOne.json");
var hamletRawCountsDataTwo = require("./raw/count/Hamlet/hamletRawCountsDataTwo.json");
var hamletRawCountsDataThree = require("./raw/count/Hamlet/hamletRawCountsDataThree.json");
var hamletRawCountsDataFour = require("./raw/count/Hamlet/hamletRawCountsDataFour.json");
var hamletRawCountsDataFive = require("./raw/count/Hamlet/hamletRawCountsDataFive.json");

var hamletRawLinksDataOverall = require("./raw/links/Hamlet/hamletRawLinksDataOverall.json");
var hamletRawLinksDataOne = require("./raw/links/Hamlet/hamletRawLinksDataOne.json");
var hamletRawLinksDataTwo = require("./raw/links/Hamlet/hamletRawLinksDataTwo.json");
var hamletRawLinksDataThree = require("./raw/links/Hamlet/hamletRawLinksDataThree.json");
var hamletRawLinksDataFour = require("./raw/links/Hamlet/hamletRawLinksDataFour.json");
var hamletRawLinksDataFive = require("./raw/links/Hamlet/hamletRawLinksDataFive.json");

var othelloRawCountsDataOverall = require("./raw/count/Othello/othelloRawCountsDataOverall.json");
var othelloRawCountsDataOne = require("./raw/count/Othello/othelloRawCountsDataOne.json");
var othelloRawCountsDataTwo = require("./raw/count/Othello/othelloRawCountsDataTwo.json");
var othelloRawCountsDataThree = require("./raw/count/Othello/othelloRawCountsDataThree.json");
var othelloRawCountsDataFour = require("./raw/count/Othello/othelloRawCountsDataFour.json");
var othelloRawCountsDataFive = require("./raw/count/Othello/othelloRawCountsDataFive.json");

var othelloRawLinksDataOverall = require("./raw/links/Othello/othelloRawLinksDataOverall.json");
var othelloRawLinksDataOne = require("./raw/links/Othello/othelloRawLinksDataOne.json");
var othelloRawLinksDataTwo = require("./raw/links/Othello/othelloRawLinksDataTwo.json");
var othelloRawLinksDataThree = require("./raw/links/Othello/othelloRawLinksDataThree.json");
var othelloRawLinksDataFour = require("./raw/links/Othello/othelloRawLinksDataFour.json");
var othelloRawLinksDataFive = require("./raw/links/Othello/othelloRawLinksDataFive.json");

var kinglearRawCountsDataOverall = require("./raw/count/Kinglear/kinglearRawCountsDataOverall.json");
var kinglearRawCountsDataOne = require("./raw/count/Kinglear/kinglearRawCountsDataOne.json");
var kinglearRawCountsDataTwo = require("./raw/count/Kinglear/kinglearRawCountsDataTwo.json");
var kinglearRawCountsDataThree = require("./raw/count/Kinglear/kinglearRawCountsDataThree.json");
var kinglearRawCountsDataFour = require("./raw/count/Kinglear/kinglearRawCountsDataFour.json");
var kinglearRawCountsDataFive = require("./raw/count/Kinglear/kinglearRawCountsDataFive.json");

var kinglearRawLinksDataOverall = require("./raw/links/Kinglear/kinglearRawLinksDataOverall.json");
var kinglearRawLinksDataOne = require("./raw/links/Kinglear/kinglearRawLinksDataOne.json");
var kinglearRawLinksDataTwo = require("./raw/links/Kinglear/kinglearRawLinksDataTwo.json");
var kinglearRawLinksDataThree = require("./raw/links/Kinglear/kinglearRawLinksDataThree.json");
var kinglearRawLinksDataFour = require("./raw/links/Kinglear/kinglearRawLinksDataFour.json");
var kinglearRawLinksDataFive = require("./raw/links/Kinglear/kinglearRawLinksDataFive.json");

// Make Macbeth
makeResultantJson(
  macbethRawCountsDataOverall,
  macbethRawLinksDataOverall,
  "Macbeth",
  "macbethActOverall"
);
makeResultantJson(
  macbethRawCountsDataOne,
  macbethRawLinksDataOne,
  "Macbeth",
  "macbethActOne"
);
makeResultantJson(
  macbethRawCountsDataTwo,
  macbethRawLinksDataTwo,
  "Macbeth",
  "macbethActTwo"
);
makeResultantJson(
  macbethRawCountsDataThree,
  macbethRawLinksDataThree,
  "Macbeth",
  "macbethActThree"
);
makeResultantJson(
  macbethRawCountsDataFour,
  macbethRawLinksDataFour,
  "Macbeth",
  "macbethActFour"
);
makeResultantJson(
  macbethRawCountsDataFive,
  macbethRawLinksDataFive,
  "Macbeth",
  "macbethActFive"
);

// Make Hamlet
makeResultantJson(
  hamletRawCountsDataOverall,
  hamletRawLinksDataOverall,
  "Hamlet",
  "hamletActOverall"
);
makeResultantJson(
  hamletRawCountsDataOne,
  hamletRawLinksDataOne,
  "Hamlet",
  "hamletActOne"
);
makeResultantJson(
  hamletRawCountsDataTwo,
  hamletRawLinksDataTwo,
  "Hamlet",
  "hamletActTwo"
);
makeResultantJson(
  hamletRawCountsDataThree,
  hamletRawLinksDataThree,
  "Hamlet",
  "hamletActThree"
);
makeResultantJson(
  hamletRawCountsDataFour,
  hamletRawLinksDataFour,
  "Hamlet",
  "hamletActFour"
);
makeResultantJson(
  hamletRawCountsDataFive,
  hamletRawLinksDataFive,
  "Hamlet",
  "hamletActFive"
);

// Make Othello
makeResultantJson(
  othelloRawCountsDataOverall,
  othelloRawLinksDataOverall,
  "Othello",
  "othelloActOverall"
);
makeResultantJson(
  othelloRawCountsDataOne,
  othelloRawLinksDataOne,
  "Othello",
  "othelloActOne"
);
makeResultantJson(
  othelloRawCountsDataTwo,
  othelloRawLinksDataTwo,
  "Othello",
  "othelloActTwo"
);
makeResultantJson(
  othelloRawCountsDataThree,
  othelloRawLinksDataThree,
  "Othello",
  "othelloActThree"
);
makeResultantJson(
  othelloRawCountsDataFour,
  othelloRawLinksDataFour,
  "Othello",
  "othelloActFour"
);
makeResultantJson(
  othelloRawCountsDataFive,
  othelloRawLinksDataFive,
  "Othello",
  "othelloActFive"
);

// Make King Lear
makeResultantJson(
  kinglearRawCountsDataOverall,
  kinglearRawLinksDataOverall,
  "Kinglear",
  "kinglearActOverall"
);
makeResultantJson(
  kinglearRawCountsDataOne,
  kinglearRawLinksDataOne,
  "Kinglear",
  "kinglearActOne"
);
makeResultantJson(
  kinglearRawCountsDataTwo,
  kinglearRawLinksDataTwo,
  "Kinglear",
  "kinglearActTwo"
);
makeResultantJson(
  kinglearRawCountsDataThree,
  kinglearRawLinksDataThree,
  "Kinglear",
  "kinglearActThree"
);
makeResultantJson(
  kinglearRawCountsDataFour,
  kinglearRawLinksDataFour,
  "Kinglear",
  "kinglearActFour"
);
makeResultantJson(
  kinglearRawCountsDataFive,
  kinglearRawLinksDataFive,
  "Kinglear",
  "kinglearActFive"
);
