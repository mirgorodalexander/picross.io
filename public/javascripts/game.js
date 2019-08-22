$.fn.equals = function (compareTo) {
    if (!compareTo || this.length != compareTo.length) {
        return false;
    }
    for (var i = 0; i < this.length; ++i) {
        if (this[i] !== compareTo[i]) {
            return false;
        }
    }
    return true;
};
var route;
var isMobile = false;
var user_language = {};
var cellDoubleOverFix;
var cellPreventOver;
var socketPreventDoubleEmit;
var cellX;
var cellY;
var socket = io();
var storage;
var game;
var referer;
var notificationManagerShowed = false;
var mobileVersion = function () {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    } else {
        isMobile = false;
    }
    if (route == 'game') {
        if (isMobile) {
            $('#clock').addClass('clock-mobile');
            $('#puzzle-marker').hide();
            $('#ingame-menu').addClass('ingame-menu-mobile');
            $('.puzzle-menu').prependTo('.activity.visible');
            $('.puzzle-menu').addClass('puzzle-menu-mobile');
            $('.mobile-controller').css({
                "opacity":"1",
                "z-index":"2"
            });
        } else {
            $('#clock').removeClass('clock-mobile');
            $('#puzzle-marker').show();
            $('#ingame-menu').removeClass('ingame-menu-mobile');
            $('.puzzle-menu').prependTo('.ingame-menu');
            $('.puzzle-menu').removeClass('puzzle-menu-mobile');
            $('.mobile-controller').css({
                "opacity":"0",
                "z-index":"-1"
            });
        }
        screenAspectRatio();
        $('#puzzle-marker').click(function () {
            var marker_html;
            if (isMarker) {
                marker_html = '<i class="fas fa-pencil-alt"></i>';
                //socket.emit('user-action', 'Someone turn off "MARKER"');
                isMarker = false;
            } else {
                marker_html = '<i class="fas fa-times"></i>';
                //socket.emit('user-action', 'Someone turn on "MARKER"');
                isMarker = true;
            }
            if (isMarker) {
                $('#puzzle-marker').removeClass('mark-off');
                $('#puzzle-marker').addClass('mark-on');
            } else {
                $('#puzzle-marker').removeClass('mark-on');
                $('#puzzle-marker').addClass('mark-off');
            }
            setTimeout(function () {
                $('#puzzle-marker').html(marker_html);
            }, 100);
        });
        $('#puzzle-exit').click(function () {
            //socket.emit('user-action', 'Someone click on "PAUSE" in game');
            var _this = $(this);
            var notification = {
                type: 'game-return',
                id: 'game-return',
                title: user_language['notification-game-return-title'],
                content: user_language['notification-game-return-content'] +
                '',
                button: [user_language['notification-game-return-button'], user_language['menu-back']],
                audio: ''
            };
            notificationManager.show(notification);
            setTimeout(function () {
                _this.addClass('puzzle-button-clicked');

            }, 300);
        });
        $('#puzzle-help').click(function () {
            //socket.emit('user-action', 'Someone click on "HINT" in game');
            var _this = $(this);
            var notification = {
                type: 'game-hint',
                id: 'game-hint',
                title: user_language['notification-game-hint-title'],
                content: user_language['notification-game-hint-content'],
                button: [user_language['notification-game-hint-button'], user_language['menu-back']],
                audio: ''
            };
            notificationManager.show(notification);
            setTimeout(function () {
                _this.addClass('puzzle-button-clicked');

            }, 300);
        });
        $('.puzzle-button').click(function () {
            var _this = $(this);
            var scale = 1.0;
            if (_this.attr('id') == 'puzzle-marker') {
                scale = 1.0;
            }
            _this.css({
                "transform": "scale(" + (scale - 0.3) + ")",
                "opacity": "0",
                "pointer-events": "none"
            });
            setTimeout(function () {
                _this.css({
                    "transition": "0ms"
                });
                _this.css({
                    "transform": "scale(" + (scale + 0.3) + ")"
                });
                setTimeout(function () {
                    _this.css({
                        "transition": "200ms"
                    });
                    _this.css({
                        "opacity": "1"
                    });
                    setTimeout(function () {
                        _this.css({
                            "transform": "scale(" + (scale) + ")",
                            "opacity": "1",
                            "pointer-events": "all"
                        });
                    }, 100);
                }, 100);
            }, 200);
        });

        $('i').mouseenter(function (e) {
            e.preventDefault();
        });
        $('i').mouseover(function (e) {
            e.preventDefault();
        });

        $('.cell').each(function () {
            $(this).attr('style', '')
        });
        $('.cell').mouseover(function () {
            var _this = $(this);
            if (typeof cellDoubleOverFix == 'undefined') {
                cellDoubleOverFix = _this;
            } else {
                if (cellDoubleOverFix.equals(_this)) {
                    cellPreventOver = true;
                } else {
                    cellPreventOver = false;
                    cellDoubleOverFix = _this;
                }
            }
            $('.cell').each(function () {
                $(this).removeClass('cellhighlight');
            });
            $('.hint').each(function () {
                $(this).removeClass('hinthighlight');
            });
            var horizontal = ($(this).attr('id') + '').split('_')[0];
            var vertical = ($(this).attr('id') + '').split('_')[1];
            $('#h' + horizontal).addClass('hinthighlight');
            $('#v' + vertical).addClass('hinthighlight');
        });
        $('.cell').on('mouseenter', function () {
            var x = (($(this).attr('id') + '').split('_'))[0];
            var y = (($(this).attr('id') + '').split('_'))[1];
            if (isMouseHold) {
                if (isMarker) {
                    if (!cellPreventOver) {
                        if (!($('#' + x + '_' + y).hasClass('false')) && !($('#' + x + '_' + y).hasClass('true'))) {
                            if ($('#' + x + '_' + y).hasClass('marked')) {
                                $('#' + x + '_' + y).html('');
                                $('#' + x + '_' + y).removeClass('marked');
                                socket.emit('marked-remove', {x: x, y: y});
                            } else {
                                $('#' + x + '_' + y).html('');
                                socket.emit('check-cell', {marker: isMarker, x: x, y: y});
                                $('#' + x + '_' + y).addClass('marked');
                                socket.emit('marked-add', {x: x, y: y});
                                $('#' + x + '_' + y).html('<i class="fas fa-times" style="opacity:1"></i>');
                            }
                        }
                    }
                } else {
                    socket.emit('check-cell', {marker: isMarker, x: x, y: y});
                }
                setTimeout(function () {
                    setTimeout(function () {
                        storage.setItem('picrossjs-gamefield', $('.gamefield').html());
                    }, 500);
                }, 500);
            }
        });

        $(document).mousedown(function (e) {
            isMouseHold = true;
            if (e.button == 2) {
                var marker_html;
                isMarker = true;
                marker_html = '<i class="fas fa-times"></i>';
                //socket.emit('user-action', 'Someone turn on "MARKER"');
                $('#puzzle-marker').removeClass('mark-off');
                $('#puzzle-marker').addClass('mark-on');
                var scale = 1.0;
                $('#puzzle-marker').css({
                    "transform": "scale(" + (scale - 0.3) + ")",
                    "opacity": "0",
                    "pointer-events": "none"
                });
                $('#puzzle-marker').css({
                    "transition": "0ms"
                });
                $('#puzzle-marker').css({
                    "transform": "scale(" + (scale + 0.3) + ")"
                });
                setTimeout(function () {
                    $('#puzzle-marker').css({
                        "transition": "200ms"
                    });
                    $('#puzzle-marker').css({
                        "opacity": "1"
                    });
                    setTimeout(function () {
                        $('#puzzle-marker').css({
                            "transform": "scale(" + (scale) + ")",
                            "opacity": "1",
                            "pointer-events": "all"
                        });
                    }, 100);
                }, 100);
                setTimeout(function () {
                    $('#puzzle-marker').html(marker_html);
                }, 100);
            }
        });
        $(document).on('mouseup', function (e) {
            isMouseHold = false;
            if (e.button == 2) {
                setTimeout(function () {
                    var marker_html;
                    isMarker = false;
                    marker_html = '<i class="fas fa-pencil-alt"></i>';
                    //socket.emit('user-action', 'Someone turn off "MARKER"');
                    $('#puzzle-marker').removeClass('mark-on');
                    $('#puzzle-marker').addClass('mark-off');
                    setTimeout(function () {
                        $('#puzzle-marker').html(marker_html);
                    }, 100);
                    var scale = 1.0;
                    $('#puzzle-marker').css({
                        "transform": "scale(" + (scale - 0.3) + ")",
                        "opacity": "0",
                        "pointer-events": "none"
                    });
                    setTimeout(function () {
                        $('#puzzle-marker').css({
                            "transition": "0ms"
                        });
                        $('#puzzle-marker').css({
                            "transform": "scale(" + (scale + 0.3) + ")"
                        });
                        setTimeout(function () {
                            $('#puzzle-marker').css({
                                "transition": "200ms"
                            });
                            $('#puzzle-marker').css({
                                "opacity": "1"
                            });
                            setTimeout(function () {
                                $('#puzzle-marker').css({
                                    "transform": "scale(" + (scale) + ")",
                                    "opacity": "1",
                                    "pointer-events": "all"
                                });
                            }, 100);
                        }, 100);
                    }, 200);
                }, 300);
            }
        });
        $('.cell').on('mousedown', function (e) {
            if (e.button == 2) {
                var marker_html;
                isMarker = true;
                marker_html = '<i class="fas fa-times"></i>';
                //socket.emit('user-action', 'Someone turn on "MARKER"');
                $('#puzzle-marker').removeClass('mark-off');
                $('#puzzle-marker').addClass('mark-on');
                setTimeout(function () {
                    $('#puzzle-marker').html(marker_html);
                }, 100);
            }
            var x = (($(this).attr('id') + '').split('_'))[0];
            var y = (($(this).attr('id') + '').split('_'))[1];
            if (!isMouseHold) {
                //console.log('ISMARKER: ' + isMarker)
                if (isMarker) {
                    if (!($('#' + x + '_' + y).hasClass('false')) && !($('#' + x + '_' + y).hasClass('true'))) {
                        if ($('#' + x + '_' + y).hasClass('marked')) {
                            $('#' + x + '_' + y).html('');
                            $('#' + x + '_' + y).removeClass('marked');
                            socket.emit('marked-remove', {x: x, y: y});
                        } else {
                            $('#' + x + '_' + y).html('');
                            $('#' + x + '_' + y).addClass('marked');
                            $('#' + x + '_' + y).html('<i class="fas fa-times" style="opacity:1"></i>');
                            socket.emit('marked-add', {x: x, y: y});
                        }
                    }
                }
                socket.emit('check-cell', {marker: isMarker, x: x, y: y});
                setTimeout(function () {
                    setTimeout(function () {
                        storage.setItem('picrossjs-gamefield', $('.gamefield').html());
                    }, 500);
                }, 500);
            }
        });
    }
}
socket.on('hash', function (hash) {
    location.hash = hash;
});
var window_height_initial;
setInterval(function () {
    console.log(route);
    if (typeof window_height_initial == 'undefined') {
        window_height_initial = Math.round(parseInt($(window).height()));
    } else {
        if (parseInt(window_height_initial) != parseInt($(window).height())) {
            screenAspectRatio();
            window_height_initial = Math.round(parseInt($(window).height()));
        }
        if (window.innerHeight > window.innerWidth) {
            setTimeout(function () {
                var notification = {
                    type: 'force-landscape',
                    id: 'force-landscape',
                    title: user_language['notification-force-landscape-title'],
                    content: user_language['notification-force-landscape-content'],
                    button: user_language['notification-force-landscape-button'],
                    audio: ''
                };
                notificationManager.show(notification);
            }, 500)
        }
    }
    //console.log($('.activity').offset().top);
}, 100);
var preventDoubleAspectRatio = false;
var screenAspectRatio = function (modifier) {
    if (typeof modifier == 'undefined') {
        modifier = 0;
    }
    if (/Edge/.test(navigator.userAgent)) {
        //alert('Hello Microsoft User!');
    }
    $('.wrapper-scale').each(function (index) {
        var $el = $(this).children('.wrapper');
        console.log($(this).closest('.activity').hasClass('visible'))
        var _this = $(this);
        var elHeight = $el.outerHeight();
        var elWidth = $el.outerWidth();
        var $wrapper = $(this);
        $wrapper.resizable({
            resize: doResize
        });

        function doResize(event, ui) {
            var scale, origin;
            scale = Math.min(
                ui.size.width / elWidth,
                ui.size.height / elHeight
            );
            if (parseInt(modifier) < 5) {
                $el.css({
                    transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
                });
            } else {
                $el.css({
                    transform: "rotate(25deg) translate(-50%, -50%) " + "scale(" + scale + ")",
                    opacity: "0.5",
                    left: "30%",
                    top: "30%"
                });
            }
            $wrapper.css({"height": (parseInt($(window).height()) - 60) + "px"})
            $wrapper.css({"width": (parseInt($(window).width()) - 60) + "px"})
            $('#game').find('.wrapper').css({"min-width": parseInt($('.gamefield').width() + $('.hint.vertical').width() + 30) + "px"});

        }

        var starterData = {
            size: {
                width: $wrapper.width() + modifier * 2,
                height: $wrapper.height() + modifier * 2
            }
        };
        doResize(null, starterData);
    });

    $('.content-scale').each(function (index) {
        var $el = $(this).children('.content');
        var _this = $(this);
        var elHeight = $el.outerHeight();
        var elWidth = $el.outerWidth();
        var $wrapper = $(this);
        $wrapper.resizable({
            resize: doResize
        });

        function doResize(event, ui) {
            var scale, origin;
            scale = Math.min(
                ui.size.width / elWidth,
                ui.size.height / elHeight
            );
            $el.css({
                transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
            });
        }

        var starterData = {
            size: {
                width: $wrapper.width(),
                height: $wrapper.height()
            }
        };
        doResize(null, starterData);
    });

    //});
};
var resizeCounter = 0;
var resizeInterval;

