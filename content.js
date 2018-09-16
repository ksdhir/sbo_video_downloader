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


  if(data != undefined) {


    
    // console.log(data);

    chrome.runtime.onMessage.addListener(gotMessage);

    function gotMessage(message, sender, sendResponse) {
      
      

      if (message.for === "content.js" && message.msg == "coursename") {
        sendResponse(data.course_name);
      }
    }




  } else {
    console.warn("couldn't process the data try reloading the page");
    //setTimeout(function(){},5000);
  };

}