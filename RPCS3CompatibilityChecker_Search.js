// ==UserScript==
// @name         RPCS3 Compatibility Checker(Search)
// @namespace    https://github.com/Satanarious
// @version      0.1
// @description  Check and display the compatibility status of RPCS3 games on the PS3 page of RomsPure Search
// @author       Satanarious
// @match        https://romspure.cc/roms/sony-playstation-3?*
// @match        https://romspure.cc/roms/sony-playstation-3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=romspure.cc
// @updateURL    https://raw.githubusercontent.com/Satanarious/RomsPureScripts/master/RPCS3CompatibilityChecker_Search.js
// @downloadURL  https://raw.githubusercontent.com/Satanarious/RomsPureScripts/master/RPCS3CompatibilityChecker_Search.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // Add a button to each game row
  const form = document.getElementsByTagName("form")[0];
  form.innerHTML +=
    "<h4>Border Colours for RPCS3 Compatibility are as follows:<br></h4>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#24e275;text-decoration:underline;'>Playable</div> : Games that can be completed with playable performance and no game breaking glitches</h5>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#007dfb;text-decoration:underline;'>Ingame</div> : Games that either can't be finished, have serious glitches or have insufficient performance</h5>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#faa607;text-decoration:underline;'>Intro</div> : Games that display image but don't make it past the menus</h5>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#ee301d;text-decoration:underline;'>Loadable</div> : Games that display a black screen with a framerate on the window's title</h5>";
  const table = document.getElementsByTagName("table")[0];
  const gameRows = table.rows;
  Array.prototype.slice.call(gameRows).forEach((row, index) => {
    if (index === 0) {
      return;
    }
    const gameArtSelector = gameRows[index].querySelector("td:nth-child(1)> a");
    const gameName = gameRows[index].querySelector(
      "td:nth-child(2) > a"
    ).textContent;
    checkCompatibility(gameName)
      .then((compatibilityStatus) => {
        gameArtSelector.style.border = `4px solid ${getColourForStatus(
          compatibilityStatus
        )}`;
        console.log(
          `Compatibility status for ${gameName}: ${compatibilityStatus}`
        );
      })
      .catch((error) => {
        console.error("Error fetching compatibility status:", error);
      });
  });

  // Function to fetch compatibility status
  function checkCompatibility(gameName) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://rpcs3.net/compatibility?g=${gameName}#jump`,
        onload: function (response) {
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(
            response.responseText,
            "text/html"
          );
          const compatibilityStatus =
            htmlDoc.querySelector(
              "div.compat-table-cell.compat-table-cell-status > div"
            )?.textContent || "Unknown";
          resolve(compatibilityStatus);
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  // Function to get color based on compatibility status
  function getColourForStatus(status) {
    switch (status) {
      case "Playable":
        return "#24e275";
      case "Ingame":
        return "#007dfb";
      case "Intro":
        return "#faa607";
      case "Loadable":
        return "#ee301d";
      default:
        return "#000000"; // Default color
    }
  }
})();
