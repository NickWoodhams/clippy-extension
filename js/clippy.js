
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
        console.log(pic.url, srcx, srcy, srcw, srch, desx, desy, desw, desh);
        // context.drawImage(pic, srcx, srcy, srcw, srch, desx, desy, desw, desh);

        // Convert the canvas to a data URL in PNG format
        callback(canvas.toDataURL());
    }

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
    $("#snippet-loader").remove();
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
    $('body').append('<div id="snippet-loader">Select a clip or press escape.</div>');
}


function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}

function activatePicker() {

    $("#snippet-loader").remove();

    // Show bar across the top
    show_loader_pane();

    $("#clippy-authentication").remove();

    importJS('//clippy.in/ajax/authenticate?domain=' + window.location.href);
    importCSS("//clippy.in/static/css/bookmarklet-styles.css");
    importCSS("//cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min.css");
    importCSS("//fonts.googleapis.com/css?family=Open+Sans:700,400");

    var snip_event_listener = {
        current_target: null
    };

    snip_event_listener.mouseover = function(e) {
        snip_event_listener.current_target = e.target;
        var elem = $(e.target);
        // elem.addClass('clippy-active-element');
        elem.css('outline', "4px dotted #4c88ae");
        // Highlight the div
        // e.target.setAttribute("data-original-background", e.target.style.background);
        // e.target.style.background = "#EEDD6B";
        // Add an absolute positioned div over the top
    };

    snip_event_listener.mouseout = function(e) {
        snip_event_listener.current_target = e.target;
        var elem = $(e.target);
        elem.css('outline', 'none');
        // elem.removeClass('clippy-active-element');
        // e.target.style.background = e.target.getAttribute("data-original-background");
    };

    snip_event_listener.click = function(e) {
        e.preventDefault();

        //remove the event listeners
        document.body.removeEventListener("mouseover", snip_event_listener.mouseover, true);
        document.body.removeEventListener("mouseout", snip_event_listener.mouseout, true);
        document.body.removeEventListener("click", snip_event_listener.click, true);

        var elem = $(e.target);
        elem.css('outline', 'none');
        console.log("Clippy token: " + $('#clippy-authentication').contents());
        $("#snippet-loader").hide();

        html_jq = $(e.target); //gets html including self

        chrome.runtime.sendMessage({
            msg: "capture"
        }, function(response) {
            screenshot_resized = resizeImage(
                response.imgSrc,
                e.target.clientWidth,
                e.target.clientHeight,
                html_jq.offset().left - $(window).scrollLeft(),
                html_jq.offset().top - $(window).scrollTop(),
                function(resizedImgSrc) {
                    console.log("screenshot_resized", resizedImgSrc);
                    $("#snippet-loader").show();

                    data = {
                        'code': $('#clippy-authentication').val(),
                        'url': window.location.href,
                        'title': document.title,
                        'height': e.target.clientHeight,
                        'width': e.target.clientWidth,
                        'top': html_jq.offset().top - $(window).scrollTop(),
                        'left': html_jq.offset().left - $(window).scrollLeft(),
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
                            $(new_html);
                            $('#snippet-loader').html(new_html);
                            $("#destination_board_id").append(
                                $.map(response.boards, function(board) {
                                    return $('<option>', {
                                        val: board.id,
                                        text: board.title
                                    });
                                })
                            ).prepend(
                                $('<option>', {
                                    val: ""
                                })
                            ).select2({
                                // width: 'resolve',
                                placeholder: 'Move Clip',
                                containerCssClass: "destination-select2"
                            });
                            $("#destination_board_id").on("change", function(e) {
                                console.log(e, $(this).val());
                                var payload = {
                                    'code': $('#clippy-authentication').val(),
                                    'snip_id': response.snip_id,
                                    'new_board_id': $(this).val(),
                                    'last_width': window.innerWidth,
                                    'last_height': window.innerHeight
                                };
                                console.log(payload);

                                $.getJSON('//clippy.in/ajax/moveSnip?' + serialize(payload), function(data) {
                                    console.log(data);
                                    if (data.success === true) {
                                        console.log("successfully moved snippet");
                                        $('#success-message-span').html("Successfully moved!");
                                        $('#clippy_logo').attr('href', '//clippy.in/board/' + data.new_board_id);
                                    }
                                });
                            });
                            $('#close_snippet_loader').on('click', function() {
                                $('#snippet-loader').slideUp();
                            });

                            $('#copy_clip_url').attr('data-url', response.public_url_code);
                            $('#copy_clip_url').on('click', function(a) {
                                e.preventDefault();
                                copyTextToClipboard("https://clippy.in/s/" + $(this).attr('data-url'));
                                $('#success-message-span').html("Copied link!");
                                return false;
                                // prompt("Public URL", "https://clippy.in/s/" + $(this).attr('data-url'));
                            });
                            // setTimeout(function() {
                            //     $('#snippet-loader').slideUp();
                            // }, 7500);

                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            var new_html = '<div id="error-message-span">Error!</div>';
                            new_html = new_html + '<ul id="success-choices"><li><a href="https://clippy.in/default">Go to Clippy</a></li><li><a class="close-button" onclick="javascript:closeSuccessMessage();" value="Close">Close</a></li></ul>';
                            $('#snippet-loader').html(new_html);
                        }
                    });

                }
            )

            return false;
        });
    };

    // Add the event listeners
    document.body.addEventListener("mouseover", snip_event_listener.mouseover, true);
    document.body.addEventListener("mouseout", snip_event_listener.mouseout, true);
    document.body.addEventListener("click", snip_event_listener.click, true);

    // Check if the user presses escape
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            console.log('Escape key pressed.');
            var elem = $(e.target);
            elem.css('outline', 'none');
            //remove the event listeners
            document.body.removeEventListener("mouseover", snip_event_listener.mouseover, true);
            document.body.removeEventListener("mouseout", snip_event_listener.mouseout, true);
            document.body.removeEventListener("click", snip_event_listener.click, true);
            // Remove the outline
            $(snip_event_listener.current_target).removeClass('clippy-active-element');
        }
    });


}
