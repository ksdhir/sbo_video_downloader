document.addEventListener('DOMContentLoaded', function() {

  // chrome.tabs.query({
  //   active: true,
  //   currentWindow: true
  // }, function (tab) {

  //   chrome.tabs.sendMessage(tab[0].id, { for: 'background.js', msg: "oyeeeee"});

  // });



  




  $('select').selectpicker({
    noneSelectedText: 'Processing...'
  });


  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    let url = document.createElement('a');
    url.href= tabs[0].url;

    if(url.host == "www.safaribooksonline.com") {
      
      // check if the video page in safari is opened
      let coursePage = url.pathname.match('/([0-9]+)/?');

      if(coursePage) {
        // run the ajax function to process everything

        

        // var port = chrome.runtime.connect({ name: "data transfer" });
        // port.postMessage({ link: url.href });
        // port.onMessage.addListener(function (msg) {
        //   console.log(msg);
        // });











        fetchVideoContents.runAjax(url.href, "video");


        // ask content.js for the data variable

        



        //console.log("all good");
      } else {
        // throw an error 
        console.log("throw an error")
        // say that you should open a course link to start downloading
      }
    }

    // download video button event

   $("#dwn-video-btn").on('click', function (event) {
    event.preventDefault(); // To prevent following the link (optional)
    var selectedVideo = $("#video-drpdwn").find("option:selected");

     //messenger({ type: 'videos', data: selectedVideo });

    //  var port = chrome.runtime.connect({
    //    name: "Download Videos/Course"
    //  });
    //  port.postMessage("message");
    //  port.onMessage.addListener(function (msg) {
    //    console.log("message recieved" + msg);
    //  });






    
    selectedVideo.each(function(i,e){
      console.log(e)
      downloadVideos($(e).attr("data-url"),$(e).val())
    })

    });
    

    //document.getElementById("myText").innerHTML = url;
  });


  return;

  // function downloadVideos(url,name,type="video") {
    
  //   chrome.downloads.download({
  //     url: url,
  //     filename: name, // Optional
  //     saveAs: false
  //   });

  // };








  return;

  // get the url of the code

    //console.log(window.location.pathname);

    //console.log("h");
    // var btn = document.getElementById('btn');
    // onClick's logic below:
    // btn.addEventListener('click', function() {

    //   let params = {
    //     active: true,
    //     currentWindow: true
    //   }

    //   chrome.tabs.query(params,gotTab);

    //   function gotTab(tab) {
    //     let message = $;
    //     console.log(message);

    //     chrome.tabs.sendMessage(tab[0].id,"message");

    //     //console.log("hey")
    //     //console.log(tab);
    //     //console.log(chrome.tabs)
    //   }

    // });

});
