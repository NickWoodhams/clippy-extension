
serialize = function(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
};


function resizeImage(url, width, height, left, top, callback) {
    var sourceImage = new Image();

    sourceImage.onload = function() {
        // Create a canvas with the desired dimensions
        var canvas = document.createElement("canvas");

        canvas.height = height * window.devicePixelRatio;
        canvas.width = width * window.devicePixelRatio;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;

        // Set the vars
        var pic = sourceImage;
        var srcx = left * window.devicePixelRatio;
        var srcy = top * window.devicePixelRatio;
        var srch = height * window.devicePixelRatio;
        var srcw = width * window.devicePixelRatio;
        var desx = 0;
        var desy = 0;
        var desw = width;
        var desh = height;

        // Crop it!
        context = canvas.getContext("2d");
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
        context.drawImage(pic, srcx, srcy, srcw, srch, desx, desy, desw, desh);

        // Convert the canvas to a data URL in PNG format
        callback(canvas.toDataURL());
    };

    sourceImage.src = url;
    console.log(sourceImage.src);
    return sourceImage.src;

}


function importJS(scriptPath, callback) {
    var scriptNode = document.createElement('SCRIPT');
    scriptNode.type = 'text/javascript';
    scriptNode.src = scriptPath;

    var headNode = document.getElementsByTagName('HEAD');
    if (headNode[0] !== null)
        headNode[0].appendChild(scriptNode);

    if (callback !== null) {
        scriptNode.onreadystagechange = callback;
        scriptNode.onload = callback;
    }
}


