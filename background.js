console.log("heyeheyeheyeheyeheyehey")

chrome.runtime.onConnect.addListener(function (port) {
  
  port.onMessage.addListener(function (msg) {

    console.log(msg.link);

    fetchVideoContents.runAjax(msg.link,'video')

    return;
    if (msg.joke == "Knock knock")
      port.postMessage({ question: "Who's there?" });
    else if (msg.answer == "Madame")
      port.postMessage({ question: "Madame who?" });
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({ question: "I don't get it." });
  });
});








var fetchVideoContents = {

  type: "",

  useQuery: function (a, b) {
    var c = a.includes("?");
    if ("string" == typeof b) return a + (c ? "&" : "?") + b;
    for (var d in b) {
      var e = encodeURIComponent(b[d]); a += (c ? "&" : "?") + d + "=" + e, c = !0
    }
    return a;
  },
  prepareURL: function (currentURL) {
    var fetchURL = this.useQuery("https://api.videograbber.net/api/video", { uri: window.btoa(currentURL) });
    return fetchURL;
  },

  runAjax: function (currentURL, button) {
    
    this.type = button;
    let val = this.prepareURL(currentURL);

    var myReq = new XMLHttpRequest();

    myReq.open('GET', val);

    myReq.onreadystatechange = function(){
      if(myReq.readyState === 4) {
        console.log(myReq.responseText);
        // port.postMessage(myReq.responseText);
      }
    }
    
    myReq.send();

    
    
    // return; // end the statement


    // $.ajax({
    //   type: "GET",
    //   dataType: "json",
    //   url: val,
    //   async: false,
    //   success: handleRequestSuccess.bind(this),
    //   error: function () { console.log('error!') }
    // });


    // function handleRequestSuccess(a) {
    //   if (a.data === null) {
    //     console.error("Video could not be processed");
    //     return;
    //   }
    //   var b = a.data;
    //   console.log(b);
    // };

  }
}