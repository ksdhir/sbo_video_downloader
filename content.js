 "use strict";
console.log("Chrome extension go?");

function readPage() {
  let data = {};
  let coursePage = window.location.pathname.match('/([0-9]+)/?');

  if (coursePage) {
    //console.log("Everything is loaded up correctly");

    let tocNode = document.querySelector('ol[class^=TableOfContents]');

    if(!tocNode) {
      return;
    }
    
    // the name of the course
    let courseName = window.location.pathname.split("/")[2];
    try {
      courseName = tocNode.previousSibling.children[0].children[0].innerText;
    } catch (error) {
      console.warn("The DOM has changed!");
      return;
    }
    
    // add the url
    data.url = "https://safaribooksonline.com";

    // add the course name to the object
    data.course_name = courseName;
    let chapterList = tocNode.children;
    let links = {};
    var arr = Object.values(chapterList);
    arr.forEach(function(e){
      let chapterName = e.querySelector('h3[class^=TableOfContents]').innerText;
      let chapUrls = [];
      let vidList = e.querySelector('ol');
      let vidAnchors = $(vidList).find('a');

      vidAnchors.each(function (i, vidAnchor) {
        chapUrls.push(vidAnchor.getAttribute('href'));
      });

      links[chapterName] = chapUrls;
    });
    // append it to the data function

    data.links = links;
    return data;
  
  } else {

    console.warn("Open a page with video tutorial");
  };

}
// listen for the message on runtime



// listening stops here

// readPage is only for the course
if (window.location.hostname.indexOf('www.safaribooksonline.com') >= 0) {
  
  let data = readPage();

  console.log(data);

  if(data != undefined) {





    // set the data variable if the session doesn't exist
    // or if the course page has changed
    chrome.storage.local.get(['sbo-dwn'], function (sbodata) {
      if (sbodata["sbo-dwn"] == undefined || JSON.stringify(data) != sbodata["sbo-dwn"]) {
        chrome.storage.local.set({ "sbo-dwn": JSON.stringify(data) }, function () {
          return true;
        })
      }
    });

  } else {
    console.warn("couldn't process the data try reloading the page");
  };

}