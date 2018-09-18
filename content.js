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

    // get the course url
    let courseUrl = window.location.href.split('/').slice(0, 5).join('/');
  

    // add the course url
    data.course_url = courseUrl;
  
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
if (window.location.hostname.indexOf('www.safaribooksonline.com') >= 0 && window.location.href.split('/').length > 6) {

    console.log("in here");

  // set the data variable if the variable doesn't exist
  // or if the course url has changed
  chrome.storage.local.get(['sbo-dwn'], function (sbodata) {
    let courseUrl = window.location.href.split('/').slice(0, 5).join('/');
    
    
    if (sbodata["sbo-dwn"] == undefined || JSON.parse(sbodata['sbo-dwn'])['course_url'] != courseUrl) {
      console.log("update kia");

      let data = readPage();
      if(data != undefined) {
        chrome.storage.local.set({ "sbo-dwn": JSON.stringify(data) }, function () {
          return true;
        })
      } else {
        console.error("Could not process the page, please try reloading!")
      }

    }
  });



}