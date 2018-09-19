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
    // console.log(val);

    $.ajax({
      type: "GET",
      dataType: "json",
      url: val,
      async: false,
      success: handleRequestSuccess.bind(this),
      error: function () { console.log('error!') }
    });


    function handleRequestSuccess(a) {
      if (a.data === null) {
        console.error("Video could not be processed");
        return;
      }
      var b = a.data;
      if (b && 1 == a.state) {
        this.renderData([b])
        // console.log([b]);
      }
    };

  },




  // the render data function
  renderData: function (b) {
    for (var c = b.length - 1; c >= 0; c--) {
      if ("string" == typeof b[c]) {
        try {
          b[c] = JSON.parse(b[c])
        }
        catch (d) {
          b.splice(c, 1)
        }
      }
    }
    // call the prepareData function
    this.prepareData(b);
    // call the renderWinData to make the table
    this.renderWinData(b);
  },

  prepareData: function (a) {
    var d = a[0];
    d.formats || (d.formats = [d]);
    for (var c = 0; c < d.formats.length; c++) {
      var f = d.formats[c];
      this.formatFile(d, f)
    }
    this.sortFormats(d.formats)
  },

  formatFile: function (b, c) {
    var d = c.format.match(/^\d+/), e = d ? Number(d[0]) : 0;
    [133, 134, 135, 136, 137, 138, 160, 264, 298, 299, 296].indexOf(e) > -1 ? (c.format = c.format.replace(/\s*\(.+?\)/g, "") + " (DASH video)", c.format_note = "DASH video") : [139, 140, 141, 171, 172].indexOf(e) > -1 && (c.format = c.format.replace(/\s*\(.+?\)/g, ""), c.format_note = "DASH audio"), c.formattedSize = this.measureSize(c.filesize) || "--", c.formattedQuality = this.formatQuality(c), c.videoAudioQuality = c.height ? c.height + "p" : c.abr ? c.abr + "Kbps" : "Unknown", c.downloadName = b._filename || b.title + "." + (c.ext || b.ext);
    var d = c.url.replace(/\?.+/, "").match("[^/]+?$");
  },

  measureSize: function (a) {
    if (!(a > 0)) return "";
    var b = ["B", "KB", "MB", "GB", "TB"];
    var c = parseInt(Math.floor(Math.log(a) / Math.log(1024)));
    var d = a / Math.pow(1024, c);
    return d = 10 > d ? d.toFixed(2) : 100 > d ? d.toFixed(1) : d.toFixed(0), d = d.replace(/\.0+$/, ""), d + " " + b[c];
  },

  formatQuality: function (a) {
    return (a.format || "").replace(/^\d+ - /, "");
  },

  sortFormats: function (a) {
    function b(a, b) {
      return a || b ? a && b ? a === b ? 0 : b > a ? 1 : -1 : a ? -1 : 1 : 0
    }
    for (var c = ["mp4", "flv", "webm", "3gp", "m4a"], d = a.length - 1; d >= 0; d--) {
      var e = a[d], f = e.format_note;
      if ("DASH video" !== f) {
        var g = e.protocol;
        if (/m3u8|hls|native|rtmp|rtsp|f4m/.test(g)) {
          a.splice(d, 1);
        }
        else if (g || !/m3u8|hls|native|rtmp/.test(e.format)) {
          var h = e.url, i = /^https?:/.test(h), j = h.replace(/\?.+/, "").match(/\.\w+$/), k = j ? j[1] : ""; g || e.format || i && "m3u8" !== k && "f4m" !== k || a.splice(d, 1)
        }
        else a.splice(d, 1)
      }
      else a.splice(d, 1)
    }
    a.sort(function (a, d) {
      var e = c.indexOf(a.ext), f = c.indexOf(d.ext);

      if (e !== f) return -1 === e ? 1 : -1 === f ? -1 : e - f;

      var g = b(a.ext, d.ext);
      if (g) return g;
      var g = b(a.width, d.width);
      if (g) return g;
      if ("DASH audio" === a.format_note) {
        var g = b(a.abr, d.abr); if (g) return g
      }
      var g = b(a.filesize, d.filesize);
      return g ? g : void 0;
    })
  },


  renderWinData: function (c) {

    if (this.type == "course") {
      // don't need to render anything
      // continue the process with downloading the whole course

      // call the function to download



      return;
    }
    //console.log(c);
    // i dunno how to use this shit
    //var d = c[0].webpage_url



    /* WINDOW RENDERING JQUERY CODE */

    // The video title
    var vid_title = c[0].title



    // add the video name
    $("#vid-name").text(vid_title);

    // prepare the html for the video dropdown
    let vid_dropdown_links = ``;

    c[0].formats.forEach(function (e) {
      vid_dropdown_links += `<option value="${e.downloadName}" data-url="${e.url}" >${e.formattedQuality}</option><br>`;
    })

    // add the video links
    $("#video-drpdwn").html(vid_dropdown_links);


    
    
    
    // enable the dropdown select option list
    $("#video-drpdwn").prop("disabled", false);
    $(".selectpicker[data-id='video-drpdwn']").removeClass("disabled");
    $('#video-drpdwn').selectpicker('refresh');
    
    // add some default text
    $('#video-drpdwn').selectpicker({
      noneSelectedText: 'Choose the video resolutions:'
    });
    $('#video-drpdwn').selectpicker('refresh');
    
    // make the button active / enable it 
    $("#dwn-video-btn").prop("disabled", false).removeClass('disabled');

    

    
    /**
     * The only rendering related to course;
     */
    // add the course links
    let course_dropdown_links = `<option value="" selected disabled>Select a resolution</option>`;

    c[0].formats.forEach(function(e,i) {
      course_dropdown_links += `<option data-idx=${i}>${e.formattedQuality}</option><br>`;
    })

    $("#course-drpdwn").html(course_dropdown_links);
    
    
    
    // The video length
    //var f = this.formatDuration(c[0].duration)
    // The video thumbnail
    //var g = c[0].thumbnail || (c[0].thumbnails ? c[0].thumbnails[0] : null)
    // 
    //var h = c.length > 1 || !c[0].formats
    
    
    // how many downloads have been made
    //var i = Number(c[0].view_count);

    //console.log(d);

    //console.log(e);
    //console.log(f);
    //console.log(g);
    //console.log(h);

    // no need of i
    //console.log(i);
  },

  formatDuration: function (a) {
    if (!a) return "";
    var b = Math.floor(a / 3600), c = Math.floor(a % 3600 / 60) || 0, d = Math.floor(a % 60) || 0;
    return (b ? String(b).padLeft(2, "0") + ":" : "") + String(c).padStart(2, "0") + ":" + String(d).padStart(2, "0")
  }

};