function closeSuccessMessage() {
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


function dynamicStyles() {
    var s = document.createElement('style');
    s.setAttribute('id', 'itsdynamic');
    head.appendChild(s);
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
    jQuery('body').append('<div id="snippet-loader">Select a clip or press escape.</div>');
}


function copyTextToClipboard(text) {
    var copyFrom = jQuery('<textarea/>');
    copyFrom.text(text);
    jQuery('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}


function saveScreenshot(bounds) {
    chrome.runtime.sendMessage({
        msg: "capture"
    }, function(response) {
        // bounds = {h: 629, maxX: 1188, maxY: 1008, w: 675, x: 513, y: 379}
        screenshot_resized = resizeImage(
            response.imgSrc,
            bounds.w,
            bounds.h,
            bounds.x,
            bounds.y,

            function(resizedImgSrc) {
                console.log("screenshot_resized", resizedImgSrc);
                jQuery("#snippet-loader").show();

                data = {
                    'code': jQuery('#clippy-authentication').val(),
                    'url': window.location.href,
                    'title': document.title,
                    'height': bounds.h,
                    'width': bounds.w,
                    'top': bounds.y,
                    'left': bounds.x,
                    'last_width': window.innerWidth,
                    'last_height': window.innerHeight,
                    'screenshot': resizedImgSrc
                };
                console.log(data);

                $.ajax({
                    url: '//clippy.in/ajax/addSnip',
                    type: 'post',
                    timeout: 150000,
                    data: serialize(data),
                    success: function(response, textStatus) {
                        console.log("received response from clippy central");
                        console.log(response);
                        var new_html = '<a href="#" id="close_snippet_loader">X</a>';
                        new_html = new_html + '<table id="clippy_table"><tr>';
                        new_html = new_html + '<td><div id="clippy_logo"><a href="' + '//clippy.in" id="clippy_logo">Clippy</a></div></td>';
                        new_html = new_html + '<td width="262"><select id="destination_board_id"></select></td>';
                        new_html = new_html + '<td><div id="success-message-span">Clip saved!</div></td>';
                        new_html = new_html + '<td><a href="#" id="copy_clip_url">Copy Link</a></td>';
                        // new_html = new_html + '<td><a id="clippy_link" href="//clippy.in/default"></a></td>';
                        new_html = new_html + "</tr></table>";
                        jQuery(new_html);
                        jQuery('#snippet-loader').html(new_html);
                        jQuery("#destination_board_id").append(
                            $.map(response.boards, function(board) {
                                return jQuery('<option>', {
                                    val: board.id,
                                    text: board.title
                                });
                            })
                        ).prepend(
                            jQuery('<option>', {
                                val: ""
                            })
                        );
                        jQuery("#destination_board_id").select2({
                            // width: 'resolve',
                            placeholder: 'Move Clip',
                            containerCssClass: "destination-select2"
                        });
                        jQuery("#destination_board_id").on("change", function(e) {
                            console.log(e, jQuery(this).val());
                            var payload = {
                                'code': jQuery('#clippy-authentication').val(),
                                'snip_id': response.snip_id,
                                'new_board_id': jQuery(this).val(),
                                'last_width': window.innerWidth,
                                'last_height': window.innerHeight
                            };
                            console.log(payload);

                            $.getJSON('//clippy.in/ajax/moveSnip?' + serialize(payload), function(data) {
                                console.log(data);
                                if (data.success === true) {
                                    console.log("successfully moved snippet");
                                    jQuery('#success-message-span').html("Successfully moved!");
                                    jQuery('#clippy_logo').attr('href', '//clippy.in/board/' + data.new_board_id);
                                }
                            });
                        });
                        jQuery('#close_snippet_loader').on('click', function() {
                            jQuery('#snippet-loader').slideUp();
                        });

                        jQuery('#copy_clip_url').attr('data-url', response.public_url_code);
                        jQuery('#copy_clip_url').on('click', function(e) {
                            e.preventDefault();
                            copyTextToClipboard("https://clippy.in/s/" + jQuery(this).attr('data-url'));
                            jQuery('#success-message-span').html("Copied link!");
                            return false;
                            // prompt("Public URL", "https://clippy.in/s/" + jQuery(this).attr('data-url'));
                        });
                        // setTimeout(function() {
                        //     jQuery('#snippet-loader').slideUp();
                        // }, 7500);

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                        var new_html = '<div id="error-message-span">Error!</div>';
                        new_html = new_html + '<ul id="success-choices"><li><a href="https://clippy.in/default">Go to Clippy</a></li><li><a class="close-button" onclick="javascript:closeSuccessMessage();" value="Close">Close</a></li></ul>';
                        jQuery('#snippet-loader').html(new_html);
                    }
                });

            }
        );

        return false;
    });

}


function createCanvas() {
    can  = document.createElement("canvas"),
    ctx  = can.getContext('2d'),
    ms   = document.createElement('div'),
    path = [];

    // Add the overlay canvas to the body
    document.body.appendChild(can);
    document.body.appendChild(ms);
    // ms.style.position="fixed";
    // ms.style.left="0px";
    // ms.style.top="0px";
    // ms.style.width="100%";
    // ms.style.height="100%";

    can.style.position="fixed";
    can.style.left="0px";
    can.style.top="0px";
    can.style.width="100%";
    can.style.height="100%";
    can.style.zIndex="999999";
    can.style.cursor="crosshair";
    // can.style.background="#EEE";
}


function activatePicker() {
    console.log("activating", Date());

    jQuery("#snippet-loader").remove();

    // Show bar across the top
    show_loader_pane();

    jQuery("#clippy-authentication").remove();

    importJS('//clippy.in/ajax/authenticate?domain=' + window.location.href);
    importCSS("//cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min.css");
    importCSS("//clippy.in/static/css/bookmarklet-styles.css");
    importCSS("//fonts.googleapis.com/css?family=Open+Sans:700,400");

    createCanvas();
    window.onresize=resize;
    can.addEventListener('mousedown',startDrawing,false);
    resize();

    function resize(){
        can.width  = can.offsetWidth;
        can.height = can.offsetHeight;
        redraw();
        console.log("Resizing!");
    }

    function startDrawing(e){
        console.log("Start Drawing!");
        path.length=0;
        addPt(e);
        can.addEventListener('mousemove',redraw,false);
        can.addEventListener('mouseup',function(){
            var bounds = contextBoundingBox(ctx);
            console.log("bounds", bounds);
            ctx.clearRect(0,0,can.width,can.height);
            can.removeEventListener('mousemove',addToDrawing,false);
            can.removeEventListener('mousemove',redraw,false);
            saveScreenshot(bounds);
        },false);
    }
    function addToDrawing(e){
        addPt(e);
        redraw(e);
    }

    function addPt(e){
        console.log("adding point!");
        path.push([e.layerX - $(window).scrollLeft(),e.layerY - $(window).scrollTop()]);
    }

    function redraw(e){
        // console.log("redraw!");
        ctx.clearRect(0,0,can.width,can.height);
        if (!path.length) return;
        ctx.beginPath();
        ctx.moveTo.apply(ctx,path[0]);
        console.log($(window).scrollLeft(), $(window).scrollTop());
        ctx.lineTo.apply(ctx,[e.layerX - $(window).scrollLeft(),e.layerY - $(window).scrollTop()]);
        // for (var i=1,len=path.length;i<len;++i) ctx.lineTo.apply(ctx,path[i]);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Bounding box code
        var start = new Date();
        var bounds = contextBoundingBox(ctx);
        ms.value = ms.value*1 + Math.round(((new Date()) - start - ms.value)/4);
        if (bounds){
            ctx.strokeStyle = '#c00';
            ctx.strokeRect(bounds.x,bounds.y,bounds.w,bounds.h);
        }
    }

    function contextBoundingBox(ctx,alphaThreshold){
        console.log("create bounding box");
        if (alphaThreshold===undefined) alphaThreshold = 15;
        var w=ctx.canvas.width,h=ctx.canvas.height;
        var data = ctx.getImageData(0,0,w,h).data;
        var x,y,minX,minY,maxY,maxX;
        o1: for (y=h;y--;)        for (x=w;x--;)           if (data[(w*y+x)*4+3]>alphaThreshold){ maxY=y; break o1 }
        if (!maxY) return;
        o2: for (x=w;x--;)        for (y=maxY+1;y--;)      if (data[(w*y+x)*4+3]>alphaThreshold){ maxX=x; break o2 }
        o3: for (x=0;x<=maxX;++x) for (y=maxY+1;y--;)      if (data[(w*y+x)*4+3]>alphaThreshold){ minX=x; break o3 }
        o4: for (y=0;y<=maxY;++y) for (x=minX;x<=maxX;++x) if (data[(w*y+x)*4+3]>alphaThreshold){ minY=y; break o4 }
        return {x:minX,y:minY,maxX:maxX,maxY:maxY,w:maxX-minX,h:maxY-minY};
    }

}
