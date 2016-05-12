/*
    QuestionMark.js by Louis Lazaris
    http://impressivewebs.github.io/QuestionMark.js/
    License: http://creativecommons.org/licenses/by/2.0/, no credit needed.
    This script should work everywhere, including IE8+.
    If you want IE8 support, include the following
    polyfill for addEventListener() at the top:
    https://gist.github.com/jonathantneal/2415137
    (included in the repo as attachevent.js).
    Doesn't work in IE6/7, but feel free to fork and fix.
*/


(function ($, document, window) {

    'use strict';
    var publicMethod = {};
    var questionmark = 'questionmark';
    var settings;

    publicMethod = $.fn[questionmark] = $[questionmark] = function (options, callback) {
        //var settings;
        var $obj = this;

        options = options || {};

        if ($.isFunction($obj)) { // assume a call to $.questionmark
            //$obj = $('<a/>');
            //options.open = true;
            publicMethod.doAjax(options);
        }

        if (!$obj[0]) { // questionmark being applied to empty collection
            return $obj;
        }


        return $obj;
    };


    var  isEmpty = function(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    };

    var removeModal = function (helpUnderlay) {
        helpUnderlay.className = helpUnderlay.className.replace(/help-isVisible*/g, '');
        helpUnderlay.className = helpUnderlay.className.trim();
    };

    var getWindowWidth = function () {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;
            //var y = w.innerHeight || e.clientHeight || g.clientHeight;
        return x;
    }

    var doUnderlayHeight = function () {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    var doModalSize = function (o) {
        // Find out how many columns there are, create array of heights
        o.helpColsTotal = 0;
        for (o.i = 0; o.i < o.helpLists.length; o.i += 1) {
            if (o.helpLists[o.i].className.indexOf('help-list') !== -1) {
                o.helpColsTotal += 1;
            }
            o.helpListsHeights[o.i] = o.helpLists[o.i].offsetHeight;
        }

        // get the tallest column from the array of heights
        o.maxHeight = Math.max.apply(Math, o.helpListsHeights);

        // Quasi-responsive
        if (getWindowWidth() <= 1180 && getWindowWidth() > 630 && o.helpColsTotal > 2) {
            o.helpColsTotal = 2;
            o.maxHeight = o.maxHeight * o.helpColsTotal;
        }

        if (getWindowWidth() <= 630) {
            o.maxHeight = o.maxHeight * o.helpColsTotal;
            o.helpColsTotal = 1;
        }

        // Change the width/height of the modal and wrapper to fit the columns
        // Sorry for the magic numbers. Whatevs.
        o.helpListWrap.style.offsetWidth = (o.helpList.offsetWidth * o.helpColsTotal) + 'px';
        o.helpListWrap.style.height = o.maxHeight + 'px';
        o.helpModal.style.width = (o.helpList.offsetWidth * o.helpColsTotal) + 60 + 'px';
        o.helpModal.style.height = o.maxHeight + 100 + 'px';
    }

    var doWhichKey = function (e) {
        e = e || window.event;
        var charCode = e.keyCode || e.which;
        //Line below not needed, but you can read the key with it
        //var charStr = String.fromCharCode(charCode);
        return charCode;
    }

    // Primary function, called in checkServerResponse()
    var doQuestionMark = function () {
        var helpUnderlay = document.getElementById('helpUnderlay'),
            helpModal = document.getElementById('helpModal'),
            helpClose = document.getElementById('helpClose'),
            timeOut = null,
            objDoSize = {
                i: null,
                maxHeight: null,
                helpListWrap: document.getElementById('helpListWrap'),
                helpList: document.querySelector('.help-list'),
                helpLists: document.querySelectorAll('.help-list'),
                helpModal: helpModal,
                helpColsTotal: null,
                helpListsHeights: []
            },
            classCol;

        doModalSize(objDoSize);
        document.addEventListener('keypress', function (e) {
            // 63 = '?' key
            // '?' key toggles the modal
            if (doWhichKey(e) === 63) {
                if(!$('#helpUnderlay').hasClass('help-isVisible')){
                    $('#helpUnderlay').addClass('help-isVisible');
                }

            }

            helpUnderlay.style.height = doUnderlayHeight() + 'px';

        }, false);

        document.addEventListener('keyup', function (e) {
            // 27 = ESC key
            if (doWhichKey(e) === 27) {
                removeModal(helpUnderlay);
            }
        }, false);

        // Modal is removed if the background is clicked
        helpUnderlay.addEventListener('click', function () {
            removeModal(helpUnderlay);
        }, false);

        // this prevents click on modal from removing the modal
        helpModal.addEventListener('click', function (e) {
            e.stopPropagation();
        }, false);

        // the close button
        helpClose.addEventListener('click', function () {
            removeModal(helpUnderlay);
        }, false);

        // If the window is resized, the doModalSize() function is called again.
        // If your menu includes only a single column of keyboard shortcuts,
        // then you won't need this. Keep only if you have 2 columns or more.
        window.onresize = function () {
            if (timeOut !== null) {
                clearTimeout(timeOut);
            }
            timeOut = setTimeout(function () {
                doModalSize(objDoSize);
            }, 100);
        };

    }

    // All the Ajax stuff is below.
    // Probably no reason to touch this unless you can optimize it.
    var getXhrObject = function () {
        var xhrObject = false;
        // All browsers (except IE6) use the 3 lines below
        if (window.XMLHttpRequest) {
            xhrObject = new XMLHttpRequest();
        }
        // If you need IE6 support, uncomment the following else/if:
        /*else if (window.ActiveXObject) {
            try {
                    xhrObject = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(err) {
                    try {
                        xhrObject = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch(err) {
                        xhrObject = false;
                    }
            }
        }*/
        return xhrObject;
    }

    var insertHelp = function (options, respText, callback) {
        // Opera kept inserting the content multiple times
        // so I added a check to insert it just once... bug??
        if (document.getElementById(options.target_id)) {
            document.getElementById(options.target_id).innerHTML += respText;
        }else{
            document.getElementsByTagName('body')[0].innerHTML += respText;
        }
        callback();
    }

    var checkServerResponse= function (options, ajaxCapable) {
        if (ajaxCapable.readyState === 4) {
            if (ajaxCapable.status === 200 || ajaxCapable.status === 304) {
                var respText = ajaxCapable.responseText;
                // here's where the help modal is inserted
                insertHelp(options, respText, function () {
                    doQuestionMark();
                });
            }
        }
    }

    publicMethod.doAjax = function (options) {
        var $obj = this;
        var ajaxCapable = getXhrObject();
        if (ajaxCapable) {
            ajaxCapable.onreadystatechange = function () {
                checkServerResponse(options, ajaxCapable);
            };
            ajaxCapable.open("GET", options.html_location, true);
            ajaxCapable.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajaxCapable.send(null);
        } else {
            // Browser does not support ajax
            document.getElementsByTagName('body')[0].innerHTML += 'Error: Your browser does not support Ajax';
        }
    }
    publicMethod.settings = settings;

}(jQuery, document, window));