function openNewAjaxTab(url) {
    var tabOpen = window.open(url, 'newtab'),
        xhr = new XMLHttpRequest();
    xhr.open("GET", '' + encodeURIComponent(url), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            tabOpen.location = xhr.responseText;
        }
    };
    xhr.send(null);
}

var isMouseHold = false;
var isMarker = false;

var displayInitInterval;
var displayInitDelay = 0;
// var initDisplay = function () {
//     displayInitDelay = 0;
//     clearInterval(displayInitInterval);
//     displayInitInterval = setInterval(function () {
//         if (displayInitDelay < 2) {
//             displayInitDelay++;
//         } else {
//             displayInitDelay = 0;
//             clearInterval(displayInitInterval);
//         }
//     }, 1);
// };

var loadTimeout;
var loading = function () {
    clearTimeout(loadTimeout);
    $('div.loading').addClass('visible');
    $('div.loading').html('' +
        '<div class="wrapper-scale">' +
        '<div class="wrapper">' +
        '   <div class="loading-object">' +
        '       <div class="loading-block"></div>' +
        '       <div class="loading-block"></div>' +
        '       <br>' +
        '       <div class="loading-block"></div>' +
        '       <div class="loading-block"></div>' +
        '   </div>' +
        '</div>' +
        '</div>' +
        '');
    //initDisplay();
    var deg = 90;
    var block = $('.loading-block').length;
    var color = "#000";
    screenAspectRatio();

    function step() {
        $('.loading-object').css({"opacity": "1"});
        deg = deg + 90;
        $(($('.loading-block'))[block]).css({"opacity": "0.2", "transform": "scale(0.7)"});
        loadTimeout = setTimeout(function () {
            $(($('.loading-block'))[block]).css({"opacity": "1", "transform": "scale(1)"});
            if (block > 0) {
                block--;
            } else {
                if (color == '#000') {
                    color = "#f8d800";
                } else {
                    color = "#000";
                }
                block = $('.loading-block').length - 1;
            }
            step();
        }, 300);
    }

    step();
};
var showActivity = function () {
    $('.wrapper').each(function () {
        $(this).css({
            "transition": "0ms"
        });
    });
    $('.activity').each(function (index) {
        var _this = $(this);
        _this.css({"top": "-" + ($(window).height() + $('.activity visible').height() + 1000) + "px"});
    });
    $('.activity').each(function (index) {
        var _this = $(this);
        _this.removeClass('hide-screen');
        _this.removeClass('visible');
        _this.css({"opacity": "0", "z-index": "-1"});
    });
    try {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
            //alert(isMobile)
        }
    } catch (e) {

    }
    try {
        var imported1 = document.createElement('script');
        var imported2 = document.createElement('script');
        imported1.src = 'https://www.googletagmanager.com/gtag/js?id=UA-119525049-2';
        imported2.src = '/javascripts/ga.js';
        document.head.appendChild(imported1);
        document.head.appendChild(imported2);
    } catch (e) {

    }
    route = ((location.hash).toString()).split('#')[1];
    var loading_delay = 10;
    if (typeof route == 'undefined') {
        route = 'menu';
    } else {
        if (route.toString().search(/level-/g) != -1) {
            loading();
            loading_delay = 800;
            route = route.split('-')[0];
            referer = (location.hash).replace(/#/g, '');
            if (referer == 'game') {
                referer = 'play';
            }
        }
    }
    setTimeout(function () {
        socket.emit('hash', (location.hash).replace(/#/g, ''));
        $('.activity').each(function (index) {
            var _this = $(this);
            _this.removeClass('visible');
            _this.css({"opacity": "0", "z-index": "-1"});
        });
        setTimeout(function () {
            setTimeout(function () {
                $('.loading').removeClass('visible');
                screenAspectRatio();
                clearTimeout(loadTimeout);
                $('.activity').each(function (index) {
                    var _this = $(this);
                    _this.removeClass('hide-screen');
                });
                $('.activity#' + route).addClass('visible');
                setTimeout(function () {
                    if (location.hash == '' || location.hash == '#menu') {
                        $('body').focus();
                        $('body').click();
                        $('html').focus();
                        $('html').click();
                        $(document).focus();
                        $(document).click();
                    }

                }, 100);
            }, 100);
        }, loading_delay);
    }, loading_delay);
};
window.addEventListener('hashchange', function () {
    resizeCounter = 0;
    resizeInterval = setInterval(function () {
        if (resizeCounter < 20) {
            resizeCounter++;
            console.log('resizing');
        } else {
            clearInterval(resizeInterval);
        }
    }, 100);
    var userBrowserLanguage = (navigator.language || navigator.userBrowserLanguageuage).toString().split('-')[0];
    if ((userBrowserLanguage + '') != 'ru' && (userBrowserLanguage + '') != 'en') {
        userBrowserLanguage = 'en';
    }
    socket.emit('game-set-language', userBrowserLanguage);
    notificationManagerShowed = false;
    if ((location.hash).replace(/#/g, '') == 'play') {
        var notification = {
            type: 'game-tutorial',
            id: 'game-tutorial-init',
            title: user_language['notification-game-tutorial-init-title-0'],
            content: user_language['notification-game-tutorial-init-content-0'],
            button: user_language['notification-game-tutorial-init-button-0-a'],
            audio: ''
        };
        socket.emit('user-action', 'Someone choosing puzzles sizes');
        socket.emit('notification-add', notification);
    }
    if ((location.hash).replace(/#/g, '') == 'menu' || (location.hash).replace(/#/g, '') == '') {
        socket.emit('user-action', 'Someone open "MAIN" page');
    }
    if ((location.hash).replace(/#/g, '') == 'about') {
        socket.emit('user-action', 'Someone open "ABOUT" page');
    }
    if ((location.hash).replace(/#/g, '') == 'leaderboard') {
        socket.emit('show-leaderboard');
    }
    if (typeof referer == 'undefined') {
        referer = (location.hash).replace(/#/g, '');
        if (referer == 'game') {
            referer = 'play';
        }
    }
    showActivity();

    setTimeout(function () {
        $('#puzzle-list').html('');
        $('#puzzle-page').html('');
        //screenAspectRatio();

        if ((location.hash).replace(/#/g, '') != 'game') {
            $('.mobile-controller').css({
                "opacity":"0",
                "z-index":"-1"
            });
        }
    }, 200);
});
window.onload = function () {

    resizeInterval = setInterval(function () {
        if (resizeCounter < 20) {
            //
            resizeCounter++;
            console.log('resizing');
        } else {
            clearInterval(resizeInterval);
        }
    }, 100);

    var userBrowserLanguage = (navigator.language || navigator.userBrowserLanguageuage).toString().split('-')[0];
    if ((userBrowserLanguage + '') != 'ru' && (userBrowserLanguage + '') != 'en') {
        userBrowserLanguage = 'en';
    }
    socket.emit('game-set-language', userBrowserLanguage);
    notificationManagerShowed = false;
    if (typeof referer == 'undefined') {
        referer = (location.hash).replace(/#/g, '');
        if (referer == 'game') {
            referer = 'play';
        }
    }
    if ((location.hash).replace(/#/g, '') == 'game') {
        setTimeout(function () {
            socket.emit('puzzle-load');
            screenAspectRatio();
        }, 200)
    } else {
        try {
            storage.removeItem('picrossjs-gamefield');
            storage.removeItem('picrossjs-clock');
        } catch (e) {

        }
    }
    if ((location.hash).replace(/#/g, '') == 'play') {
        var notification = {
            type: 'game-tutorial',
            id: 'game-tutorial-init',
            title: user_language['notification-game-tutorial-init-title-0'],
            content: user_language['notification-game-tutorial-init-content-0'],
            button: user_language['notification-game-tutorial-init-button-0-a'],
            audio: '',
        };
        socket.emit('user-action', 'Someone choosing puzzles sizes');
        socket.emit('notification-add', notification);
    }
    if ((location.hash).replace(/#/g, '') == 'menu' || (location.hash).replace(/#/g, '') == '') {
        socket.emit('user-action', 'Someone open "MAIN" page');
    }
    if ((location.hash).replace(/#/g, '') == 'about') {
        socket.emit('user-action', 'Someone open "ABOUT" page');
    }
    $(document).focus();
    $(document).click();
    showActivity();
};
jQuery(document).ready(function ($) {
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            notificationManagerShowed = false;
            if ((location.hash).replace(/#/g, '') != 'game') {
                setTimeout(function () {
                    $('.activity#game').html('');
                    try {
                        storage.removeItem('picrossjs-gamefield');
                        storage.removeItem('picrossjs-clock');
                    } catch (e) {

                    }
                }, 10);
            }
            if (((location.hash).replace(/#/g, '') + '').search('level-') == -1) {
                //$('.activity#game').html('');
                // setTimeout(function () {
                //     var html_activity = '' +
                //         '<div class="puzzle-page" id="puzzle-page"></div>' +
                //         '<div class="puzzle-list" id="puzzle-list"></div>' +
                //         '<div class="menu-item back" id="play">BACK</div>' +
                //         '';
                //     $('#puzzle-list').html(html_activity);
                // }, 100);
            }
        });
    }
});
$(document).resize(function () {
    notificationManagerShowed = false;
});
$(window).resize(function () {
    notificationManagerShowed = false;
    mobileVersion();
    screenAspectRatio();
});
socket.on('user-action', function (activity) {
    //alert(activity)
    if (parseInt((window.location.href).toString().search('api_url')) == -1) {
        var activity_html = '' +
            '<div class="user-action-line">' +
            '   <p>' + activity + '</p>' +
            '</div>';
        $('.user-action').prepend(activity_html);
        var last_element = $('.user-action').find('.user-action-line').first();
        setTimeout(function () {
            last_element.css({"opacity": "1"});
            setTimeout(function () {
                last_element.css({"opacity": "0"});
                setTimeout(function () {
                    last_element.css({"height": "0px"});
                    setTimeout(function () {
                        last_element.remove();
                    }, 800);
                }, 800);
            }, 8000);
        }, 800);
    }
});
socket.on('puzzle-tutorial', function () {
    var notification = {
        type: 'level-tutorial',
        id: 't0000-tutorial',
        title: user_language['notification-game-tutorial-init-title-1'],
        content: user_language['notification-game-tutorial-init-content-1'],
        button: user_language['notification-game-tutorial-init-button-1'],
        audio: '/sound/menu/accept.wav'
    };
    socket.emit('notification-add', notification);
});
socket.on('hint-highlight', function (data) {
    $('div.hint.horizontal').children().find('div').each(function () {
        $(this).removeClass('hintHighlightGuess');
    });
    $('div.hint.vertical').find('div').each(function () {
        $(this).removeClass('hintHighlightGuess');
    });
    for (var i = 0; i < data.length; i++) {
        //console.log(typeof data[i].horizontal);
        if (typeof data[i].vertical != 'undefined') {
            var element = $('div#h' + data[i].vertical + '.hint.horizontal').children().find('div')[data[i].hint];
            $(element).addClass('hintHighlightGuess');
        } else {
            var element = $('div#v' + data[i].horizontal + '.hint.vertical').find('div')[data[i].hint];
            $(element).addClass('hintHighlightGuess');
        }
    }
    // Autofill with MARKED all free cells after line will be guessed
    $('div.hint.horizontal').each(function (index) {
        var _this = $(this).children();
        var total_horizontal_line = _this.find('div').length;
        var highlited_horizontal_line = 0;
        _this.find('div').each(function () {
            if ($(this).hasClass('hintHighlightGuess')) {
                highlited_horizontal_line++;
            }
        });
        setTimeout(function () {
            if (highlited_horizontal_line == total_horizontal_line) {
                $('.cell').each(function () {
                    var _this = $(this);
                    var x = _this.attr('id').split('_')[0];
                    var y = _this.attr('id').split('_')[1];
                    if (x == index) {
                        if (!_this.hasClass('false') && !_this.hasClass('true') && !_this.hasClass('marked')) {
                            _this.html('');
                            _this.addClass('marked');
                            setTimeout(function () {
                                socket.emit('marked-add', {x: x, y: y});
                                _this.css({"background-color": "rgba(236, 101, 97, 1)"});
                                _this.css({"box-shadow": "inset 0px 0px 0px 15px #fff"});
                                _this.html('<i class="fas fa-times" style="opacity:0"></i>');
                                setTimeout(function () {
                                    _this.css({"box-shadow": "inset 0px 0px 0px 0px #fff"});
                                    _this.css({"background-color": "rgba(255, 255, 255, 1)"});
                                    _this.children('.fa-times').attr('style', 'opacity:1');
                                }, 200);
                            }, 100);
                        }
                    }
                });
            }
        }, 20);
    });
    $('div.hint.vertical').each(function (index) {
        var _this = $(this);
        var total_vertical_line = _this.find('div').length;
        var highlited_vertical_line = 0;
        _this.find('div').each(function () {
            if ($(this).hasClass('hintHighlightGuess')) {
                highlited_vertical_line++;
            }
        });
        setTimeout(function () {
            if (highlited_vertical_line == total_vertical_line) {
                $('.cell').each(function () {
                    var _this = $(this);
                    var x = _this.attr('id').split('_')[0];
                    var y = _this.attr('id').split('_')[1];
                    if (y == index) {
                        if (!_this.hasClass('false') && !_this.hasClass('true') && !_this.hasClass('marked')) {
                            _this.html('');
                            _this.addClass('marked');
                            setTimeout(function () {
                                socket.emit('marked-add', {x: x, y: y});
                                _this.css({"background-color": "rgba(236, 101, 97, 1)"});
                                _this.css({"box-shadow": "inset 0px 0px 0px 15px #fff"});
                                _this.html('<i class="fas fa-times" style="opacity:0"></i>');
                                setTimeout(function () {
                                    _this.css({"box-shadow": "inset 0px 0px 0px 0px #fff"});
                                    _this.css({"background-color": "rgba(255, 255, 255, 1)"});
                                    _this.children('.fa-times').attr('style', 'opacity:1');
                                }, 200);
                            }, 100);
                        }
                    }
                });
            }
        }, 40);
    });
});
socket.on('puzzle-list', function (levels) {
    levels = JSON.parse(levels);
    var loc = (location.hash).toString();
    var _mode = loc.replace(/#level-/gi, '').charAt(0);
    var _path;
    switch (_mode) {
        case 't':
            _path = '0x0';
            break;
        case 'a':
            _path = '5x5';
            break;
        case 'b':
            _path = '10x10';
            break;
        case 'c':
            _path = '15x15';
            break;
        case 'd':
            _path = '20x20';
            break;
        case 'e':
            _path = '25x25';
            break;
        case 'f':
            _path = '30x30';
            break;
    }

    var _page = parseInt(loc.replace(/#level-/gi, '').substr(1));
    if (_page + '' == 'NaN') {
        _page = 0;
    }

    socket.emit('user-action', 'Someone loaded "' + _path + '" puzzles on "' + _page + '" page');

    var range = parseInt(_page * 15);
    var _pages = Math.ceil(levels.length / 15);
    setTimeout(function () {
        if (_pages == 1) {
            $('#puzzle-page').hide();
        }
    }, 1000);
    var html_puzzle_list = '';
    levels = levels.slice(range, range + 15);
    for (var i = 0; i < levels.length; i++) {
        var _id = (levels[i].toString());
        html_puzzle_list = html_puzzle_list + '<div class="puzzle" id="' + _id + '">' +
            '<div class="thumb">' +
            '</div>' +
            '<div class="puzzle-record">__:__:__</div><div class="puzzle-id">' + _id.substr(1) + '</div></div>';
    }
    $('#puzzle-list').html(html_puzzle_list);
    var html_puzzle_page = '';
    if (_pages >= 1) {
        for (var i = 0; i < _pages; i++) {
            html_puzzle_page = html_puzzle_page + '<div class="puzzle-pages" id="' + 'level-' + _mode + i + '">' + i + '</div>';
        }
    }

    $('#puzzle-page').html(html_puzzle_page);
    $('.puzzle-pages').each(function () {
        $(this).removeClass('puzzle-page-current');
    });
    $('.puzzle-pages').each(function (index) {
        $(this).hide();
    });
    $('.puzzle').click(function () {
        var id = $(this).attr('id');
        socket.emit('puzzle-load', id);
        socket.emit('user-action', 'Someone playing in puzzle "' + id + '"');
        location.hash = 'game';
    });
    $('.puzzle-pages').click(function () {
        location.hash = $(this).attr('id');
    });
});
socket.on('puzzle-list-completed', function (levels) {
    setTimeout(function () {
        levels = JSON.parse(levels);
        var loc = (location.hash).toString();
        var _mode = loc.replace(/#level-/gi, '').charAt(0);
        var _page = parseInt(loc.replace(/#level-/gi, '').substr(1));
        if (_page + '' == 'NaN') {
            _page = 0;
        }
        var range = parseInt(_page * 15);
        var _pages = Math.ceil(levels.length / 15);

        $('#level-' + _mode + _page).addClass('puzzle-page-current');
        if (loc.search('level-') != -1) {
            if (_page > _pages) {
                location.hash = 'level-' + _mode + (_pages);
            }
        }
        $('.puzzle-pages').each(function (index) {
            if (index > (Math.floor((levels.length) / 15))) {
                $(this).remove();
            } else {
                $(this).show();
            }
        });
        for (var i = 0; i < levels.length; i++) {
            var _time = levels[i][1];
            var sec = _time % 60;
            var min = (_time - sec) / 60 % 60;
            var hour = (_time - sec - min * 60) / 3600;
            if ((hour + '').length == 1) {
                hour = '0' + hour;
            }
            var str = hour + ':' + ("0" + min).slice(-2) + ':' + ("0" + sec).slice(-2);
            $('#' + levels[i][0]).children('.puzzle-record').html(str);
            $('#' + levels[i][0]).children('.thumb').attr('style', 'box-shadow: inset 1px 0px 0px 3px rgb(255, 255, 255), 0px 0px 0px 15px rgb(255, 255, 255)');
            $('#' + levels[i][0]).children('.thumb').html(levels[i][2]);

        }
        $('.puzzle').each(function (index) {
            var _parent = $(this);
            var _children = _parent.children('.thumb');
            var wrapper_height_scaled = _children.outerHeight();
            var wrapper_width_scaled = _children.outerWidth();
            var window_height = _parent.outerHeight();
            var window_width = _parent.outerWidth();
            var offset_y = (window_height / 2) - (wrapper_height_scaled / 2);
            var offset_x = (window_width / 2) - (wrapper_width_scaled / 2);

            var puzzle_size = Math.sqrt(_children.find('.thumb-block').length);

            var ratio_oversize;
            var ratio_original;

            switch (puzzle_size) {
                case 5:
                    ratio_oversize = 0.69;
                    ratio_original = 1;
                    break;
                case 10:
                    ratio_oversize = 0.75;
                    ratio_original = 1;
                    break;
                case 15:
                    ratio_oversize = 0.75;
                    ratio_original = 1;
                    break;
                case 20:
                    ratio_oversize = 0.75;
                    ratio_original = 1;
                    break;
                case 25:
                    ratio_oversize = 0.78;
                    ratio_original = 1;
                    break;
                case 30:
                    ratio_oversize = 0.78;
                    ratio_original = 1;
                    break;
                case 35:
                    ratio_oversize = 0.78;
                    ratio_original = 1;
                    break;
                case 40:
                    ratio_oversize = 0.78;
                    ratio_original = 1;
                    break;
                case 45:
                    ratio_oversize = 0.81;
                    ratio_original = 1;
                    break;
            }
            if (window_height < wrapper_height_scaled + 100) {
                var ratio = (window_height / wrapper_height_scaled) * ratio_oversize;
                _children.css({"transform": "scaleX(" + ratio + ") scaleY(" + ratio + ")"});
            } else {
                var ratio = ratio_original;
                _children.css({"transform": "scaleX(" + ratio + ") scaleY(" + ratio + ")"});
            }
            if (window_width < wrapper_width_scaled + 100) {
                var ratio = (window_width / wrapper_width_scaled) * ratio_oversize;
                _children.css({"transform": "scaleX(" + ratio + ") scaleY(" + (ratio) + ")"});
            }
            _children.css({
                "top": offset_y + "px",
                "left": offset_x + "px"
            });
        });
        //initDisplay();
    }, 1000)
});
var notificationManager = {
    showed: false,
    show: function (notification) {
        try {
            if (!notificationManagerShowed) {
                $('div').each(function () {
                    $(this).removeClass('hinthighlight')
                });
                $('#overlay').children('.content-scale').children('.content').html('');
                var storageNotification = storage.getItem('picrossjs-notification');
                var notification_title_html = '<h1 class="notification-title">' + notification.title + '</h1>';
                var class_button = (notification.button + '').toLowerCase().split(',')[0];
                if (class_button == 'выход') {
                    class_button = 'exit';
                }
                if (class_button == 'выйти') {
                    class_button = 'logout';
                }
                if (class_button == 'назад') {
                    class_button = 'back';
                }
                if (class_button == 'подсказка') {
                    class_button = 'hint';
                }
                if (class_button == 'продолжить') {
                    class_button = 'authorize';
                }
                var notification_button_html = '<div class="notification-button ok-button ' + class_button + '-button">' + notification.button + '</div>';
                var isManyButtons = 0;
                for (var i = 0; i < (notification.button).length; i++) {
                    if (((notification.button)[i] + '').length > 1) {
                        isManyButtons++;
                    }
                }
                if (isManyButtons > 0) {
                    notification_button_html = '';
                    for (var i = 0; i < (notification.button).length; i++) {
                        class_button = ((notification.button)[i] + '').toLowerCase();
                        if (class_button == 'выход') {
                            class_button = 'exit';
                        }
                        if (class_button == 'выйти') {
                            class_button = 'logout';
                        }
                        if (class_button == 'назад') {
                            class_button = 'back';
                        }
                        if (class_button == 'подсказка') {
                            class_button = 'hint';
                        }
                        if (class_button == 'продолжить') {
                            class_button = 'authorize';
                        }
                        notification_button_html = notification_button_html + '<div class="notification-button ok-button ' + class_button + '-button">' + (notification.button)[i] + '</div>';
                    }
                }
                var notification_content_html = '<div class="notification-content">' + notification.content + '</div>';
                var audio = new Audio(notification.audio);
                $(document).focus();
                $(document).click();
                audio.volume = 0.025;
                audio.play();
                var previd;
                if (notification.type == 'game-notification-simple') {
                    function back() {
                        notificationManagerShowed = false;
                        $('.notification-button').each(function () {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        $('.puzzle-button').each(function () {
                            var _this;
                            if ($(this).hasClass('puzzle-button-clicked')) {
                                _this = $(this);
                                var scale = 1.0;
                                _this.css({
                                    "transform": "scale(" + (scale - 0.3) + ")",
                                    "opacity": "0",
                                    "pointer-events": "none"
                                });
                                setTimeout(function () {
                                    _this.css({
                                        "transition": "0ms"
                                    });
                                    _this.css({
                                        "transform": "scale(" + (scale + 0.3) + ")"
                                    });
                                    setTimeout(function () {
                                        screenAspectRatio();
                                        _this.removeClass('puzzle-button-clicked');
                                        _this.css({
                                            "transition": "200ms"
                                        });
                                        _this.css({
                                            "opacity": "1"
                                        });
                                        setTimeout(function () {
                                            _this.css({
                                                "transform": "scale(" + (scale) + ")",
                                                "opacity": "1",
                                                "pointer-events": "all"
                                            });
                                        }, 100);
                                    }, 100);
                                }, 200);
                            }
                        });
                        $('#overlay').css({"opacity": "0"});
                        setTimeout(function () {
                            notificationManagerShowed = false;
                            $('#overlay').css({"z-index": "-1"});
                            $('#overlay').children('.content-scale').children('.content').html('');
                        }, 900);
                    }

                    function start() {
                        notificationManagerShowed = true;
                        $('#overlay').children('.content-scale').children('.content').removeClass('hide-screen');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_button_html);
                        $('#overlay').css({"transition": "0ms"});
                        $('#overlay').css({"z-index": "2"});
                        $('div.exit-button').click(function () {
                            exit();
                        });
                        $('div.back-button').click(function () {
                            back();
                        });
                        setTimeout(function () {
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "0ms"
                            });
                            $('#overlay').css({
                                "transition": "0ms"
                            });

                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "600ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "800ms"
                            });
                            $('#overlay').css({
                                "transition": "1000ms"
                            });
                            $('#overlay').css({"opacity": "1"});
                            setTimeout(function () {
                                screenAspectRatio();
                                $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                setTimeout(function () {
                                    $('.notification-content').css({"opacity": "1"});
                                    setTimeout(function () {
                                        $('div.ok-button').css({"opacity": "1"});
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 10);
                    }

                    start();
                }
                if (notification.type == 'game-hint') {
                    function hint() {
                        notificationManagerShowed = false;
                        $('.notification-button').each(function () {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        $('.puzzle-button').each(function () {
                            var _this;
                            if ($(this).hasClass('puzzle-button-clicked')) {
                                _this = $(this);
                                var scale = 1.0;
                                _this.css({
                                    "transform": "scale(" + (scale - 0.3) + ")",
                                    "opacity": "0",
                                    "pointer-events": "none"
                                });
                                setTimeout(function () {
                                    _this.css({
                                        "transition": "0ms"
                                    });
                                    _this.css({
                                        "transform": "scale(" + (scale + 0.3) + ")"
                                    });
                                    setTimeout(function () {
                                        screenAspectRatio();
                                        _this.removeClass('puzzle-button-clicked');
                                        _this.css({
                                            "transition": "200ms"
                                        });
                                        _this.css({
                                            "opacity": "1"
                                        });
                                        setTimeout(function () {
                                            _this.css({
                                                "transform": "scale(" + (scale) + ")",
                                                "opacity": "1",
                                                "pointer-events": "all"
                                            });
                                        }, 100);
                                    }, 100);
                                }, 200);
                            }
                        });
                        $('#overlay').css({"opacity": "0"});
                        setTimeout(function () {
                            notificationManagerShowed = false;
                            $('#overlay').css({"z-index": "-1"});
                            $('#overlay').children('.content-scale').children('.content').html('');
                            socket.emit('game-hint');
                        }, 900);
                    }

                    function back() {
                        notificationManagerShowed = false;
                        $('.notification-button').each(function () {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        $('.puzzle-button').each(function () {
                            var _this;
                            if ($(this).hasClass('puzzle-button-clicked')) {
                                _this = $(this);
                                var scale = 1.0;
                                _this.css({
                                    "transform": "scale(" + (scale - 0.3) + ")",
                                    "opacity": "0",
                                    "pointer-events": "none"
                                });
                                setTimeout(function () {
                                    _this.css({
                                        "transition": "0ms"
                                    });
                                    _this.css({
                                        "transform": "scale(" + (scale + 0.3) + ")"
                                    });
                                    setTimeout(function () {
                                        _this.removeClass('puzzle-button-clicked');
                                        _this.css({
                                            "transition": "200ms"
                                        });
                                        _this.css({
                                            "opacity": "1"
                                        });
                                        setTimeout(function () {
                                            _this.css({
                                                "transform": "scale(" + (scale) + ")",
                                                "opacity": "1",
                                                "pointer-events": "all"
                                            });
                                        }, 100);
                                    }, 100);
                                }, 200);
                            }
                        });
                        $('#overlay').css({"opacity": "0"});
                        setTimeout(function () {
                            notificationManagerShowed = false;
                            $('#overlay').css({"z-index": "-1"});
                            $('#overlay').children('.content-scale').children('.content').html('');
                        }, 900);
                    }

                    function start() {
                        notificationManagerShowed = true;
                        $('#overlay').children('.content-scale').children('.content').removeClass('hide-screen');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_button_html);
                        $('#overlay').css({"transition": "0ms"});
                        $('#overlay').css({"z-index": "2"});
                        $('div.hint-button').click(function () {
                            hint();
                        });
                        $('div.back-button').click(function () {
                            back();
                        });
                        setTimeout(function () {
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "0ms"
                            });
                            $('#overlay').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "600ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "800ms"
                            });
                            $('#overlay').css({
                                "transition": "1000ms"
                            });
                            $('#overlay').css({"opacity": "1"});
                            setTimeout(function () {
                                screenAspectRatio();
                                $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                setTimeout(function () {
                                    $('.notification-content').css({"opacity": "1"});
                                    setTimeout(function () {
                                        $('div.ok-button').css({"opacity": "1"});
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 10);
                    }

                    start();
                }
                if (notification.type == 'game-return') {
                    function exit() {
                        notificationManagerShowed = false;
                        $('.notification-button').each(function () {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        $('.activity#game').removeClass('visible');
                        setTimeout(function () {
                            $('#overlay').css({"opacity": "0"});
                            setTimeout(function () {
                                loading();
                                $('#overlay').children('.content-scale').children('.content').html('');
                                setTimeout(function () {
                                    $('#overlay').css({"z-index": "-1"});
                                    setTimeout(function () {
                                        location.hash = referer;
                                        location.reload();
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        }, 300);
                    }

                    function back() {
                        notificationManagerShowed = false;
                        $('.notification-button').each(function () {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        $('.puzzle-button').each(function () {
                            var _this;
                            if ($(this).hasClass('puzzle-button-clicked')) {
                                _this = $(this);
                                var scale = 1.0;
                                _this.css({
                                    "transform": "scale(" + (scale - 0.3) + ")",
                                    "opacity": "0",
                                    "pointer-events": "none"
                                });
                                setTimeout(function () {
                                    _this.css({
                                        "transition": "0ms"
                                    });
                                    _this.css({
                                        "transform": "scale(" + (scale + 0.3) + ")"
                                    });
                                    setTimeout(function () {
                                        _this.removeClass('puzzle-button-clicked');
                                        _this.css({
                                            "transition": "200ms"
                                        });
                                        _this.css({
                                            "opacity": "1"
                                        });
                                        setTimeout(function () {
                                            _this.css({
                                                "transform": "scale(" + (scale) + ")",
                                                "opacity": "1",
                                                "pointer-events": "all"
                                            });
                                        }, 100);
                                    }, 100);
                                }, 200);
                            }
                        });
                        $('#overlay').css({"opacity": "0"});
                        setTimeout(function () {
                            notificationManagerShowed = false;
                            $('#overlay').css({"z-index": "-1"});
                            $('#overlay').children('.content-scale').children('.content').html('');
                        }, 900);
                    }

                    function start() {
                        notificationManagerShowed = true;
                        $('#overlay').children('.content-scale').children('.content').removeClass('hide-screen');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_button_html);
                        $('#overlay').css({"transition": "0ms"});
                        $('#overlay').css({"z-index": "2"});
                        $('div.exit-button').click(function () {
                            exit();
                        });
                        $('div.back-button').click(function () {
                            back();
                        });
                        setTimeout(function () {
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "0ms"
                            });
                            $('#overlay').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "600ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "800ms"
                            });
                            $('#overlay').css({
                                "transition": "1000ms"
                            });
                            $('#overlay').css({"opacity": "1"});
                            setTimeout(function () {
                                screenAspectRatio();
                                $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                setTimeout(function () {
                                    $('.notification-content').css({"opacity": "1"});
                                    setTimeout(function () {
                                        $('div.ok-button').css({"opacity": "1"});
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 10);
                    }

                    start();
                }
                if (notification.type == 'force-landscape') {
                    function ok() {
                        notificationManagerShowed = false;
                        location.reload();
                    }

                    function start() {
                        notificationManagerShowed = true;
                        $('#overlay').children('.content-scale').children('.content').removeClass('hide-screen');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_button_html);
                        $('#overlay').css({"transition": "0ms"});
                        $('#overlay').css({"z-index": "2"});
                        $('div.ok-button').click(function () {
                            ok();
                        });
                        setTimeout(function () {
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "0ms"
                            });
                            $('#overlay').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "600ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "800ms"
                            });
                            $('#overlay').css({
                                "transition": "1000ms"
                            });
                            $('#overlay').css({"opacity": "1"});
                            setTimeout(function () {
                                screenAspectRatio();
                                $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                setTimeout(function () {
                                    $('.notification-content').css({"opacity": "1"});
                                    setTimeout(function () {
                                        $('div.ok-button').css({"opacity": "1"});
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 10);
                    }

                    start();
                }
                if (notification.type == 'level-complete') {
                    function end() {
                        notificationManagerShowed = false;
                        $('.activity#game').removeClass('visible');
                        setTimeout(function () {
                            $('#overlay').css({"opacity": "0", "z-index": "-1"});
                            setTimeout(function () {
                                location.hash = referer;
                                $('.activity').each(function () {
                                    $(this).find('.wrapper').css({
                                        opacity: "1",
                                        left: "",
                                        top: ""
                                    });
                                });
                                location.hash = referer;
                                $('#overlay').children('.content-scale').children('.content').html('');
                                $('#overlayed').remove();
                                screenAspectRatio();
                            }, 1000);
                        }, 1000);
                    }

                    function start() {
                        $('#overlay').css({"z-index": "2"});
                        if (typeof notification.data != 'undefined') {
                            if (!notification.data.overtime) {
                                if (typeof storage.getItem('picrossjs-username') != 'undefined' && storage.getItem('picrossjs-username') + '' != 'null') {
                                    game.level.name = storage.getItem('picrossjs-username');
                                    storage.setItem('picrossjs-username', (notification.data.name + '').toString().toLowerCase());
                                    socket.emit('auth-set-name', {
                                        name: notification.data.name,
                                        id: notification.data.id,
                                        pass: storage.getItem('picrossjs-password')
                                    });
                                } else {
                                    storage.setItem('picrossjs-username', (notification.data.name + '').toString().toLowerCase());
                                    socket.emit('auth-set-name', {
                                        name: notification.data.name,
                                        id: notification.data.id,
                                        pass: storage.getItem('picrossjs-password')
                                    });
                                }
                            }
                            $('#overlay').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "0ms"
                            });
                            storage.removeItem('picrossjs-clock');
                            socket.emit('notification-remove-total', notification);
                            storage.removeItem('picrossjs-notification');
                            storage.removeItem('picrossjs-gamefield');
                            $('.cell').css({"pointer-events": "none !important"});
                            setTimeout(function () {
                                $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                                $('#name-submit').click(function () {
                                    game.level.name = $('#user-name').val();
                                    storage.setItem('picrossjs-username', (notification.data.name + '').toString().toLowerCase());
                                    socket.emit('auth-set-name', {
                                        name: notification.data.name,
                                        id: notification.data.id
                                    });
                                });
                                var duplicate_time = new $('.clock').clone()
                                    .attr('id', 'notification-time');

                                if (notification.data.overtime) {
                                    $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                                } else {
                                    $('#overlay').children('.content-scale').children('.content').append(duplicate_time);
                                }

                                var duplicate_gamefield = new $('.gamefield').clone();
                                duplicate_gamefield.attr('id', 'overlayed');
                                duplicate_gamefield.find('i').each(function () {
                                    $(this).hide();
                                });
                                duplicate_gamefield.find('.cell').each(function () {
                                    $(this).removeClass('marked');
                                    $(this).attr('style', '');
                                    $(this).html('');
                                });
                                duplicate_gamefield.find('.message').each(function () {
                                    $(this).remove();
                                });
                                duplicate_gamefield.find('.narrationline-vertical').each(function () {
                                    $(this).hide();
                                });
                                duplicate_gamefield.find('.narrationline-horizontal').each(function () {
                                    $(this).hide();
                                });
                                duplicate_gamefield.find('i').each(function () {
                                    $(this).hide();
                                });
                                $('#overlay').children('.content-scale').children('.content').append(duplicate_gamefield);
                                $('#overlay').children('.content-scale').children('.content').append(notification_button_html);
                                var modifier = 0;
                                switch (notification.data.mode) {
                                    case 't':
                                        modifier = 300;
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "top": "-10px"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "transform": "scale(0.8)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "transform": "scale(0.66)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "max-height": "550px"
                                        });
                                        break;
                                    case 'a':
                                        modifier = 300;
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "top": "-10px"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "transform": "scale(0.8)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "transform": "scale(0.66)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "max-height": "550px"
                                        });
                                        break;
                                    case 'b':
                                        modifier = 300;
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "top": "-155px"
                                        });
                                        $('div.ok-button').css({
                                            "top": "-320px"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "transform": "scale(0.8)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "transform": "scale(0.35)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "max-height": "500px"
                                        });
                                        break;
                                    case 'c':
                                        modifier = 600;
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "top": "-300px"
                                        });
                                        $('div.ok-button').css({
                                            "top": "-610px"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "transform": "scale(0.8)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "transform": "scale(0.25)"
                                        });
                                        $('#overlay').children('.content-scale').children('.content').css({
                                            "max-height": "500px"
                                        });
                                        break;
                                }
                                screenAspectRatio(modifier);
                                $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                    "transition": "600ms"
                                });
                                $('#overlay').children('.content-scale').children('.content').css({
                                    "transition": "800ms"
                                });
                                $('#overlay').css({
                                    "transition": "1000ms"
                                });

                                $('#overlay').css({"opacity": "1"});

                                setTimeout(function () {
                                    screenAspectRatio(modifier);
                                    socket.emit('reset-session');

                                    storage.removeItem('picrossjs-gamefield');
                                    storage.removeItem('picrossjs-notification');
                                    storage.removeItem('picrossjs-clock');


                                    setTimeout(function () {
                                        storage.removeItem('picrossjs-gamefield');
                                        storage.removeItem('picrossjs-notification');
                                        storage.removeItem('picrossjs-clock');
                                        $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                            "box-shadow": "0px 0px 0px 35px #fff"
                                        });
                                        setTimeout(function () {

                                            $('#notification-time').css({"transform": "scaleX(1.4) scaleY(1.4)"});
                                            setTimeout(function () {
                                                $('#notification-time').css({"opacity": "1"});
                                                $('.notification-content').css({"opacity": "1"});
                                                setTimeout(function () {
                                                    $('#notification-time').css({"transform": "scaleX(0.8) scaleY(0.8)"});
                                                    $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({"opacity": "1"});
                                                    var pixels = $('#overlay').children('.content-scale').children('.content').children('#overlayed').find('.true');
                                                    var timeouts;
                                                    var currentPixel = 0;

                                                    function nextPixel() {
                                                        //console.log('pixel');
                                                        var _this = $(pixels[currentPixel]);
                                                        //console.log(_this)
                                                        //console.log(currentPixel)
                                                        _this.attr('style', '');
                                                        _this.css({"background": "#F8D800"});
                                                        timeouts = setTimeout(function () {
                                                            if (currentPixel < pixels.length) {
                                                                currentPixel++;
                                                                timeouts = setTimeout(function () {
                                                                    _this.attr('style', '');
                                                                    _this.css({"background": "#000000"});
                                                                    nextPixel();
                                                                }, 20);
                                                            } else {
                                                                setTimeout(function () {
                                                                    $('div.ok-button').css({
                                                                        "opacity": "1"
                                                                    });
                                                                }, 1000);
                                                                $('.ok-button').click(function () {
                                                                    $('.wrapper').css({"opacity": "0"});
                                                                    $(this).css({
                                                                        "opacity": "0"
                                                                    });
                                                                    clearTimeout(timeouts);
                                                                    end();
                                                                });
                                                            }
                                                        }, 20);
                                                    }

                                                    nextPixel();
                                                }, 1000);
                                            }, 1000);
                                        }, 400);
                                    }, 100);
                                }, 1000);
                            }, 300);
                        }
                    }

                    start();
                }
                if (notification.type == 'game-tutorial') {
                    function tutorial() {
                        socket.emit('user-action', 'Someone starting "TUTORIAL"');
                        socket.emit('notification-remove', notification);
                        setTimeout(function () {
                            $('#overlay').css({"opacity": "0", "z-index": "-1"});
                            setTimeout(function () {
                                $('#overlay').children('.content-scale').children('.content').html('');
                                $('#overlayed').remove();
                                notificationManagerShowed = false;
                                socket.emit('puzzle-load', 't0000');
                                location.hash = 'game';
                                setTimeout(function () {
                                    $('.activity.visible').removeClass('hide-screen');
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }

                    function end() {
                        screenAspectRatio();
                        socket.emit('user-action', 'Someone skipping "TUTORIAL"');
                        socket.emit('notification-remove', notification);
                        setTimeout(function () {
                            $('#overlay').css({"opacity": "0", "z-index": "-1"});
                            setTimeout(function () {
                                location.hash = referer;
                                $('#overlay').children('.content-scale').children('.content').html('');
                                $('#overlayed').remove();
                                setTimeout(function () {
                                    $('.activity.visible').removeClass('hide-screen');
                                    notificationManagerShowed = false;
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }

                    function start() {
                        var notification_tutorial_button_html = '<div class="notification-button tutorial-button">' + user_language['notification-game-tutorial-init-button-0-b'] + '</div>';

                        var _add = setInterval(function () {
                            $('.activity.visible').addClass('hide-screen');
                        }, 10);
                        var _rem = setInterval(function () {
                            if ($('.activity.visible').hasClass('hide-screen')) {
                                clearInterval(_add);
                                clearInterval(_rem);
                            }
                        }, 10);

                        storage.setItem('picrossjs-notification', 'null');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_tutorial_button_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_button_html);
                        $('#overlay').css({"z-index": "2"});
                        $('#overlay').css({"opacity": "1"});

                        setTimeout(function () {
                            $('#overlay').css({"transition": "1000ms"});
                            $('#overlay').css({"transition": "0ms"});
                            setTimeout(function () {
                                setTimeout(function () {
                                    $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                    setTimeout(function () {
                                        $('.notification-content').css({"opacity": "1"});
                                        setTimeout(function () {
                                            $('div.ok-button').css({"opacity": "1"});
                                            $('div.tutorial-button').css({"opacity": "1"});
                                            $('.ok-button').click(function () {
                                                end();
                                                $(this).css({
                                                    "opacity": "0",
                                                    "margin-top": "0px"
                                                });
                                            });
                                            $('.tutorial-button').click(function () {
                                                tutorial();
                                                $(this).css({
                                                    "opacity": "0",
                                                    "margin-top": "0px"
                                                });
                                            });
                                            $('.content').css({"transition": "600ms"});
                                            setTimeout(function () {
                                                screenAspectRatio();
                                                setTimeout(function () {
                                                    $('.content').css({"transition": "0ms"});
                                                }, 1000);
                                            }, 1000);
                                        }, 1000);
                                    }, 1000);
                                }, 500);
                            }, 1000);
                        }, 1000);
                    }

                    start();
                }
                if (notification.type == 'game-authorize') {
                    function authorize() {
                        socket.emit('user-action', 'Someone getting authorize');
                        socket.emit('game-auth-user', {
                            name: notification.data.name,
                            newname: $('#auhorize-username').val().toString().toLowerCase(),
                            password: $('#auhorize-password').val().toString().toLowerCase(),
                            id: notification.data.id
                        });
                    }

                    function back() {
                        notificationManagerShowed = false;
                        $('.notification-button').each(function () {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        $('.puzzle-button').each(function () {
                            var _this;
                            if ($(this).hasClass('puzzle-button-clicked')) {
                                _this = $(this);
                                var scale = 1.0;
                                _this.css({
                                    "transform": "scale(" + (scale - 0.3) + ")",
                                    "opacity": "0",
                                    "pointer-events": "none"
                                });
                                setTimeout(function () {
                                    _this.css({
                                        "transition": "0ms"
                                    });
                                    _this.css({
                                        "transform": "scale(" + (scale + 0.3) + ")"
                                    });
                                    setTimeout(function () {
                                        _this.removeClass('puzzle-button-clicked');
                                        _this.css({
                                            "transition": "200ms"
                                        });
                                        _this.css({
                                            "opacity": "1"
                                        });
                                        setTimeout(function () {
                                            _this.css({
                                                "transform": "scale(" + (scale) + ")",
                                                "opacity": "1",
                                                "pointer-events": "all"
                                            });
                                        }, 100);
                                    }, 100);
                                }, 200);
                            }
                        });
                        $('#overlay').css({"opacity": "0"});
                        setTimeout(function () {
                            notificationManagerShowed = false;
                            $('#overlay').css({"z-index": "-1"});
                            $('#overlay').children('.content-scale').children('.content').html('');
                        }, 900);
                    }

                    function logout() {
                        $('.notification-content').find('p').css({"opacity": "0"});
                        $('.notification-title').each(function (index) {
                            $(this).css({
                                "opacity": "0",
                                "margin-top": "0px"
                            });
                        });
                        $('.notification-button').each(function (index) {
                            $(this).css({
                                "opacity": "0"
                            });
                        });
                        setTimeout(function () {
                            screenAspectRatio();
                            $('.notification-title').each(function (index) {
                                $(this).remove()
                            });
                            $('.notification-button').each(function (index) {
                                $(this).remove()
                            });
                            $('.notification-content').find('p').text(user_language['notification-game-authorize-error-f']);
                            $('.notification-content').find('p').css({"opacity": "1"});
                            notificationManagerShowed = false;
                            socket.emit('game-auth-user-logout');
                            storage.removeItem('picrossjs-username');
                            storage.removeItem('picrossjs-password');
                            $('.notification-button').each(function (index) {
                                $(this).remove();
                            });
                            setTimeout(function () {
                                $('#overlay').css({"opacity": "0"});
                                setTimeout(function () {
                                    notificationManagerShowed = false;
                                    $('#overlay').css({"z-index": "-1"});
                                    $('#overlay').children('.content-scale').children('.content').html('');
                                }, 900);
                            }, 3000);
                        }, 600);
                    }

                    function start() {
                        notificationManagerShowed = true;
                        $('#overlay').children('.content-scale').children('.content').removeClass('hide-screen');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_button_html);
                        $('#overlay').css({"transition": "0ms"});
                        $('#overlay').css({"z-index": "2"});
                        $('div.authorize-button').click(function () {
                            authorize();
                        });
                        $('div.logout-button').click(function () {
                            logout();
                        });
                        $('div.back-button').click(function () {
                            var _this = this;

                            $(_this).css({
                                "opacity": "0"
                            });
                            back();
                        });
                        setTimeout(function () {
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "0ms"
                            });
                            $('#overlay').css({
                                "transition": "0ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                "transition": "600ms"
                            });
                            $('#overlay').children('.content-scale').children('.content').css({
                                "transition": "800ms"
                            });
                            $('#overlay').css({
                                "transition": "1000ms"
                            });
                            $('#overlay').css({"opacity": "1"});
                            setTimeout(function () {
                                $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                setTimeout(function () {
                                    $('.notification-content').css({"opacity": "1"});
                                    setTimeout(function () {
                                        screenAspectRatio();
                                        $('div.ok-button').css({"opacity": "1"});
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 10);
                    }

                    start();
                }
                if (notification.type == 'level-tutorial') {
                    function show() {
                        $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                            "transition": "0ms"
                        });
                        $('#overlay').children('.content-scale').children('.content').css({
                            "transition": "0ms"
                        });
                        $('#overlay').css({
                            "transition": "0ms"
                        });
                        $('#overlay').children('.content-scale').children('.content').removeClass('hide-screen');
                        $('#overlay').children('.content-scale').children('.content').html(notification_title_html);
                        $('#overlay').children('.content-scale').children('.content').append(notification_content_html);
                        $('#overlay').children('.content-scale').children('.content').append('<br>' + notification_button_html);

                        screenAspectRatio();
                        $('#overlay').css({"z-index": "2"});
                        setTimeout(function () {
                            screenAspectRatio();
                            setTimeout(function () {
                                $('#overlay').children('.content-scale').children('.content').children('#overlayed').css({
                                    "transition": "600ms"
                                });
                                $('#overlay').children('.content-scale').children('.content').css({
                                    "transition": "800ms"
                                });
                                $('#overlay').css({
                                    "transition": "1000ms"
                                });
                                $('#overlay').css({"opacity": "1"});
                                $('#overlay').children('.content-scale').children('.content').children('h1').css({"height": "60px"});
                                screenAspectRatio();
                                setTimeout(function () {
                                    $('.notification-content').css({"opacity": "1"});
                                    setTimeout(function () {
                                        screenAspectRatio();
                                        $('div.ok-button').css({"opacity": "1"});
                                    }, 1000);
                                }, 1000);
                            }, 500);
                        }, 500);
                    }

                    function end() {
                        notificationManagerShowed = false;
                        $('#overlay').css({"opacity": "0"});
                        socket.emit('notification-remove', notification);
                        setTimeout(function () {
                            var _notification;

                            function notificationRoute(callback) {
                                if (notification.id == 't0000-tutorial') {
                                    _notification = {
                                        type: 'level-tutorial',
                                        id: 'level-tutorial-vertical',
                                        title: user_language['notification-game-tutorial-vertical-title'],
                                        content: user_language['notification-game-tutorial-vertical-content'],
                                        button: user_language['notification-game-tutorial-vertical-button'],
                                        audio: '/sound/menu/accept.wav'
                                    };
                                    socket.emit('user-action', 'Someone read "TUTORIAL" about "VERTICAL" hints');
                                    callback(true);
                                }

                                function highlightMarker(is) {
                                    $($('.puzzle-button')[2]).click();
                                }

                                if (notification.id == 'level-tutorial-vertical') {
                                    _notification = {
                                        type: 'level-tutorial',
                                        id: 'level-tutorial-horizontal',
                                        title: user_language['notification-game-tutorial-horizontal-title'],
                                        content: user_language['notification-game-tutorial-horizontal-content'],
                                        button: user_language['notification-game-tutorial-horizontal-button'],
                                        audio: '/sound/menu/accept.wav'
                                    };
                                    setTimeout(function () {
                                        $('#h1').css({"background-color": "rgba(248,216,0, 1) !important;"});
                                        var highlightCount = 0;

                                        function highlightNext() {
                                            setTimeout(function () {
                                                $('#1_' + highlightCount).addClass('tutorial-highlight-hint');
                                                if (highlightCount < 5) {
                                                    highlightCount++;
                                                    setTimeout(function () {
                                                        highlightNext();
                                                    }, 200);
                                                } else {
                                                    setTimeout(function () {
                                                        $('.cell').each(function () {
                                                            $(this).removeClass('tutorial-highlight-hint');
                                                        });
                                                        setTimeout(function () {
                                                            socket.emit('check-cell', {marker: false, x: 1, y: 0});
                                                            setTimeout(function () {
                                                                socket.emit('check-cell', {
                                                                    marker: false,
                                                                    x: 1,
                                                                    y: 1
                                                                });
                                                                setTimeout(function () {
                                                                    socket.emit('check-cell', {
                                                                        marker: false,
                                                                        x: 1,
                                                                        y: 2
                                                                    });
                                                                    setTimeout(function () {
                                                                        socket.emit('check-cell', {
                                                                            marker: false,
                                                                            x: 1,
                                                                            y: 3
                                                                        });
                                                                        setTimeout(function () {
                                                                            socket.emit('check-cell', {
                                                                                marker: false,
                                                                                x: 1,
                                                                                y: 4
                                                                            });
                                                                            setTimeout(function () {
                                                                                $('#h1').attr('style', '');
                                                                                socket.emit('user-action', 'Someone read "TUTORIAL" about "HORIZONTAL" hints');
                                                                                callback(true);
                                                                            }, 500);
                                                                        }, 500);
                                                                    }, 500);
                                                                }, 500);
                                                            }, 500);
                                                        }, 500);
                                                    }, 500);
                                                }
                                            }, 200);
                                        }

                                        highlightNext();
                                    }, 500);
                                }
                                if (notification.id == 'level-tutorial-horizontal') {
                                    _notification = {
                                        type: 'level-tutorial',
                                        id: 'level-tutorial-marker',
                                        title: user_language['notification-game-tutorial-marker-title'],
                                        content: user_language['notification-game-tutorial-marker-content'],
                                        button: user_language['notification-game-tutorial-marker-button'],
                                        audio: '/sound/menu/accept.wav'
                                    };
                                    var highlightCount = 0;
                                    setTimeout(function () {
                                        $('#v1').css({"background-color": "rgba(248,216,0, 1) !important;"});

                                        function highlightNext() {
                                            setTimeout(function () {
                                                $('#' + highlightCount + '_1').addClass('tutorial-highlight-hint');
                                                if (highlightCount < 5) {
                                                    highlightCount++;
                                                    setTimeout(function () {
                                                        highlightNext();
                                                    }, 200);
                                                } else {
                                                    setTimeout(function () {
                                                        $('.cell').each(function () {
                                                            $(this).removeClass('tutorial-highlight-hint');
                                                        });
                                                        setTimeout(function () {
                                                            socket.emit('check-cell', {marker: false, x: 0, y: 1});
                                                            setTimeout(function () {
                                                                socket.emit('check-cell', {
                                                                    marker: false,
                                                                    x: 2,
                                                                    y: 1
                                                                });
                                                                setTimeout(function () {
                                                                    highlightMarker();
                                                                    setTimeout(function () {
                                                                        socket.emit('check-cell', {
                                                                            marker: true,
                                                                            x: 3,
                                                                            y: 1
                                                                        });
                                                                        $('#3_1.cell').addClass('marked');
                                                                        socket.emit('marked-add', {x: 3, y: 1});
                                                                        $('#3_1.cell').html('<i class="fas fa-times" style="opacity:1"></i>');
                                                                        setTimeout(function () {
                                                                            highlightMarker();
                                                                            setTimeout(function () {
                                                                                socket.emit('check-cell', {
                                                                                    marker: false,
                                                                                    x: 4,
                                                                                    y: 1
                                                                                });
                                                                                setTimeout(function () {
                                                                                    socket.emit('check-cell', {
                                                                                        marker: false,
                                                                                        x: 0,
                                                                                        y: 4
                                                                                    });
                                                                                    setTimeout(function () {
                                                                                        highlightMarker();
                                                                                        setTimeout(function () {
                                                                                            socket.emit('check-cell', {
                                                                                                marker: true,
                                                                                                x: 3,
                                                                                                y: 1
                                                                                            });
                                                                                            $('#3_1.cell').addClass('marked');
                                                                                            socket.emit('marked-add', {
                                                                                                x: 3,
                                                                                                y: 1
                                                                                            });
                                                                                            $('#3_1.cell').html('<i class="fas fa-times" style="opacity:1"></i>');
                                                                                            setTimeout(function () {
                                                                                                socket.emit('check-cell', {
                                                                                                    marker: true,
                                                                                                    x: 2,
                                                                                                    y: 4
                                                                                                });
                                                                                                $('#2_4.cell').addClass('marked');
                                                                                                socket.emit('marked-add', {
                                                                                                    x: 2,
                                                                                                    y: 4
                                                                                                });
                                                                                                $('#2_4.cell').html('<i class="fas fa-times" style="opacity:1"></i>');
                                                                                                highlightMarker();
                                                                                                setTimeout(function () {
                                                                                                    $('#v1').attr('style', '');
                                                                                                    socket.emit('user-action', 'Someone read "TUTORIAL" about "MARKER" tool');
                                                                                                    callback(true);
                                                                                                }, 700);
                                                                                            }, 500);
                                                                                        }, 700);
                                                                                    }, 500);
                                                                                }, 500);
                                                                            }, 700);
                                                                        }, 500);
                                                                    }, 700);
                                                                }, 500);
                                                            }, 500);
                                                        }, 500);
                                                    }, 500);
                                                }
                                            }, 200);
                                        }

                                        highlightNext();
                                    }, 500);
                                }
                                if (notification.id == 'level-tutorial-marker') {
                                    _notification = {
                                        type: 'level-tutorial',
                                        id: 'level-tutorial-complete',
                                        title: user_language['notification-game-tutorial-complete-title'],
                                        content: user_language['notification-game-tutorial-complete-content'],
                                        button: user_language['notification-game-tutorial-complete-button'],
                                        audio: '/sound/menu/accept.wav'
                                    };
                                    socket.emit('user-action', 'Someone starting "PRACTICE" in "TUTORIAL"');
                                    callback(true);
                                }
                                if (notification.id == 'level-tutorial-complete') {
                                    socket.emit('user-action', 'Someone complete "TUTORIAL" and ready to play');
                                    $('#overlay').css({"opacity": "0"});
                                    $('#overlay').css({"z-index": "-2"});
                                    $('#overlay').children('.content-scale').children('.content').html('');
                                }
                            }

                            notificationRoute(function () {
                                $('#overlay').css({"z-index": "-1"});
                                setTimeout(function () {
                                    if (typeof _notification != 'undefined') {
                                        socket.emit('notification-add', _notification);
                                    }
                                }, 300);
                            });
                        }, 300);
                    }

                    function start() {
                        notificationManagerShowed = true;

                        screenAspectRatio();
                        storage.removeItem('picrossjs-notification');
                        show();
                        $('.ok-button').click(function () {
                            socket.emit('notification-remove', notification);
                            notificationManagerShowed = false;
                            storage.setItem('picrossjs-notification', 'null');
                            $(this).css({
                                "opacity": "0",
                                "margin-top": "0px"
                            });
                            setTimeout(function () {
                                end();
                            }, 800);
                        });
                    }

                    start();
                }
            }
        } catch (e) {
        }
    }
};
socket.on('auth-get-result', function (message) {
    if (parseInt($('#auhorize-error').text().toString().length) == 0) {
        $('#auhorize-error').html('<br>' + message);
        screenAspectRatio();
        $('#auhorize-error').css({"opacity": "1"});
    } else {
        $('#auhorize-error').css({"opacity": "0"});
        setTimeout(function () {
            $('#auhorize-error').html('<br>' + message);
            screenAspectRatio();
            $('#auhorize-error').css({"opacity": "1"});
        }, 600);
    }
});
socket.on('auth-done', function (message) {
    $('div.authorize-button').css({
        "opacity": "0",
        "margin-top": "0px"
    });
    $('.notification-button').each(function (index) {
        $(this).css({
            "opacity": "0"
        });
    });
    $('.notification-content').find('input').each(function (index) {
        $(this).css({
            "opacity": "0"
        });
    });
    $('.notification-content').find('p').each(function (index) {
        if ($(this).attr('id') != 'auhorize-error') {
            $(this).css({
                "opacity": "0"
            });
        }
    });
    $('.notification-title').each(function (index) {
        $(this).css({
            "opacity": "0"
        });
    });
    setTimeout(function () {
        $('.notification-button').each(function (index) {
            $(this).remove();
        });
        $('.notification-content').find('input').each(function (index) {
            $(this).remove();
        });
        $('.notification-content').find('p').each(function (index) {
            if ($(this).attr('id') != 'auhorize-error') {
                $(this).remove();
            }
        });
        screenAspectRatio();
        if (parseInt($('#auhorize-error').text().toString().length) == 0) {
            $('#auhorize-error').html(message);
            $('#auhorize-error').css({
                "opacity": "1"
            });
        } else {
            $('#auhorize-error').css({"opacity": "0"});
            setTimeout(function () {
                $('#auhorize-error').html(message);
                $('#auhorize-error').css({
                    "opacity": "1"
                });
            }, 600);
        }
        setTimeout(function () {
            $('#overlay').css({"opacity": "0"});
            setTimeout(function () {
                notificationManagerShowed = false;
                $('#overlay').css({"z-index": "-1"});
                $('#overlay').children('.content-scale').children('.content').html('');
            }, 900);
        }, 3000);
    }, 600);
});
socket.on('auth-update-user', function (username, password) {
    storage.setItem('picrossjs-username', username.toString().toLowerCase());
    storage.setItem('picrossjs-password', password.toString().toLowerCase());
});
socket.on('game-hint', function (hint) {
    if (!hint) {
        $('#puzzle-help').addClass('puzzle-button-hint-used');
    } else {
        socket.emit('user-action', 'Someone used "HINT"');
        var correct = hint.correct;
        var incorrect = hint.incorrect;
        for (var i = 0; i < correct.length; i++) {
            var x = ((correct[i] + '').split('_'))[0];
            var y = ((correct[i] + '').split('_'))[1];
            socket.emit('check-cell', {marker: false, x: x, y: y});
        }
        for (var i = 0; i < incorrect.length; i++) {
            var x = ((incorrect[i] + '').split('_'))[0];
            var y = ((incorrect[i] + '').split('_'))[1];
            $('#' + x + '_' + y).addClass('marked');
            socket.emit('marked-add', {x: x, y: y});
            $('#' + x + '_' + y).html('<i class="fas fa-times" style="opacity:1"></i>');
        }
        $('#puzzle-help').addClass('puzzle-button-hint-used');
    }
});
socket.on('notification-add', function (notification) {
    if (notification + '' == 'null') {
        storage.setItem('picrossjs-notification', JSON.stringify(notification));
    }
    setTimeout(function () {
        notificationManager.show(notification);

    }, 100);
});
$(document).ready(function () {
    socket.on('game-load-language', function (language) {
        user_language = JSON.parse(language);
        document.oncontextmenu = function () {
            return false;
        };
        setTimeout(function () {
            $('body').css({"opacity": "1"});
        }, 100);
        game = {
            settings: {
                volume: 0.025,
                beta: false
            },
            level: {
                "id": "",
                "size": "",
                "name": "",
                "clicked": []
            },
            init: {
                menu: function () {
                    $('.activity').each(function (index) {
                        var _this = $(this).children('.wrapper-scale').children('.wrapper');
                        var route = $(this).attr('id');
                        var html_activity;
                        if (route == 'menu') {
                            html_activity = '' +
                                '<h1 id="game-logo">Picross.<b>iO</b></h1>' +
                                '<h4 id="game-version">' + user_language['menu-version'] + '</h4>' +
                                // '<div class="menu-item" id="quick">QUICK</div>' +
                                '<div class="menu-item" id="play">' + user_language['menu-play'] + '</div>' +
                                '<div class="menu-item" id="options">' + user_language['menu-options'] + '</div>' +
                                '<div class="menu-item" id="leaderboard">' + user_language['menu-leaderboard'] + '</div>' +
                                //'<div class="menu-item soon" id="editor">EDITOR</div>' +
                                '<div class="menu-item" id="about">' + user_language['menu-about'] + '</div>' +
                                '<br>';// +
                            //'<div class="menu-item ad" id="youtube">' + user_language['menu-ad-footer'] + '</div>';
                            _this.html(html_activity);
                            $('#game-version').hover(function () {
                                $(this).text(user_language['menu-changelog']);
                                $(this).css({"letter-spacing": "1px"})
                            });
                            $('#youtube').hover(function () {
                                $(this).text(user_language['menu-ad-footer-hover']);
                                $(this).css({"letter-spacing": "1px"})
                            });
                            $('#youtube').mouseleave(function () {
                                $(this).text(user_language['menu-ad-footer']);
                                $(this).css({"letter-spacing": "1px"})
                            });
                            $('#game-version').mouseleave(function () {
                                $(this).text(user_language['menu-version']);
                                $(this).css({"letter-spacing": "2px"})
                            });
                            $('#game-version').click(function () {
                                location.hash = 'changelog';
                            });
                        }
                        if (route == 'changelog') {
                            html_activity = '' +
                                user_language['changelog-title'] +
                                '<div class="changelog">' + user_language['changelog-content'] + '</div>' +
                                '<div class="menu-item back" id="menu">' + user_language['menu-back'] + '</div>';
                            //_this.html('<div class="wrapper">' + html_activity + '</div>');
                            _this.html(html_activity);
                        }
                        if (route == 'play') {
                            html_activity = '' +
                                user_language['play-title'] +
                                user_language['play-content'] +
                                '<div class="menu-item" id="level-a">5x5</div>' +
                                '<div class="menu-item" id="level-b">10x10</div>' +
                                '<div class="menu-item" id="level-c">15x15</div>' +
                                // '<div class="menu-item" id="level-d">20x20</div>' +
                                // '<div class="menu-item" id="level-e">25x25</div>' +
                                // '<div class="menu-item" id="level-f">30x30</div>' +
                                '<div class="menu-item back" id="menu">' + user_language['menu-back'] + '</div>' +
                                '';

                            _this.html(html_activity);
                        }
                        if (route == 'options') {
                            html_activity = '' +
                                user_language['options-title'] +
                                user_language['options-content'] +
                                '<div class="menu-item" id="game-reset-tutorial">' + user_language['options-reset-tutorial'] + '</div>' +
                                '<div class="menu-item" id="game-reset-user">' + user_language['options-reset-user'] + '</div>' +
                                '<div class="menu-item" id="game-authorize">' + user_language['options-authorize'] + '</div>' +
                                '<div class="menu-item back" id="menu">' + user_language['menu-back'] + '</div>' +
                                '';

                            _this.html(html_activity);
                        }
                        if (route == 'about') {
                            html_activity = '' +
                                user_language['about-title'] +
                                user_language['about-content'] +
                                '<div class="menu-item back" id="menu">' + user_language['menu-back'] + '</div>' +
                                '';

                            _this.html(html_activity);
                        }
                        if (route == 'puzzles-locked') {
                            html_activity = '' +
                                user_language['puzzles-locked-title'] +
                                '<div class="menu-item back" onclick="history.go(-2);">' + user_language['menu-back'] + '</div>' +
                                '';

                            _this.html(html_activity);
                        }
                        if (route == 'leaderboard') {
                            socket.emit('show-leaderboard');
                            socket.on('show-leaderboard', function (users) {
                                let html_leaderboard = '';
                                let unsorted_leaderboard = [];
                                let sorted_leaderboard = [];

                                function sortLeaderboard(a, b) {
                                    return b - a;
                                }

                                for (let k in users) {
                                    if ((users[k].name + '') != 'undefined') {
                                        let user_name = users[k].name;
                                        if (typeof users[k].complete == 'undefined') {
                                            users[k].complete = {};
                                        }
                                        let puzzles_complete = users[k].complete.length;
                                        let puzzles_time = 0;

                                        for (let t in users[k].complete) {
                                            puzzles_time += users[k].complete[t][1]
                                        }
                                        if (typeof puzzles_complete != 'undefined') {
                                            unsorted_leaderboard.push([puzzles_complete, user_name, puzzles_time]);
                                        }
                                    }
                                }
                                sorted_leaderboard = unsorted_leaderboard.sort(function (a, b) {
                                    return a[2] - b[2]
                                });
                                sorted_leaderboard = sorted_leaderboard.sort(function (a, b) {
                                    return b[0] - a[0]
                                });
                                for (let k in sorted_leaderboard) {
                                    let leaderboard_item = '' +
                                        '<div class="leaderboard-item" id="' + sorted_leaderboard[k][1] + '">' +
                                        '   <div class="player-complete">' + sorted_leaderboard[k][0] + '</div>' +
                                        '   <div class="player-text">' + user_language['leaderboard-player-content'] + '</div>' +
                                        '   <div class="player-id">' + sorted_leaderboard[k][1] + '</div>' +
                                        '</div>';
                                    html_leaderboard = html_leaderboard + leaderboard_item;
                                }
                                html_activity = '' +
                                    user_language['leaderboard-title'] +
                                    '<div class="leaderboard">' +
                                    '   <div class="leaderboard-wrap">' +
                                    '   ' + html_leaderboard +
                                    '   </div>' +
                                    '</div>' +
                                    '<div class="menu-item back" id="menu">' + user_language['menu-back'] + '</div>' +
                                    '';
                                _this.html(html_activity);
                                $('.menu-item').click(function () {
                                    switch ($(this).attr('id')) {
                                        case 'game-reset-tutorial':
                                            socket.emit('game-reset-tutorial');
                                            location.hash = 'play';
                                            break;
                                        case 'game-authorize':
                                            socket.emit('game-authorize');
                                            break;
                                        case 'game-reset-user':
                                            socket.emit('game-reset-user');
                                            break;
                                        case 'youtube':
                                            openNewAjaxTab('https://www.youtube.com/watch?v=0HvAaDUot0M');
                                            break;
                                        default:
                                            //var audio = new Audio('/sound/menu/' + $(this).text() + '.wav');
                                            //audio.volume = 0.025;
                                            $(document).focus();
                                            $(document).click();
                                            //audio.play();
                                            location.hash = $(this).attr('id');
                                            break;
                                    }
                                });
                            });
                        }
                        if (route == 'level') {
                            html_activity = '' +
                                '<div class="puzzle-page" id="puzzle-page"></div>' +
                                '<div class="puzzle-list" id="puzzle-list"></div>' +
                                '<div class="menu-item back" id="play">' + user_language['menu-back'] + '</div>' +
                                '';
                            _this.html(html_activity);
                        }
                        if (route == 'solver') {
                            html_activity = '' +
                                '<canvas id="puzzle-canvas"></canvas>' +
                                '<div class="menu-item back" id="play">' + user_language['menu-back'] + '</div>' +
                                '<script src="/javascripts/solver.js"></script>' +
                                '';
                            _this.html(html_activity);
                        }
                    });
                    $('#overlay').css({"opacity": "0", "z-index": "-1"});
                    $('.menu-item').click(function () {
                        switch ($(this).attr('id')) {
                            case 'game-reset-tutorial':
                                socket.emit('game-reset-tutorial');
                                location.hash = 'play';
                                break;
                            case 'game-authorize':
                                socket.emit('game-authorize');
                                break;
                            case 'game-reset-user':
                                socket.emit('game-reset-user');
                                break;
                            case 'youtube':
                                openNewAjaxTab('https://www.youtube.com/watch?v=0HvAaDUot0M');
                                break;
                            default:
                                //var audio = new Audio('/sound/menu/' + $(this).text() + '.wav');
                                //audio.volume = 0.025;
                                $(document).focus();
                                $(document).click();
                                //audio.play();
                                location.hash = $(this).attr('id');
                                break;
                        }
                    });
                },
                storage: function (callback) {
                    storage = window.localStorage;
                    callback(true);
                },
                clock: function (callback) {
                    socket.on('clock-draw', function (time) {
                        $('#clock').html(time);
                        storage.setItem('picrossjs-clock', $('#clock').html());
                    });
                    var html_clock = '<hour>00</hour>:<min>00</min>:<sec>00</sec>';
                    if (typeof storage.getItem('picrossjs-clock') != 'undefined') {
                        if (storage.getItem('picrossjs-clock') + '' != 'null') {
                            html_clock = storage.getItem('picrossjs-clock');
                        }
                    }
                    $('#clock').html(html_clock);
                    storage.setItem('picrossjs-clock', $('#clock').html());
                    callback(true);
                },
                events: function (callback) {
                    socket.on('level-complete', function (data) {

                        $('#game').find('.wrapper').css({
                            "transition": "4000ms"
                        });
                        var notification;
                        var timeCodeUnpack = function (time) {
                            var sec = time % 60;
                            var min = (time - sec) / 60 % 60;
                            var hour = (time - sec - min * 60) / 3600;
                            if ((hour + '').length == 1) {
                                hour = '0' + hour;
                            }
                            var str = hour + ':' + ("0" + min).slice(-2) + ':' + ("0" + sec).slice(-2);
                            //console.log('====== TIME CODE UNPACKER ======');
                            //console.log(str);
                            //console.log('====== ================== ======');
                            return (str + '').split(':');
                        }
                        if (!data.overtime) {
                            notification = {
                                type: 'level-complete',
                                id: data.id,
                                title: user_language['notification-complete-title'],
                                button: user_language['notification-complete-button'],
                                audio: '/sound/menu/accept.wav',
                                data: data
                            };
                            socket.emit('user-action', 'Someone complete puzzle "' + data.id + '" with "' + (timeCodeUnpack(data.time) + '').replace(/,/gi, ':') + '"');
                        } else {
                            var timelimit;
                            switch (data.mode) {
                                case 'a':
                                    timelimit = 5;
                                    break;
                                case 'b':
                                    timelimit = 15;
                                    break;
                                case 'c':
                                    timelimit = 20;
                                    break;
                            }
                            notification = {
                                type: 'level-complete',
                                id: data.id,
                                title: user_language['notification-overtime-title'],
                                button: user_language['notification-overtime-button'],
                                content: '' +
                                user_language['notification-overtime-content-0'] + timelimit + user_language['notification-overtime-content-1'],
                                audio: '/sound/menu/fail.wav',
                                data: data
                            };
                            socket.emit('user-action', 'Someone failed puzzle "' + data.id + '" with time "' + (timeCodeUnpack(data.time) + '').replace(/,/gi, ':') + '"');
                        }
                        socket.emit('notification-add', notification);
                    });
                    callback(true);
                },
                display: {
                    hud: function (callback) {
                        var height = $(window).height();
                        callback(true);
                    },
                    gamefield: function (callback) {
                        var audio_empty = new Audio('/sound/puzzle/mark_empty.wav');
                        var audio_filled = new Audio('/sound/puzzle/mark_filled.wav');
                        audio_empty.volume = 0.025;
                        audio_filled.volume = 0.025;
                        socket.on('highlight-full-line', function (line, type) {


                        });
                        socket.on('check-cell', function (data) {
                            try {
                                var _this = $('#' + data.x + '_' + data.y);
                                _this.removeClass('marked');
                                _this.html('');
                                $(document).focus();
                                $(document).click();
                                if (parseInt(data.result)) {
                                    audio_filled.play();
                                    socket.emit('marked-add', {x: data.x, y: data.y});
                                    _this.addClass('true');
                                    _this.css({"box-shadow": "inset 0px 0px 0px 15px #fff"});

                                    var comboText;
                                    if (data.combo >= 2) {
                                        comboText = 'COMBO +' + data.combo
                                    }
                                    if (data.combo == 5) {
                                        //socket.emit('user-action', 'Someone get "+5" combo!');
                                    }

                                    if (data.combo >= 10) {
                                        comboText = '<c style="color: #1dff00">NICE COMBO +' + data.combo + '</c>';
                                    }
                                    if (data.combo == 10) {
                                        //socket.emit('user-action', 'Someone get "+10" combo!');
                                    }

                                    if (data.combo >= 15) {
                                        comboText = '<c style="color: #fa00ff">GREAT COMBO +' + data.combo + '</c>';
                                    }
                                    if (data.combo == 15) {
                                        //socket.emit('user-action', 'Someone get "+15" combo!');
                                    }

                                    if (data.combo >= 20) {
                                        comboText = '<c style="color: #ff0000">AWESOME COMBO +' + data.combo + '</c>';
                                    }
                                    if (data.combo == 20) {
                                        //socket.emit('user-action', 'Someone get "+20" combo!');
                                    }

                                    if (data.combo >= 2) {
                                        _this.html('<div class="message" id="message">' + comboText + '</div>');
                                        _this.children('#message').css({
                                            "top": "-10px",
                                            "transition": "0ms"
                                        });
                                        _this.children('#message').css({
                                            "transition": "400ms"
                                        });
                                        _this.children('#message').css({
                                            "opacity": "1",
                                            "z-index": "2",
                                            "padding": "5px"
                                        });
                                        _this.children('#message').css({
                                            "height": "20px"
                                        });
                                    }
                                    setTimeout(function () {
                                        _this.css({"box-shadow": "inset 0px 0px 0px 0px #fff"});
                                        _this.children('#message').css({
                                            "top": "-40px"
                                        });
                                        try {
                                            (_this.children('#message'))[0].addEventListener("transitionend", function () {
                                                _this.children('#message').html('');
                                                _this.children('#message').remove();
                                            });
                                            _this.removeClass('marked');
                                        } catch (e) {

                                        }
                                    }, 100);
                                } else {
                                    $(document).focus();
                                    $(document).click();
                                    audio_empty.play();
                                    socket.emit('marked-add', {x: data.x, y: data.y});
                                    _this.addClass('false');
                                    _this.css({"background-color": "rgba(236, 101, 97, 1)"});
                                    _this.css({"box-shadow": "inset 0px 0px 0px 15px #fff"});
                                    _this.html('<div class="message" id="message">+60 sec</div><i class="fas fa-times" style="opacity:0"></i>');
                                    _this.children('#message').css({
                                        "top": "-10px",
                                        "transition": "0ms"
                                    });
                                    _this.children('#message').css({
                                        "transition": "400ms"
                                    });
                                    _this.children('#message').css({
                                        "opacity": "1",
                                        "z-index": "2",
                                        "padding": "5px"
                                    });
                                    _this.children('#message').css({
                                        "height": "20px"
                                    });
                                    //MOUSEHOLD
                                    isMouseHold = false;
                                    setTimeout(function () {
                                        _this.css({"box-shadow": "inset 0px 0px 0px 0px #fff"});
                                        _this.children('#message').css({
                                            "top": "-40px"
                                        });
                                        try {
                                            (_this.children('#message'))[0].addEventListener("transitionend", function () {
                                                _this.css({"background-color": "rgba(255, 255, 255, 1)"});
                                                _this.children('.fa-times').attr('style', 'opacity:1');
                                                _this.children('#message').html('');
                                                _this.children('#message').remove();
                                            });
                                        } catch (e) {

                                        }
                                        _this.removeClass('marked');
                                    }, 100);
                                }
                                setTimeout(function () {
                                    storage.setItem('picrossjs-gamefield', $('.gamefield').html());
                                }, 1000);
                            } catch (e) {
                                console.log(e)
                            }
                        });
                        socket.on('puzzle-draw', function (data) {
                            console.log('puzzle-draw')
                            if (typeof data.id != 'undefined' && (data.id + '') != 'undefined') {
                                //socket.emit('user-action', 'Someone playing in puzzle "' + data.id + '"');
                            }
                            game.level.id = data.id;
                            game.level.size = data.size;
                            var html = '';
                            var hint_vertical = '';
                            var hint_horizontal = '';
                            for (var y = 0; y < (data.vertical_hint).length; y++) {
                                var _hint = '';
                                for (var i = 0; i < (data.vertical_hint)[y].length; i++) {
                                    _hint = _hint + '<div>' + (data.vertical_hint)[y][i] + '</div>';
                                }
                                hint_vertical = hint_vertical + '<div class="hint vertical" id="v' + y + '">' + _hint + '</div>';
                            }
                            for (var x = 0; x < (data.horizontal_hint).length; x++) {
                                var _hint = '';
                                for (var i = 0; i < (data.horizontal_hint)[x].length; i++) {
                                    _hint = _hint + '<div>' + (data.horizontal_hint)[x][i] + '</div>';
                                }
                                hint_horizontal = hint_horizontal + '<div class="hint horizontal" id="h' + x + '"><div class="hint-align">' + _hint + '</div></div>';
                            }
                            for (var y = 0; y < data.size; y++) {
                                var line = '';
                                for (var x = 0; x < data.size; x++) {
                                    line = line + '<div class="cell" id="' + x + '_' + y + '"></div>';
                                }
                                html = html + line + '<br>';
                            }
                            // Load backup of gamefield
                            {
                                if (typeof storage.getItem('picrossjs-gamefield') != 'undefined') {
                                    if (storage.getItem('picrossjs-gamefield') + '' != 'null') {
                                        html = storage.getItem('picrossjs-gamefield');
                                    }
                                }
                            }
                            // Draw mobile control
                            // Draw gamefield
                            {
                                $('.activity#game').html('' +
                                    '<div class="wrapper-scale">' +
                                    '<div class="wrapper">' +
                                    '   <div class="horizontal">' +
                                    '       <div class="ingame-menu" id="ingame-menu">' +
                                    '           <div class="menu-level">LEVEL ' + game.level.id + '</div>' +
                                    '           <div class="clock" id="clock"></div>' +
                                    '           <div class="puzzle-menu">' +
                                    '               <div class="puzzle-button" id="puzzle-exit"><i class="fas fa-home"></i></div>' +
                                    '               <div class="puzzle-button" id="puzzle-help"><i class="fas fa-question"></i></div>' +
                                    '               <div class="puzzle-button mark-off" id="puzzle-marker"><i class="fas fa-pencil-alt"></i></div>' +
                                    '           </div>' +
                                    '       </div>' +
                                    '       ' + hint_horizontal +
                                    '   </div>' +
                                    '   <div class="vertical">' + hint_vertical + '</div>' +
                                    '   <div class="gamefield">' +
                                    '   ' + html +
                                    '   </div>' +
                                    '</div>' +
                                    '</div>'
                                );
                            }
                            // Draw yellow guidlines
                            {
                                var narrationline_horizontal_html = '<div class="narrationline-horizontal"></div>';
                                var narrationline_vertical_html = '<div class="narrationline-vertical"></div>';
                                setTimeout(function () {
                                    var splitter = (data.size) / 5;
                                    for (var _s = 1; _s < splitter; _s++) {
                                        var width = $('.gamefield').width();
                                        var height = $('.gamefield').height();
                                        var step = (height / splitter);
                                        $('.gamefield').append(narrationline_horizontal_html);
                                        $('.gamefield').append(narrationline_vertical_html);
                                        var step_offset = step * _s;
                                        $('.narrationline-horizontal').last().css({"top": step_offset - 3});
                                        $('.narrationline-vertical').last().css({"left": step_offset - 3});
                                    }

                                }, 100);
                            }


                            game.init.clock(function () {
                            });
                            setTimeout(function(){

                                mobileVersion();
                            }, 500)
                            callback(true);
                        });
                    }
                }
            }
        };
        game.init.storage(function () {
        });
        game.init.events(function () {
        });
        game.init.menu();
        game.init.display.hud(function () {
        });
        game.init.display.gamefield(function () {
        });
        $('.default').click(function () {
            //console.log('Finded default elements with type "' + JSON.stringify(this) + '"');
            var element_type = $(this).prev().prop('nodeName');
            //console.log('Finded default elements with type "' + JSON.stringify(element_type) + '"');
            //console.log('Finded default elements with type "' + element_type + '"');
            var element_all = $('.default').parent().find(element_type);
            element_all.each(function () {
                var _this = $(this);
                if (!_this.hasClass('default')) {
                    _this.css({
                        "opacity": "-1",
                        "z-index": "2",
                        "display": "block"
                    })
                }
                _this.click(function () {
                    var _this = $(this);
                    if (_this.parent().attr('id') == 'volume') {
                        _this.removeClass('default');
                        _this.next().addClass('default');
                    }
                });
            });
        });
    });
});