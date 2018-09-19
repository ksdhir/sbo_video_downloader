document.addEventListener('DOMContentLoaded', function() {

  $(document).ready(function(){

    $('select').selectpicker({
      noneSelectedText: 'Processing...'
    }); 


    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
      let url = document.createElement('a');
      url.href = tabs[0].url;

      if (url.host == "www.safaribooksonline.com") {

        // check if the video page in safari is opened
        let coursePage = url.pathname.match('/([0-9]+)/?');

        if (coursePage) {
          
          chrome.storage.local.get(['sbo-popup'],function(obj){


            // if the obj is empty or the url of the video is different then
            // add the data to select and run ajax

            // TODO: Save the course name and the selection option values and url
            // and save it in the popup node
            // so that the popup page doesn't run ajax again if the user is on the same page
          
            if(Object.keys(obj).length == 1 || JSON.parse(obj['sbo-popup'])['video_url'] != url.href) {

              // run ajax 
              fetchVideoContents.runAjax(url.href);

              // the course name
              // the course urls - selection options
              // button activation 

              // set the variables
              chrome.storage.local.set({'sbo-popup': JSON.stringify({ 'popup_node': "", 'video_url': url.href})}, function(){return false;});

              console.log("changes saved");
            } else {

              // append to the dom from the get variable
              let popObj = JSON.parse(obj['sbo-popup']);
             // console.log(popObj['popup_node']);
              //popObj['popup_node'].appendTo("#main");
              $("#main").html(popObj['popup_node']);


              //$('#video-drpdwn').selectpicker('refresh');
              //$('#course-drpdwn').selectpicker('refresh');

            };

          });

          


          // ask content.js for the data variable
          // to append the Course name and activate the button

          (function(){

            chrome.storage.local.get(/* String or Array */["sbo-dwn"], function (items) {
              let coursename = JSON.parse(items["sbo-dwn"]).course_name;
              (coursename) ? $("#course-name").text(coursename) : 
                $("#course-name").text(url.href.split("/")[4]);
            });

            // enable the dropdown select option list for the course
            $("#course-drpdwn").prop("disabled", false);
            $(".selectpicker[data-id='course-drpdwn']").removeClass("disabled");
            $('#course-drpdwn').selectpicker('refresh');


            // make the button active / enable it 
            $("#dwn-course-btn").prop("disabled", false).removeClass('disabled');
          })()

        } else {
          // throw an error 
          console.log("throw an error")
          // say that you should open a course link to start downloading
        }
      }




      // download video button event

      $("#dwn-video-btn").on('click', function (event) {
        event.preventDefault(); // To prevent following the link (optional)
        
        let selectedFormatArray = $.map($("#video-drpdwn").find("option:selected"), function (value, index) {
          return [value];
        });
        // fetch the url and format details from the nodes
        var selFormatObj = {};
        selectedFormatArray.forEach(function (e,i) {
          selFormatObj[i] = [e.getAttribute('data-url'),e.value];
        });

        console.log(selFormatObj)


        var port = chrome.runtime.connect({
          name: "Download Videos/Course"
        });

        port.postMessage({ type: 'video', data: selFormatObj });
        port.onMessage.addListener(function (msg) {
          // console.log("From Background.js: " + msg);
          alert(msg);
        });
      });



      // download course button event 
      $("#dwn-course-btn").on('click',function(event){
        event.preventDefault(); // Prevent the default action

        console.log($('#course-drpdwn').find("option:selected")[0].value);

        var port = chrome.runtime.connect({
          name: "Download Videos/Course"
        });

        port.postMessage({ type: 'course'});
        
        port.onMessage.addListener(function (msg) {
          // console.log("From Background.js: " + msg);
          alert(msg);
        });

      });


      //document.getElementById("myText").innerHTML = url;
    });
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
