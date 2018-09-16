chrome.runtime.onConnect.addListener(function (port) {
  
  port.onMessage.addListener(function (msg) {
      if(msg.type == 'video') {
      port.postMessage("Your download(s) will start soon!");
      
      let links = msg.data;
      for (var key in links) {
        downloadVideos(links[key][0],links[key][1]);
      }
    };
  });
  

});


function downloadVideos(url,name) {

  chrome.downloads.download({
    url: url,
    filename: name, // Optional
    saveAs: false
  });

};