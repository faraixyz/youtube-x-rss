(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // ns-hugo:/home/runner/work/youtube-x-rss/youtube-x-rss/assets/js/ytxr/ytxr-lib.js
  var require_ytxr_lib = __commonJS((exports, module) => {
    URL = URL || require("url").URL;
    var InvalidURLError2 = Error("URLs must be on one of these domains: m.youtube.com, youtube.com, youtu.be or www.youtube.com");
    InvalidURLError2.name = "InvalidURLError";
    var UnsupportedURLError = Error("That URL is not supported yet");
    UnsupportedURLError.name = "UnsupportedURLError";
    function getRSSFeed2(url) {
      const BASE_YT_RSS_FEED_URL = "https://www.youtube.com/feeds/videos.xml?";
      const VALID_HOST_NAMES = ["m.youtube.com", "www.youtube.com", "youtube.com", "youtu.be"];
      const urlObj = new URL(url);
      if (VALID_HOST_NAMES.indexOf(urlObj.hostname) === -1) {
        throw InvalidURLError2;
      }
      if (urlObj.searchParams.get("list")) {
        return BASE_YT_RSS_FEED_URL + "playlist_id=" + urlObj.searchParams.get("list");
      }
      const splitPath = urlObj.pathname.split("/");
      const type = splitPath[1];
      const id = splitPath[2];
      switch (type) {
        case "user":
          return BASE_YT_RSS_FEED_URL + "user=" + id;
        case "channel":
          return BASE_YT_RSS_FEED_URL + "channel_id=" + id;
        default:
          throw UnsupportedURLError;
      }
    }
    module.exports = {
      InvalidURLError: InvalidURLError2,
      UnsupportedURLError,
      getRSSFeed: getRSSFeed2
    };
  });

  // <stdin>
  var YTXR = __toModule(require_ytxr_lib());
  var rssForm = document.forms["rssForm"];
  var urlInput = rssForm.url;
  var outputArea = document.querySelector(".feed-output");
  var outputURLArea = document.getElementById("feed-output__area");
  var outputLink = document.getElementById("feed-output__link");
  var outputCopy = document.querySelector("button[data-copy]");
  var outputShare = document.querySelector("button[data-share]");
  var outputStatus = document.getElementById("output__status");
  if ("share" in navigator) {
    outputShare.hidden = false;
  }
  urlInput.addEventListener("change", function() {
    urlInput.setCustomValidity("");
    urlInput.checkValidity();
  });
  urlInput.addEventListener("invalid", function() {
    urlInput.setCustomValidity(YTXR.InvalidURLError.message);
  });
  rssForm.addEventListener("submit", function(event) {
    event.preventDefault();
    try {
      const url = urlInput.value;
      const rssFeedURL = YTXR.getRSSFeed(url);
      showFeedURL(rssFeedURL);
      urlInput.setCustomValidity("");
      outputCopy.focus();
    } catch (error) {
      console.error(error);
      urlInput.setCustomValidity(error.message);
      urlInput.reportValidity();
    }
  });
  function showFeedURL(url) {
    outputArea.hidden = false;
    outputURLArea.value = url;
    outputLink.href = url;
  }
  function flashMsg(msg) {
    outputStatus.innerText = msg;
    setTimeout(function() {
      outputStatus.innerHTML = "&nbsp;";
    }, 5e3);
  }
  outputCopy.addEventListener("click", function(e) {
    outputURLArea.select();
    document.execCommand("copy");
    flashMsg("URL Copied");
    outputURLArea.setSelectionRange(0, 0);
  });
  outputShare.addEventListener("click", async function() {
    try {
      await navigator.share({
        url: outputURLArea.value
      });
      flashMsg("URL shared");
    } catch (e) {
      console.error(e);
      flashMsg("Something went wrong.");
    }
  });
})();
