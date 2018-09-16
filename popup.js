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
          // run the ajax function to process everything



          // var port = chrome.runtime.connect({ name: "data transfer" });
          // port.postMessage({ link: url.href });
          // port.onMessage.addListener(function (msg) {
          //   console.log(msg);
          // });











          fetchVideoContents.runAjax(url.href);


          // ask content.js for the data variable

          (function(){
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, function (tab) {

              chrome.tabs.sendMessage(tab[0].id, { for: 'content.js', msg: "coursename" }, 
                // add the course name to the popup html
              function (coursename) {

                $("#course-name").text(coursename);
                (coursename) ? $("#course-name").text(coursename) : $("#course-name").text(url.href.split("/")[4]);                
              });

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
