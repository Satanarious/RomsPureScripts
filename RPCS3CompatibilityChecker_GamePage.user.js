// ==UserScript==
// @name         RPCS3 Compatibility Checker(Game Page)
// @namespace    https://github.com/Satanarious
// @version      0.1
// @description  Check and display the compatibility status of RPCS3 games on the PS3 page of RomsPure Game Page
// @author       Satanarious
// @license      MIT License
// @copyright    2023+, Satyam Singh Niranjan, https://github.com/Satanarious
// @match        https://romspure.cc/roms/sony-playstation-3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=romspure.cc
// @updateURL    https://raw.githubusercontent.com/Satanarious/RomsPureScripts/master/RPCS3CompatibilityChecker_GamePage.js
// @downloadURL  https://raw.githubusercontent.com/Satanarious/RomsPureScripts/master/RPCS3CompatibilityChecker_GamePage.js
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      gist.githubusercontent.com
// @connect      cdnjs.cloudflare.com
// @connect      cdn.jsdelivr.net
// @run-at       document-end
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
  // Add Currently Opened Game Compatibility Status
  const currentGameName = document.querySelector("#primary > h1").textContent;
  const tableBody = document.querySelector(
    "#primary > div.row > div.col-12.col-sm-8 > div > div.col-12.col-md-9 > table > tbody"
  );
  checkCompatibility(currentGameName)
    .then((compatibility) => {
      tableBody.innerHTML += `<tr><th style='color:#6c757d'>RPCS3 Compatibility<td style='color:${getColourForStatus(
        compatibility
      )}'>${compatibility}</tr>`;
    })
    .catch((error) => {
      console.error("Error fetching compatibility status:", error);
    });
  // Add Popular Roms Compatibility Status
  const popularWidgets = document
    .querySelector("#secondary > section")
    .getElementsByClassName("media mb-3");
  Array.prototype.slice.call(popularWidgets).forEach((widget, index) => {
    const gameArtSelector = widget.getElementsByTagName("a")[0];
    const gameNameSelector = widget.querySelector("div > h5").textContent;
    checkCompatibility(gameNameSelector)
      .then((compatibilityStatus) => {
        gameArtSelector.style.border = `4px solid ${getColourForStatus(
          compatibilityStatus
        )}`;
        console.log(
          `Compatibility status for ${gameNameSelector}: ${compatibilityStatus}`
        );
      })
      .catch((error) => {
        console.error("Error fetching compatibility status:", error);
      });
  });
  // Add Recommended Roms Compatibility Status
  const recommendedWidgets = document
    .querySelector("#primary > section:nth-child(9)")
    .getElementsByClassName("col-12 col-sm-6 mb-4");
  Array.prototype.slice.call(recommendedWidgets).forEach((widget, index) => {
    const gameArtSelector = widget.querySelector("div.media > a");
    const gameNameSelector = widget.querySelector(
      "div.media > div.media-body > h3 > a"
    ).textContent;
    checkCompatibility(gameNameSelector)
      .then((compatibilityStatus) => {
        gameArtSelector.style.border = `4px solid ${getColourForStatus(
          compatibilityStatus
        )}`;
        console.log(
          `Compatibility status for ${gameNameSelector}: ${compatibilityStatus}`
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
