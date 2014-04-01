serialize = function(obj) {
  var str = [];
  for(var p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
};


function importJS(scriptPath, callback)
{
    var scriptNode = document.createElement('SCRIPT');
    scriptNode.type = 'text/javascript';
    scriptNode.src = scriptPath;

    var headNode = document.getElementsByTagName('HEAD');
    if (headNode[0] !== null)
        headNode[0].appendChild(scriptNode);

    if (callback !== null)
    {
        scriptNode.onreadystagechange = callback;
        scriptNode.onload = callback;
    }
}


function closeSuccessMessage(){
    jQuery("#snippet-loader").remove();
}


function importCSS(href, look_for, onload) {
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', href);
  if (onload) wait_for_script_load(look_for, onload);
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}


function wait_for_script_load(look_for, callback) {
  var interval = setInterval(function() {
    if (eval("typeof " + look_for) != 'undefined') {
      clearInterval(interval);
      callback();
    }
  }, 50);
}


function show_loader_pane() {
  jQuery('body').append('<div id="snippet-loader">Loading Clip</div>');
    var opts = {
      lines: 13, // The number of lines to draw
      length: 7, // The length of each line
      width: 4, // The line thickness
      radius: 10, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      color: '#fff', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    var spinner = new Spinner(opts).spin(document.getElementById('snippet-loader'));
}


function make_inline_styles(vanilla_js_obj, ignore_styles) {

  defaults = {
    "alignmentBaseline": "auto",
    "background": "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
    "backgroundAttachment": "scroll",
    "backgroundClip": "border-box",
    "backgroundColor": "rgba(0, 0, 0, 0)",
    "backgroundImage": "none",
    "backgroundOrigin": "padding-box",
    "backgroundPosition": "0% 0%",
    "backgroundPositionX": "0%",
    "backgroundPositionY": "0%",
    "backgroundRepeat": "repeat",
    "backgroundRepeatX": "",
    "backgroundRepeatY": "",
    "backgroundSize": "auto",
    "baselineShift": "baseline",
    "border": "0px none rgb(0, 0, 0)",
    "borderBottom": "0px none rgb(0, 0, 0)",
    "borderBottomColor": "rgb(0, 0, 0)",
    "borderBottomLeftRadius": "0px",
    "borderBottomRightRadius": "0px",
    "borderBottomStyle": "none",
    "borderBottomWidth": "0px",
    "borderCollapse": "separate",
    "borderColor": "rgb(0, 0, 0)",
    "borderImage": "none",
    "borderImageOutset": "0px",
    "borderImageRepeat": "stretch",
    "borderImageSlice": "100%",
    "borderImageSource": "none",
    "borderImageWidth": "1",
    "borderLeft": "0px none rgb(0, 0, 0)",
    "borderLeftColor": "rgb(0, 0, 0)",
    "borderLeftStyle": "none",
    "borderLeftWidth": "0px",
    "borderRadius": "0px",
    "borderRight": "0px none rgb(0, 0, 0)",
    "borderRightColor": "rgb(0, 0, 0)",
    "borderRightStyle": "none",
    "borderRightWidth": "0px",
    "borderSpacing": "0px 0px",
    "borderStyle": "none",
    "borderTop": "0px none rgb(0, 0, 0)",
    "borderTopColor": "rgb(0, 0, 0)",
    "borderTopLeftRadius": "0px",
    "borderTopRightRadius": "0px",
    "borderTopStyle": "none",
    "borderTopWidth": "0px",
    "borderWidth": "0px",
    "bottom": "auto",
    "boxShadow": "none",
    "boxSizing": "content-box",
    "captionSide": "top",
    "clear": "none",
    "clip": "auto",
    "clipPath": "none",
    "clipRule": "nonzero",
    "color": "rgb(0, 0, 0)",
    "colorInterpolation": "srgb",
    "colorInterpolationFilters": "linearrgb",
    "colorProfile": "",
    "colorRendering": "auto",
    "content": "",
    "counterIncrement": "",
    "counterReset": "",
    "cursor": "auto",
    "direction": "ltr",
    "display": "block",
    "dominantBaseline": "auto",
    "emptyCells": "show",
    "enableBackground": "",
    "fill": "#000000",
    "fillOpacity": "1",
    "fillRule": "nonzero",
    "filter": "none",
    "float": "none",
    "floodColor": "rgb(0, 0, 0)",
    "floodOpacity": "1",
    "font": "normal normal normal 16px/normal Times",
    "fontFamily": "Times",
    "fontSize": "16px",
    "fontStretch": "",
    "fontStyle": "normal",
    "fontVariant": "normal",
    "fontWeight": "normal",
    "glyphOrientationHorizontal": "0deg",
    "glyphOrientationVertical": "auto",
    "height": "auto",
    "imageRendering": "auto",
    "kerning": "0",
    "left": "auto",
    "length": 275,
    "letterSpacing": "normal",
    "lightingColor": "rgb(255, 255, 255)",
    "lineHeight": "normal",
    "listStyle": "disc outside none",
    "listStyleImage": "none",
    "listStylePosition": "outside",
    "listStyleType": "disc",
    "margin": "0px",
    "marginBottom": "0px",
    "marginLeft": "0px",
    "marginRight": "0px",
    "marginTop": "0px",
    "marker": "",
    "markerEnd": "none",
    "markerMid": "none",
    "markerStart": "none",
    "mask": "none",
    "maxHeight": "none",
    "maxWidth": "none",
    "minHeight": "0px",
    "minWidth": "0px",
    "opacity": "1",
    "orphans": "2",
    "outline": "rgb(0, 0, 0) none 0px",
    "outlineColor": "rgb(0, 0, 0)",
    "outlineOffset": "0px",
    "outlineStyle": "none",
    "outlineWidth": "0px",
    "overflow": "visible",
    "overflowWrap": "normal",
    "overflowX": "visible",
    "overflowY": "visible",
    "padding": "0px",
    "paddingBottom": "0px",
    "paddingLeft": "0px",
    "paddingRight": "0px",
    "paddingTop": "0px",
    "page": "",
    "pageBreakAfter": "auto",
    "pageBreakBefore": "auto",
    "pageBreakInside": "auto",
    "parentRule": null,
    "pointerEvents": "auto",
    "position": "static",
    "quotes": "",
    "resize": "none",
    "right": "auto",
    "shapeRendering": "auto",
    "size": "",
    "speak": "normal",
    "src": "",
    "stopColor": "rgb(0, 0, 0)",
    "stopOpacity": "1",
    "stroke": "none",
    "strokeDasharray": "none",
    "strokeDashoffset": "0",
    "strokeLinecap": "butt",
    "strokeLinejoin": "miter",
    "strokeMiterlimit": "4",
    "strokeOpacity": "1",
    "strokeWidth": "1",
    "tabSize": "8",
    "tableLayout": "auto",
    "textAlign": "start",
    "textAnchor": "start",
    "textDecoration": "none",
    "textIndent": "0px",
    "textLineThrough": "",
    "textLineThroughColor": "",
    "textLineThroughMode": "",
    "textLineThroughStyle": "",
    "textLineThroughWidth": "",
    "textOverflow": "clip",
    "textOverline": "",
    "textOverlineColor": "",
    "textOverlineMode": "",
    "textOverlineStyle": "",
    "textOverlineWidth": "",
    "textRendering": "auto",
    "textShadow": "none",
    "textTransform": "none",
    "textUnderline": "",
    "textUnderlineColor": "",
    "textUnderlineMode": "",
    "textUnderlineStyle": "",
    "textUnderlineWidth": "",
    "top": "auto",
    "unicodeBidi": "normal",
    "unicodeRange": "",
    "vectorEffect": "none",
    "verticalAlign": "baseline",
    "visibility": "visible",
    "whiteSpace": "normal",
    "widows": "2",
    "width": "auto",
    "wordBreak": "normal",
    "wordSpacing": "0px",
    "wordWrap": "normal",
    "writingMode": "lr-tb",
    "zIndex": "auto",
    "zoom": "1"
  };
  
  for (var i = 0; i < ignore_styles.length; i++) {
      delete defaults[ignore_styles[i]];
  }

  computed_styles = window.getComputedStyle(vanilla_js_obj);
  new_js_obj = vanilla_js_obj;

  for (var key in computed_styles) {

    if (defaults.hasOwnProperty(key) && computed_styles[key] != defaults[key]) {
      //further handling...
      
      new_js_obj.style[key] = computed_styles[key];
    }
  }

  if (new_js_obj.hasOwnProperty('href')) {
    //trick to change relative urls to absolute
    var url = new_js_obj.href;
    new_js_obj.href = url;
  }

  if (new_js_obj.hasOwnProperty('src')) {
    //trick to change relative image path to absolute
    var src = new_js_obj.src;
    new_js_obj.src = src;
  }

  return new_js_obj;
}


function activatePicker() {
    jQuery("#snippet-loader").remove();
    jQuery("#clippy-authentication").remove();
    importCSS('https://clippy.in/static/css/bookmarklet-styles.css');
    importJS('https://clippy.in/ajax/authenticate?domain=' + window.location.href);
    
    var snip_event_listener = {
      current_target: null
    };

    snip_event_listener.mouseover = function(e) {
      e.target.style.outline = "4px solid #4c88ae";
    };

    snip_event_listener.mouseout = function(e) {
      e.target.style.outline = "";
    };

    snip_event_listener.click = function(e) {
      e.preventDefault();
      importJS('https://clippy.in/static/js/spin.min.js', show_loader_pane);

      e.target.style.outline = "";
      console.log("Clippy token: " + jQuery('#clippy-authentication').contents());

      //remove the event listeners
      document.body.removeEventListener("mouseover", snip_event_listener.mouseover, true);
      document.body.removeEventListener("mouseout",  snip_event_listener.mouseout,  true);
      document.body.removeEventListener("click",     snip_event_listener.click,     true);


      html_jq = jQuery(e.target); //gets html including self
      //check on the length
      // if (html_jq.html().length > 16000) {
        console.log(html_jq.html().length);
      // }
      html_js_obj = jQuery(html_jq).get(0); //creates a vanilla js object from a jquery object
      inline_html = html_jq.clone(); //starting element for recursive loop, creates a vanilla javascript object
      ignore_styles = [
        "border",
        "borderBottom",
        "borderBottomColor",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
        "borderBottomStyle",
        "borderBottomWidth",
        "borderCollapse",
        "borderColor",
        "borderLeft",
        "borderLeftColor",
        "borderLeftStyle",
        "borderLeftWidth",
        "borderRadius",
        "borderRight",
        "borderRightColor",
        "borderRightStyle",
        "borderRightWidth",
        "borderSpacing",
        "borderStyle",
        "borderTop",
        "borderTopColor",
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderTopStyle",
        "borderTopWidth",
        "borderWidth",
        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "outline",
        "outlineStyle",
        "outlineColor",
        "outlineWidth",
        "width"
      ];

      inline_html_js_obj = make_inline_styles(html_js_obj, ignore_styles=ignore_styles);
      // console.log("html_jq");
      // console.log(html_jq);
      // console.log("---------------------------------");
      // console.log("html_js_obj");
      // console.log(html_js_obj);
      // console.log("---------------------------------");
      // console.log("inline_html");
      // console.log(inline_html);
      // console.log("---------------------------------");
      // console.log("inline_html_js_obj");
      // console.log(inline_html_js_obj);
      // console.log("---------------------------------");

      
      items = html_js_obj.getElementsByTagName("*");
      inline_items = inline_html_js_obj.getElementsByTagName("*");
      for (var i = items.length; i--;) {
        
        new_element = make_inline_styles(items[i], ignore_styles=[]);
        if (new_element.tagName != 'SCRIPT') {
          var a = inline_items[i].parentNode.replaceChild(new_element, inline_items[i]);
          // console.log(a);
        }
        
        

      }

      html = jQuery(inline_html_js_obj).wrap('<div></div>').parent().html();
      data = {
          'code': jQuery('#clippy-authentication').val(),
          'url': window.location.href,
          'title': document.title,
          'html': html,
          'height': e.target.clientHeight,
          'width': e.target.clientWidth,
          'window_width': window.innerWidth
      };
      console.log(data);

      jQuery.ajax({
          url: 'https://clippy.in/ajax/addSnip',
          type: 'post',
          timeout: 150000,
          data: serialize(data),
          success: function(response, textStatus){
              console.log("received response from clippy central");
              if (response.error) {
                if (response.error == "max_clips_free") {
                  var upgrade = confirm(response.errorMsg);
                  if (upgrade) {
                    var next = {
                      'next': document.location.href
                    };
                    
                    window.location = "https://clippy.in/signupUnlimited?" + serialize(next);
                  }
                  else {
                    var new_html = '<span id="error-message-span">Error!</span>';
                    new_html = new_html + '<ul id="success-choices"><li><a href="https://clippy.in/default">Go to Clippy</a></li><li><button class="close-button" onclick="javascript:closeSuccessMessage();" value="Close">Close</button></li></ul>';
                    jQuery('#snippet-loader').html(new_html);
                  }
                }
              }
              else {
                var new_html = '<span id="success-message-span">Clip saved!</span>';
                new_html = new_html + '<ul id="success-choices"><li><a href="https://clippy.in/default">Go to Clippy</a></li><li><button class="close-button" onclick="javascript:closeSuccessMessage();" value="Close">Close</button></li></ul>';
                jQuery('#snippet-loader').html(new_html);
              }
          },
          error: function(jqXHR, textStatus, errorThrown){
              console.log(textStatus);
              var new_html = '<span id="error-message-span">Error!</span>';
              new_html = new_html + '<ul id="success-choices"><li><a href="https://clippy.in/default">Go to Clippy</a></li><li><button class="close-button" onclick="javascript:closeSuccessMessage();" value="Close">Close</button></li></ul>';
              jQuery('#snippet-loader').html(new_html);
          }
      });
    };

    document.body.addEventListener("mouseover", snip_event_listener.mouseover, true);
    document.body.addEventListener("mouseout",  snip_event_listener.mouseout,  true);
    document.body.addEventListener("click",     snip_event_listener.click,     true);
}

(function(){

    var v = "1.8.3";

    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function(){
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                activatePicker();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        activatePicker();
    }

})();