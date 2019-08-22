var isWin = process.platform === "win32";
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
var connected_users = {};
var shortid = require('shortid');
var IO = function (io, db) {
    io.on('connection', function (socket) {
        var user_language;
        //console.log(socket.request.session)
        // var notificationInterval = setInterval(function () {
        //     //console.log('[NOTIFICATION-MANAGER] - Listener is running');
        // }, 1000);
        var resetSession = function () {
            game.session.new(function (session) {
                if (session) {
                    //console.log('================================================================');
                    //console.log('[CORE] - User SESSION is renewed');
                    //console.log(session);
                    //console.log(session);
                }
            });
        };
        //console.log(socket.id + ' is connected');
        //console.log(socket.request.session.notifications.active);
        var notificationManager = {
            add: function (notification) {
                try {
                    var active_notifications = socket.request.session.notifications.active;
                    var viewed_notifications = socket.request.session.notifications.viewed;
                    var is_viewed = 0;
                    for (var n = 0; n < viewed_notifications.length; n++) {
                        if ('' + viewed_notifications[n] != 'null') {
                            if ('' + notification != 'null') {
                                if (notification.id == viewed_notifications[n].id) {
                                    is_viewed++;
                                }
                            }
                        }
                    }
                    for (var n = 0; n < active_notifications.length; n++) {
                        if ('' + active_notifications[n] != 'null') {
                            if (notification.id == active_notifications[n].id) {
                                is_viewed++;
                            }
                        }
                    }
                    if (is_viewed == 0) {
                        if ('' + active_notifications != 'null') {
                            active_notifications.push(notification);
                            socket.request.session.notifications.active = active_notifications;
                            socket.request.session.save();
                            //console.log(' [NOTIFICATION-MANAGER] - notification added to active list');
                        }
                    } else {
                        //console.log(' [NOTIFICATION-MANAGER] - already viewed notification');
                    }
                    setTimeout(function () {
                        if ('' + socket.request.session.notifications.active[0] != 'null') {
                            socket.emit('notification-add', socket.request.session.notifications.active[0]);
                        } else {
                            socket.emit('notification-add', notification);
                        }
                    }, 3);
                    //console.log('====== ADD ACTIVE ======')
                    //console.log(JSON.stringify(socket.request.session.notifications.active))
                    //console.log('====== ADD VIEWED ======')
                    //console.log(JSON.stringify(socket.request.session.notifications.viewed))
                } catch (e) {
                    //console.log(e);
                }
            },
            remove: function (notification) {
                var active_notifications = socket.request.session.notifications.active;
                var viewed_notifications = socket.request.session.notifications.viewed;
                viewed_notifications.push(notification);
                //console.log(' [NOTIFICATION-MANAGER] - Add to viewed: "' + notification + '"');
                socket.request.session.notifications.viewed = viewed_notifications;
                active_notifications.splice(0, 1);
                socket.request.session.notifications.active = active_notifications;
                socket.request.session.save();
                //console.log(' [NOTIFICATION-MANAGER] - Remove from active: "' + notification + '"');
                //console.log('====== REMOVE ACTIVE ======')
                //console.log(JSON.stringify(socket.request.session.notifications.active))
                //console.log('====== REMOVE VIEWED ======')
                //console.log(JSON.stringify(socket.request.session.notifications.viewed))
            },
            removeall: function (notification) {
                var active_notifications = socket.request.session.notifications.active;
                var viewed_notifications = socket.request.session.notifications.viewed;
                active_notifications.splice(0, 1);
                socket.request.session.notifications.active = active_notifications;
                socket.request.session.save();
                //console.log(' [NOTIFICATION-MANAGER] - Remove from active: "' + notification + '"');
                //console.log('====== REMOVEALL ACTIVE ======')
                //console.log(JSON.stringify(socket.request.session.notifications.active))
                //console.log('====== REMOVEALL VIEWED ======')
                //console.log(JSON.stringify(socket.request.session.notifications.viewed))
            },
            wipe: function (notification) {
                var active_notifications = socket.request.session.notifications.active;
                var viewed_notifications = socket.request.session.notifications.viewed;
                active_notifications = [];
                viewed_notifications = [];
                socket.request.session.notifications.active = active_notifications;
                socket.request.session.notifications.viewed = viewed_notifications;
                socket.request.session.save();
                //console.log('====== WIPE ACTIVE ======')
                //console.log(JSON.stringify(socket.request.session.notifications.active))
                //console.log('====== WIPE VIEWED ======')
                //console.log(JSON.stringify(socket.request.session.notifications.viewed))
            }
        };
        var game = {
            session: {
                new: function (callback) {
                    var level = {
                        id: '',         // Current user puzzle
                        status: '',     // Current user  status
                        time: 0,        // Saved timer for current game
                        result: 0,      // Saved total value of clicked on right blocks
                        hint: 0,        // Saved value of total used hints
                        clicked: [],    // Saved ids of clicked cells to prevet double click
                        incorrect: [],  // Saved ids of incorrect cells
                        correct: [],    // Saved ids of correct cells
                        marked: []      // Saved ids of marked cells
                    };
                    if (typeof socket.request.session.notifications == 'undefined') {
                        var notifications = { // Saved user notifications
                            active: [], // Active notifications will be showed to user
                            viewed: [], // List of already viewed notifications ids
                            listener: void 0 // Notification listere interval id for clearing it
                        };
                        socket.request.session.notifications = notifications;
                    }
                    socket.request.session.level = level;
                    socket.request.session.save();
                    callback(socket.request.session);
                }
            },
            clock: function (callback) {
                connected_users[socket.id] = {
                    interval: {
                        clock: setInterval(function () {
                            var sec = socket.request.session.level.time % 60;
                            var min = (socket.request.session.level.time - sec) / 60 % 60;
                            var hour = (socket.request.session.level.time - sec - min * 60) / 3600;
                            if ((hour + '').length == 1) {
                                hour = '0' + hour;
                            }
                            var str = '<hour>' + hour + '</hour>:<min>' + ("0" + min).slice(-2) + '</min>:<sec>' + ("0" + sec).slice(-2) + '</sec>';
                            socket.emit('clock-draw', str);
                        }, 100),
                        iterator: setInterval(function () {
                            socket.request.session.level.time++;
                            socket.request.session.save();
                        }, 1000)
                    }
                };
                //
                // notificationManager.listener(function (listener) {
                //     if (listener) {
                //         //console.log('================================================================');
                //         //console.log('[NOTIFICATION-MANAGER] - Listener is running');
                //         //console.log(listener);
                //     }
                // });
                callback(true);
            },
            puzzle: {
                list: function (mode, callback) {
                    //console.log('mode: ' + JSON.stringify(mode));
                    var _mode = mode.charAt(0);
                    var _page = parseInt(_mode.charAt(1));
                    if (_page + '' == 'NaN') {
                        _page = 0;
                    }
                    //console.log('_mode: ' + _mode + '   _page: ' + _page);
                    var _path;
                    switch (_mode) {
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

                    var name = socket.request.session.name;
                    var puzzleDir = './public/level/' + _path + '/';
                    var fs = require('fs');
                    fs.readdir(puzzleDir, (err, files) => {
                        var puzzle_list = [];
                        for (var f = 0; f < files.length; f++) {
                            //console.log(files[f]);
                            var _id = (files[f].toString()).replace(/.txt/g, '');
                            puzzle_list.push(_id);
                        }
                        //console.log('puzzle_list: ' + puzzle_list);
                        socket.emit('puzzle-list', JSON.stringify(puzzle_list));
                    });
                    if (typeof name != 'undefined') {
                        var users = db.getCollection("users");
                        var result = users.find({"name": name});
                        var completed = result[0];
                        if (typeof completed != 'undefined') {
                            completed = completed.complete;
                            //console.log(completed);
                            var completed_list = [];
                            var generateThumb = function (level, callback) {
                                var fs = require('fs');
                                fs.readFile('./public/level/' + _path + '/' + level + '.txt', 'utf8', function (err, contents) {
                                    var html_thumb = '';
                                    if (typeof contents != 'undefined') {
                                        let splitter = '\n';
                                        if(isWin){
                                            splitter = '\r\n';
                                        }
                                        var level_size = (contents.split(splitter)).length;
                                        contents = contents.split(splitter);
                                        var horizontal = [];
                                        for (var y = 0; y < contents.length; y++) {
                                            var line = '';
                                            for (var x = 0; x < contents[y].length; x++) {
                                                if (parseInt(contents[y][x])) {
                                                    line = line + '<div class="thumb-block black"></div>';
                                                } else {
                                                    line = line + '<div class="thumb-block white"></div>';
                                                }
                                            }
                                            html_thumb = html_thumb + line + '<br>';
                                        }
                                    }
                                    callback(html_thumb);
                                });
                            };
                            var next_val = 0;

                            function next() {
                                var _this = cur_complete[next_val];
                                if (typeof _this != 'undefined') {
                                    if (_mode == (_this[0] + '').charAt(0)) {
                                        //console.log('mode: ' + _mode + ' letter: ' + (_this[0].charAt(0) + ''));
                                        generateThumb(_this[0], function (html_thumb) {
                                            //console.log();

                                            //console.log('generateThumb: ' + html_thumb)
                                            completed_list.push([_this[0], _this[1], html_thumb]);
                                            if (next_val < cur_complete.length - 1) {
                                                next_val++;
                                                next();
                                            } else {
                                                next_val = 0;
                                                //console.log('completed_list: ' + completed_list)
                                                socket.emit('puzzle-list-completed', JSON.stringify(completed_list));
                                            }
                                        });
                                    }
                                }
                            }

                            var cur_complete = [];
                            try {
                                for (var i = 0; i < completed.length; i++) {
                                    if (_mode == (completed[i][0] + '').charAt(0)) {
                                        cur_complete.push(completed[i]);
                                    }

                                }
                            } catch (e) {

                            }
                            next();
                        }
                    }
                }
            }
        };
        socket.on('game-reset-user', function () {
            if (typeof socket.request.session.name != 'undefined') {
                var users = db.getCollection("users");
                var result = users.find({"name": socket.request.session.name});
                if (typeof result != 'undefined') {
                    users.remove(result);
                    db.saveDatabase();
                    result = users.find({"name": socket.request.session.name});
                    //console.log('====== GAME RESET USER PROGRESS ======');
                    //console.log(JSON.stringify(result));
                    var notification = {
                        type: 'game-notification-simple',
                        id: 'game-notification-simple',
                        title: user_language['notification-game-reset-progress-title'],
                        content: user_language['notification-game-reset-progress-content'],
                        button: user_language['menu-back'],
                        audio: ''
                    };
                    socket.emit('notification-add', notification);
                }
            }
        });
        socket.on('game-reset-tutorial', function () {
            var active_notifications = socket.request.session.notifications.active;
            var viewed_notifications = socket.request.session.notifications.viewed;
            active_notifications = [];
            viewed_notifications = [];
            socket.request.session.notifications.active = active_notifications;
            socket.request.session.notifications.viewed = viewed_notifications;
            socket.request.session.save();
            //console.log('====== GAME WIPE NOTIFICATION ACTIVE ======');
            //console.log(JSON.stringify(socket.request.session.notifications.active));
            //console.log('====== GAME WIPE NOTIFICATION VIEWED ======');
            //console.log(JSON.stringify(socket.request.session.notifications.viewed));
            // var notification = {
            //     type: 'game-notification-simple',
            //     id: 'game-notification-simple',
            //     title: user_language['notification-game-reset-tutorial-title'],
            //     content: user_language['notification-game-reset-tutorial-content'],
            //     button: user_language['menu-back'],
            //     audio: ''
            // };
            // socket.emit('notification-add', notification);
        });
        socket.on('game-authorize', function () {
            if (parseInt((socket.request.session.pass + '').length) == 0 || (socket.request.session.pass + '') == 'undefined') {
                var notification = {
                    type: 'game-authorize',
                    id: 'game-authorize',
                    title: user_language['notification-game-authorize-title'],
                    content: user_language['notification-game-authorize-content'] +
                    '<input type="text" id="auhorize-username" placeholder="' + user_language['notification-game-authorize-placeholder-username'] + '" autocomplete="off"></input>' +
                    '<input type="text" id="auhorize-password" placeholder="' + user_language['notification-game-authorize-placeholder-password'] + '" autocomplete="off"></input>' +
                    '<p id="auhorize-error"></p>',
                    button: [user_language['notification-game-authorize-button'], user_language['menu-back']],
                    audio: '',
                    data: {
                        name: socket.request.session.name,
                        id: socket.request.session.level.id
                    }
                };
                socket.emit('notification-add', notification);
            } else {
                try {
                    var notification = {
                        type: 'game-authorize',
                        id: 'game-authorize',
                        title: user_language['notification-game-authorized-title'],
                        content: user_language['notification-game-authorized-content-a'] + socket.request.session.name + user_language['notification-game-authorized-content-b'],
                        button: [user_language['notification-game-authorized-button'], user_language['menu-back']],
                        audio: '',
                        data: {
                            name: socket.request.session.name,
                            id: socket.request.session.level.id
                        }
                    };
                    socket.emit('notification-add', notification);
                } catch (e) {

                }
            }
        });
        socket.on('user-action', function (action) {
            socket.broadcast.emit('user-action', action);
        });
        socket.on('game-hint', function () {

            //console.log('====== GAME HINT ======');
            if (typeof socket.request.session.level != 'undefined') {
                var hint = socket.request.session.level.hint;
                if (parseInt(hint) == parseInt(0)) {
                    hint++;
                    socket.request.session.level.hint = hint;
                    socket.request.session.save();
                    var generateHint = function () {
                        function getRandomInt(min, max) {
                            return Math.floor(Math.random() * (max - min + 1)) + min;
                        }

                        var lines;
                        var bad_lines;
                        if (getRandomInt(0, 1)) {
                            lines = socket.request.session.level.correct[2];
                            bad_lines = socket.request.session.level.incorrect[2];
                        } else {
                            lines = socket.request.session.level.correct[3];
                            bad_lines = socket.request.session.level.incorrect[3];
                        }

                        if (lines.length != bad_lines.length) {
                            setTimeout(function () {
                                generateHint();
                            }, 10);
                        } else {
                            var rnd = getRandomInt(0, lines.length - 1);
                            var line = (lines[rnd] + '').split(',');
                            var bad_line = (bad_lines[rnd] + '').split(',');
                            socket.emit('game-hint', {correct: line, incorrect: bad_line});
                        }
                    };
                    generateHint();
                } else {
                    socket.emit('game-hint', false);
                }
            }
        });
        socket.on('hash', function (location) {
            //console.log('================================================================');
            //console.log(JSON.stringify(socket.request.session.level));
            if (typeof (connected_users[socket.id]) != 'undefined') {
                clearInterval((connected_users[socket.id]).interval.clock);
                clearInterval((connected_users[socket.id]).interval.iterator);
                (connected_users[socket.id]).interval.clock = setInterval(function () {
                }, 100);
                (connected_users[socket.id]).interval.iterator = setInterval(function () {
                }, 1000);
            }
            //console.log('================================================================');
            //console.log('[CORE] - User HASH path is');
            //console.log('LOCATION: # ' + location);

            // User-Action
            // if((location+'').length > 0){
            //     socket.broadcast.emit('user-action', 'Open page "'+location+'" by someone');
            // }

            if (location.search('level-') != -1) {
                location = location.replace(/level-/g, '');
                if (location.length <= 0) {
                    location = 'menu'
                }
                game.puzzle.list(location);
            }
            if (location != 'game') {
                resetSession();
            } else {
                if (typeof socket.request.session.level != 'undefined') {
                    if (typeof socket.request.session.level.id != 'undefined' && (socket.request.session.level.id).toString().length > 0) {
                        game.clock(function (session) {
                            if (session) {
                                //console.log('================================================================');
                                //console.log('[CORE] - User PUZZLE CLOCK is running');
                                //console.log(session);
                            }
                        });
                    } else {
                        socket.emit('hash', 'menu');
                    }
                }
            }
        });
        socket.on('show-leaderboard', function () {
            var users = db.getCollection("users");
            var have_password = users.find({name: socket.request.session.name});
            var all_users = JSON.parse(JSON.stringify(users.find({})));
            var result_sorted = [];
            //console.log('====== SHOW LEADERBOARD ======');
            //console.log(have_password);
            //if ((have_password.password + '') != 'undefined') {
            for (let t in all_users) {
                if ((all_users[t].name + '') != 'undefined') {
                    if ((all_users[t].pass + '') == 'undefined') {
                        all_users[t].name = 'SOMEONE';
                    }
                    result_sorted.push(all_users[t]);
                }
            }
            //console.log('====== HAVE PASSWORD ======');
            //}else{
            //    //console.log('====== DOSNT HAVE PASSWORD ======');
            //}
            //console.log('====== SHOW LEADERBOARD ======');
            //console.log(result_sorted);

            socket.emit('show-leaderboard', result_sorted);
            // if (typeof result != 'undefined') {
            //     //console.log('length: ' + result.length);
            //     if (result.length == 0) {
            //         users.insert({name: level.name, complete: [[level.id, socket.request.session.level.time]]});
            //         db.saveDatabase();
            //     } else {
            //         result = users.find({"name": level.name})
            //         if (typeof result.complete == 'undefined') {
            //             result.complete = [];
            //         }
            //         var pass = 0;
            //         for (var i = 0; i < (result[0].complete).length; i++) {
            //             if ((result[0].complete)[i][0] + '' == level.id + '') {
            //                 (result[0].complete)[i][1] = socket.request.session.level.time;
            //                 pass++;
            //             }
            //         }
            //         if (pass == 0) {
            //             (result[0].complete).push([level.id, socket.request.session.level.time]);
            //         }
            //         users.update(result);
            //         db.saveDatabase();
            //     }
            //     socket.request.session.name = level.name;
            //     socket.request.session.save();
            // }
            // result = users.find();
            // //console.log(result);
            // //console.log('updating db for ' + level.name);
            // resetSession();
        });
        socket.on('auth-set-name', function (level) {
            if (parseInt(socket.request.session.level.time) != 0) {
                console.log('============ SESSION ============')
                console.log(socket.request.session.level.time)
                console.log('============ SESSION ============')
                var users = db.getCollection("users");
                var result = users.find({"name": level.name});
                if (typeof result != 'undefined') {
                    //console.log('length: ' + result.length);
                    //console.log('====== AUTHSETNAME =======');
                    //console.log('====== '+JSON.stringify(result)+' =======');
                    //console.log({name: level.name, complete: [[level.id, socket.request.session.level.time]]});
                    if (result.length == 0) {
                        users.insert({
                            name: level.name,
                            pass: level.pass,
                            complete: [[level.id, socket.request.session.level.time]]
                        });
                        db.saveDatabase();
                    } else {
                        result = users.find({"name": level.name})
                        if (typeof result[0].complete == 'undefined') {
                            result[0].complete = [];
                        }
                        var pass = 0;
                        try {
                            for (var i = 0; i < (result[0].complete).length; i++) {
                                if ((result[0].complete)[i][0] + '' == level.id + '') {
                                    (result[0].complete)[i][1] = socket.request.session.level.time;
                                    pass++;
                                }
                            }
                            if (pass == 0) {
                                (result[0].complete).push([level.id, socket.request.session.level.time]);
                            }
                            users.update(result);
                            db.saveDatabase();
                        } catch (e) {
                            //console.log('!!! === !!!')
                            //console.log(e)
                            //console.log('!!! === !!!')
                        }
                    }
                    socket.request.session.name = level.name;
                    socket.request.session.save();
                }
                result = users.find();
                //console.log(result);
                //console.log('updating db for ' + level.name);
                resetSession();
            }
        });
        socket.on('game-auth-user', function (level) {
            //console.log('====== AUTH SET NAME ======');
            //console.log(level);
            if (typeof level.newname != 'undefined') {
                var authorization_pass = 0;
                if ((level.newname + '').length <= 2 || (level.password + '').length <= 2) {
                    socket.emit('auth-get-result', user_language['notification-game-authorize-error-a']);
                    authorization_pass++;
                }
                if (authorization_pass == 0) {
                    var users = db.getCollection("users");
                    var result = users.find({"name": level.name});
                    if (typeof result != 'undefined') {
                        //console.log('length: ' + result.length);
                        if (result.length == 0) {
                            users.insert({name: level.name, complete: [[level.id, socket.request.session.level.time]]});
                            socket.request.session.name = level.newname;
                            socket.request.session.pass = level.password;
                            socket.request.session.save();
                            db.saveDatabase();
                            socket.emit('auth-done', user_language['notification-game-authorize-error-b']);
                            socket.emit('auth-update-user', level.newname, level.password);
                        } else {
                            var is_new_name_exist = users.find({"name": level.newname});
                            result = users.find({"name": level.name});
                            //console.log('====== IF NEWNAME EXIST ======');
                            if (parseInt(is_new_name_exist.length) == 0) {
                                // IF ITS NEW NAME
                                if ((level.newname + '') != 'undefined' && (level.newname + '') != 'undefined') {
                                    result[0].name = level.newname;
                                    result[0].pass = level.password;
                                    socket.request.session.name = result[0].name;
                                    socket.request.session.pass = result[0].pass;
                                    socket.emit('auth-done', user_language['notification-game-authorize-error-c'] + ' "<b>' + result[0].name + '</b>"');
                                    socket.emit('auth-update-user', result[0].name, result[0].pass);
                                } else {
                                    socket.emit('auth-get-result', user_language['notification-game-authorize-error-d']);
                                }
                            } else {
                                // IF PASSWORD EXIST
                                if (is_new_name_exist[0].pass + '' == level.password + '') {
                                    // IF PASSWORD CORRECT
                                    socket.emit('auth-done', user_language['notification-game-authorize-error-c'] + ' "<b>' + is_new_name_exist[0].name + '</b>"');

                                    level.name = is_new_name_exist[0].name;
                                    socket.request.session.name = is_new_name_exist[0].name;
                                    socket.request.session.pass = is_new_name_exist[0].pass;
                                    socket.emit('auth-update-user', is_new_name_exist[0].name, is_new_name_exist[0].pass);
                                    result = JSON.parse(JSON.stringify(is_new_name_exist));
                                } else {
                                    // IF PASSWORD ISNT CORRECT
                                    socket.emit('auth-get-result', user_language['notification-game-authorize-error-d']);
                                }
                            }
                            users.update(result);
                            db.saveDatabase();
                            socket.request.session.name = result[0].name;
                            socket.request.session.pass = result[0].pass;
                            socket.request.session.save();
                        }
                        //console.log('====== SESSIOOOOOOOOOOOOOOOOON =====')
                        //console.log(socket.request.session)
                    }
                    result = users.find();
                    resetSession();
                }
            }
        });
        socket.on('game-auth-user-logout', function (level) {
            //console.log('====== AUTH USER LOGOUT ======');
            delete socket.request.session.name;
            delete socket.request.session.pass;
            socket.request.session.save();
            game.session.new(function () {
                resetSession();
            });
        });
        var cellMarkedCalculate = function (data) {
            var marked_ids = (socket.request.session.level.marked);
            var clicked_ids = (socket.request.session.level.clicked);
            clicked_ids = marked_ids.sort(function (a, b) {
                var _a = a.split('_');
                var _b = b.split('_');
                if (_a[0] < _b[0])
                    return -1;
                if (_a[0] > _b[0])
                    return 1;
                return 0;
            });
            marked_ids = marked_ids.sort(function (a, b) {
                var _a = a.split('_');
                var _b = b.split('_');
                if (_a[0] < _b[0])
                    return -1;
                if (_a[0] > _b[0])
                    return 1;
                return 0;
            });
            // Calculate marked HORIZONTAL
            var marked_horizontal_line = [];
            var marked_horizontal = [];
            var marked_vertical_line = [];
            var marked_vertical = [];
            var prev_line;
            var prev_lines;

            // MARKED VERTICAL
            for (var i = 0; i < marked_ids.length; i++) {
                var _this = marked_ids[i].split('_');
                if (typeof prev_line == 'undefined') {
                    prev_line = _this[0];
                }
                if (prev_line != _this[0]) {
                    marked_vertical.push(marked_vertical_line);
                    marked_vertical_line = [_this[0] + '_' + _this[1]];
                    prev_line = _this[0];
                } else {
                    marked_vertical_line.push(_this[0] + '_' + _this[1]);
                }
                if (typeof marked_ids[i + 1] == 'undefined') {
                    prev_line = void 0;
                    marked_vertical.push(marked_vertical_line);
                    marked_vertical_line = [];
                }
            }

            marked_ids = marked_ids.sort(function (a, b) {
                var _a = a.split('_');
                var _b = b.split('_');
                if (_a[1] < _b[1])
                    return -1;
                if (_a[1] > _b[1])
                    return 1;
                return 0;
            });

            // MARKED HORIZONTAL
            prev_lines = void 0;
            for (var i = 0; i < marked_ids.length; i++) {
                var _this = marked_ids[i].split('_');
                if (typeof prev_lines == 'undefined') {
                    prev_lines = _this[1];
                }
                if (prev_lines != _this[1]) {
                    marked_horizontal.push(marked_horizontal_line);
                    marked_horizontal_line = [_this[0] + '_' + _this[1]];
                    prev_lines = _this[1];
                } else {
                    marked_horizontal_line.push(_this[0] + '_' + _this[1]);
                }
                if (typeof marked_ids[i + 1] == 'undefined') {
                    prev_lines = void 0;
                    marked_horizontal.push(marked_horizontal_line);
                    marked_horizontal_line = [];
                }
            }
            var dehighlited = [];

            function doThat(modded_x) {
                var correct_array;
                var incorrect_array;
                var marked_array;
                var modded_y;
                if (parseInt(modded_x) == 0) {
                    correct_array = socket.request.session.level.correct[3];
                    incorrect_array = socket.request.session.level.incorrect[3];
                    marked_array = marked_horizontal;
                    modded_y = 1;
                } else {
                    correct_array = socket.request.session.level.correct[2];
                    incorrect_array = socket.request.session.level.incorrect[2];
                    marked_array = marked_vertical;
                    modded_y = 0;

                }
                if (typeof correct_array != 'undefined') {
                    for (var _i = 0; _i < correct_array.length; _i++) {
                        var _t = correct_array[_i];

                        if (typeof _t != 'undefined') {
                            var _correct = _t.slice(0);
                            var _modded = [];
                            prev_lines = void 0;
                            var modded_insert = [];
                            var modded_insert_element = [];
                            for (var i = 0; i < _correct.length; i++) {
                                var _this = (_correct[i]).toString().split('_');
                                if (typeof prev_lines == 'undefined') {
                                    prev_lines = _this[modded_x];
                                }
                                if (parseInt(_this[modded_x] - prev_lines) > 1) {
                                    modded_insert.push(modded_insert_element);
                                    modded_insert_element = [_this[0] + '_' + _this[1]];
                                } else {
                                    modded_insert_element.push(_this[0] + '_' + _this[1])
                                }
                                prev_lines = _this[modded_x];
                                if (typeof _correct[i + 1] == 'undefined') {
                                    modded_insert.push(modded_insert_element);
                                    modded_insert_element = [];
                                    prev_lines = void 0;
                                }

                            }
                            _modded = modded_insert;

                        }
                        var clicked_ids = socket.request.session.level.clicked;
                        for (var i = 0; i < _modded.length; i++) {
                            if (typeof _modded[i] != 'undefined') {
                                var isBlocksUnlocked = 0;
                                var needBlocksUnlocked = _modded[i].length;
                                var allBlocksUnlocked = ((_modded + '').split(',')).length;
                                var begin;
                                var end;
                                for (var m = 0; m < _modded[i].length; m++) {
                                    //console.log('_modded[i][m]: '+_modded[i][m]);
                                    for (var c = 0; c < clicked_ids.length; c++) {
                                        //console.log('clicked_ids[c]: '+clicked_ids[c]);
                                        if (_modded[i][m] == clicked_ids[c]) {
                                            isBlocksUnlocked++;
                                        }
                                    }
                                }

                                if (parseInt(isBlocksUnlocked) == parseInt(needBlocksUnlocked)) {
                                    var first = _modded[i][0];
                                    var last = _modded[i][_modded[i].length - 1];
                                    var compare_need = 2;
                                    if (first == last) {
                                        var x_begin = parseInt(first.split('_')[modded_x]) - 1;
                                        var x_end = parseInt(first.split('_')[modded_x]) + 1;
                                        var y_begin = parseInt(first.split('_')[modded_y]);
                                        var y_end = parseInt(first.split('_')[modded_y]);
                                        if (parseInt(x_begin) < 0) {
                                            x_begin = 0;
                                        }
                                        if (parseInt(x_end) > correct_array.length - 1) {
                                            x_end = correct_array.length - 1;
                                        }
                                        if (modded_x == 0) {
                                            begin = x_begin + '_' + y_begin;
                                            end = x_end + '_' + y_end;
                                        } else {
                                            begin = y_begin + '_' + x_begin;
                                            end = y_end + '_' + x_end;

                                        }
                                    } else {
                                        var x_begin = parseInt(first.split('_')[modded_x]) - 1;
                                        var x_end = parseInt(last.split('_')[modded_x]) + 1;
                                        var y_begin = parseInt(first.split('_')[modded_y]);
                                        var y_end = parseInt(last.split('_')[modded_y]);
                                        if (parseInt(x_begin) < 0) {
                                            x_begin = 0;
                                        }
                                        if (parseInt(x_end) > correct_array.length - 1) {
                                            x_end = correct_array.length - 1;
                                        }
                                        if (modded_x == 0) {
                                            begin = x_begin + '_' + y_begin;
                                            end = x_end + '_' + y_end;
                                        } else {
                                            begin = y_begin + '_' + x_begin;
                                            end = y_end + '_' + x_end;
                                        }
                                    }
                                    for (var l = 0; l < marked_array.length; l++) {
                                        if (typeof marked_array[l] != 'undefined') {
                                            var need_to_highlight = 0;
                                            for (var j = 0; j < marked_array[l].length; j++) {
                                                if (marked_array[l][j] == begin || marked_array[l][j] == end) {
                                                    need_to_highlight++;
                                                }
                                            }
                                            if (need_to_highlight == 2) {
                                                var x;
                                                var y;
                                                if (modded_x == 0) {
                                                    x = parseInt((_modded[i][0] + '').split('_')[0]);
                                                    y = parseInt((_modded[i][0] + '').split('_')[1]);
                                                    dehighlited.push({horizontal: y, hint: i});
                                                } else {
                                                    x = parseInt((_modded[i][0] + '').split('_')[1]);
                                                    y = parseInt((_modded[i][0] + '').split('_')[0]);
                                                    dehighlited.push({vertical: y, hint: i});
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }

            doThat(0);
            doThat(1);
            socket.emit('hint-highlight', dehighlited);
        };
        socket.on('marked-add', function (data) {
            var correct_ids = socket.request.session.level.correct[0];
            var marked_ids = (socket.request.session.level.marked);
            var clicked_id = data.x + '_' + data.y;
            marked_ids.forEach(function (value, index, marked_ids) {
                if (marked_ids[index] == clicked_id) {
                    //console.log('marked-remove [' + data.x + ',' + data.y + ']');
                    (socket.request.session.level.marked).splice(index, 1);
                }
            });
            marked_ids.push(clicked_id);
            socket.request.session.level.marked = marked_ids;
            socket.request.session.save();
            cellMarkedCalculate(data);
        });
        socket.on('reset-session', function () {
            resetSession();
        });
        socket.on('marked-remove', function (data) {
            var marked_ids = (socket.request.session.level.marked);
            var clicked_id = data.x + '_' + data.y;
            marked_ids.forEach(function (value, index, marked_ids) {
                if (marked_ids[index] == clicked_id) {
                    //console.log('marked-remove [' + data.x + ',' + data.y + ']');
                    (socket.request.session.level.marked).splice(index, 1);
                }
            });
            socket.request.session.save();
            //console.log(JSON.stringify(socket.request.session.level.marked));
            cellMarkedCalculate(data);
        });
        socket.on('game-set-language', function (language) {
            if ((socket.request.session.language + '') == 'undefined') {
                socket.request.session.language = language;
                socket.request.session.save();
            }
            var fs = require('fs');
            fs.readFile('./public/language/' + (socket.request.session.language + '') + '.json', 'utf8', function (err, contents) {
                socket.request.session.language = language;
                socket.request.session.save();
                //console.log('====== LANGUAGE SETTED ======');
                //console.log(language);
                try {
                    user_language = JSON.parse(contents);
                    //console.log(user_language);
                    //console.log('=============================');
                    socket.emit('game-load-language', JSON.stringify(user_language))
                } catch (e) {

                }
            });
        });
        socket.on('puzzle-load', function (level_id) {
            if (typeof level_id != 'undefined') {
                socket.request.session.level.id = level_id;
                socket.request.session.save();
            } else {
                try {
                    if (typeof socket.request.session.level.id != 'undefined' && (socket.request.session.level.id).toString().length > 0) {
                        level_id = socket.request.session.level.id;
                    } else {
                        socket.emit('hash', 'menu');
                    }
                } catch (e) {
                    //console.log(e);
                }
            }
            //console.log('================================================================');
            //console.log('[CORE] - Loading PUZZLE with id ' + socket.request.session.level.id);
            //console.log(JSON.stringify(socket.request.session.level));
            if (typeof level_id != 'undefined' && (socket.request.session.level.id).toString().length > 0) {
                var fs = require('fs');
                var _mode = level_id.charAt(0);
                var _path;
                switch (_mode) {
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
                    case 't':
                        _path = '0x0';
                        break;
                }
                fs.readFile('./public/level/' + _path + '/' + level_id + '.txt', 'utf8', function (err, contents) {
                    let splitter = '\n';
                    if(isWin){
                        splitter = '\r\n';
                    }
                    var level_size = (contents.split(splitter)).length;
                    contents = contents.split(splitter);
                    var level_horizontal = [];
                    var correct_horizontal = [];
                    var correct_horizontal_line = [];
                    var incorrect_horizontal = [];
                    var incorrect_horizontal_line = [];
                    var final_correct_horizontal = [];
                    var final_incorrect_horizontal = [];

                    var level_vertical = [];
                    var correct_vertical = [];
                    var correct_vertical_line = [];
                    var incorrect_vertical = [];
                    var incorrect_vertical_line = [];
                    var final_correct_vertical = [];
                    var final_incorrect_vertical = [];

                    var horizontal_hint = [];
                    var vertical_hint = [];

                    var correct_line = [];
                    var incorrect_line = [];

                    var prev_line;

                    for (var y = 0; y < contents.length; y++) {
                        var line = [];
                        for (var x = 0; x < contents[y].length; x++) {
                            line.push(contents[x][y]);
                            if (contents[x][y] == 1) {
                                correct_horizontal.push(y + '_' + x);
                            } else {
                                incorrect_horizontal.push(y + '_' + x);
                            }
                        }
                        level_horizontal.push(line);
                    }
                    for (var y = 0; y < level_horizontal.length; y++) {
                        var result = [];
                        var count = 0;
                        for (var x = 0; x < level_horizontal[y].length; x++) {
                            if (level_horizontal[y][x] == 1) {
                                count++;
                            } else {
                                if (count != 0) {
                                    result.push(count);
                                    count = 0;
                                }
                            }
                            if (x == level_horizontal[y].length - 1 && count != 0) {
                                result.push(count);
                                count = 0;
                            }
                        }
                        if (result + '' == '') {
                            result = [0];
                        }
                        //console.log('horizontal hint.push: ' + result)
                        horizontal_hint.push(result);
                    }

                    // Calculating CORRECT and INCORRECT HORIZONTAL ARRAYS
                    {
                        prev_line = void 0;
                        for (var i = 0; i < correct_horizontal.length; i++) {
                            var _this = correct_horizontal[i].split('_');
                            if (typeof prev_line == 'undefined') {
                                prev_line = _this[0];
                            }
                            if (prev_line != _this[0]) {
                                final_correct_horizontal.push(correct_horizontal_line);
                                correct_horizontal_line = [_this[0] + '_' + _this[1]];
                                prev_line = _this[0];
                            } else {
                                correct_horizontal_line.push(_this[0] + '_' + _this[1]);
                            }
                            if (typeof correct_horizontal[i + 1] == 'undefined') {
                                prev_line = void 0;
                                final_correct_horizontal.push(correct_horizontal_line);
                                correct_horizontal_line = [];
                            }
                        }
                        for (var i = 0; i < incorrect_horizontal.length; i++) {
                            var _this = incorrect_horizontal[i].split('_');
                            if (typeof prev_line == 'undefined') {
                                prev_line = _this[0];
                            }
                            if (prev_line != _this[0]) {
                                final_incorrect_horizontal.push(incorrect_horizontal_line);
                                incorrect_horizontal_line = [_this[0] + '_' + _this[1]];
                                prev_line = _this[0];
                            } else {
                                incorrect_horizontal_line.push(_this[0] + '_' + _this[1]);
                            }
                            if (typeof incorrect_horizontal[i + 1] == 'undefined') {
                                prev_line = void 0;
                                final_incorrect_horizontal.push(incorrect_horizontal_line);
                                incorrect_horizontal_line = [];
                            }
                        }
                        //console.log('====== CORRECT HORIZONTAL ===========================================');
                        //console.log(final_correct_horizontal);
                        //console.log('====== INCORRECT HORIZONTAL =========================================');
                        //console.log(final_incorrect_horizontal);
                    }
                    //////////////////////////////////////////////////////

                    // Sorting array to became vertical
                    for (var x = 0; x < contents.length; x++) {
                        var line = [];
                        for (var y = 0; y < contents.length; y++) {
                            line.push(contents[x][y]);
                            if (contents[x][y] == 1) {
                                correct_vertical.push(y + '_' + x);
                            } else {
                                incorrect_vertical.push(y + '_' + x);
                            }
                        }
                        level_vertical.push(line);
                    }
                    for (var y = 0; y < level_vertical.length; y++) {
                        var result = [];
                        var count = 0;
                        for (var x = 0; x < level_vertical[y].length; x++) {
                            if (level_vertical[y][x] == 1) {
                                count++;
                            } else {
                                if (count != 0) {
                                    result.push(count);
                                    count = 0;
                                }
                            }
                            if (x == level_vertical[y].length - 1 && count != 0) {
                                result.push(count);
                                count = 0;
                            }
                        }
                        if (result + '' == '') {
                            result = [0];
                        }
                        //console.log('vertical hint.vertical: ' + result);
                        vertical_hint.push(result);
                    }

                    // Calculating CORRECT and INCORRECT VERTICAL ARRAYS
                    {
                        prev_line = void 0;
                        for (var i = 0; i < correct_vertical.length; i++) {
                            var _this = correct_vertical[i].split('_');
                            if (typeof prev_line == 'undefined') {
                                prev_line = _this[1];
                            }
                            if (prev_line != _this[1]) {
                                final_correct_vertical.push(correct_vertical_line);
                                correct_vertical_line = [_this[0] + '_' + _this[1]];
                                prev_line = _this[1];
                            } else {
                                correct_vertical_line.push(_this[0] + '_' + _this[1]);
                            }
                            if (typeof correct_vertical[i + 1] == 'undefined') {
                                prev_line = void 0;
                                final_correct_vertical.push(correct_vertical_line);
                                correct_vertical_line = [];
                            }
                        }
                        for (var i = 0; i < incorrect_vertical.length; i++) {
                            var _this = incorrect_vertical[i].split('_');
                            if (typeof prev_line == 'undefined') {
                                prev_line = _this[1];
                            }
                            if (prev_line != _this[1]) {
                                final_incorrect_vertical.push(incorrect_vertical_line);
                                incorrect_vertical_line = [_this[0] + '_' + _this[1]];
                                prev_line = _this[1];
                            } else {
                                incorrect_vertical_line.push(_this[0] + '_' + _this[1]);
                            }
                            if (typeof incorrect_vertical[i + 1] == 'undefined') {
                                prev_line = void 0;
                                final_incorrect_vertical.push(incorrect_vertical_line);
                                incorrect_vertical_line = [];
                            }
                        }
                        //console.log('====== CORRECT VERTICAL ===========================================');
                        //console.log(final_correct_vertical);
                        //console.log(JSON.stringify(correct_vertical));
                        //console.log('====== INCORRECT VERTICAL =========================================');
                        //console.log(final_incorrect_vertical);
                        //console.log(JSON.stringify(incorrect_vertical));
                    }
                    ////////////////////////////////////////////////////

                    //console.log('level_vertical: ' + level_vertical)

                    var data = {
                        id: level_id,
                        size: level_size,
                        horizontal_hint: horizontal_hint,
                        vertical_hint: vertical_hint
                    };

                    socket.request.session.level.correct = [correct_horizontal, correct_vertical, final_correct_horizontal, final_correct_vertical];
                    socket.request.session.level.incorrect = [incorrect_horizontal, incorrect_vertical, final_incorrect_horizontal, final_incorrect_vertical];
                    socket.request.session.save();

                    socket.emit('puzzle-draw', data);
                    if (_mode == 't') {
                        socket.emit('puzzle-tutorial');
                    }
                    cellMarkedCalculate({x: 0, y: 0});
                    /////////////////////////////////////////////////////////////////////////
                    // setTimeout(function(){
                    // socket.request.session.level.result = 0;
                    // socket.emit('level-complete', {
                    //     id: socket.request.session.level.id,
                    //     mode: (socket.request.session.level.id).charAt(0),
                    //     name: socket.request.session.name,
                    //     time: socket.request.session.level.time
                    // });
                    // }, 2000)
                    /////////////////////////////////////////////////////////////////////////

                    var hint = socket.request.session.level.hint;
                    if (parseInt(hint) > parseInt(0)) {
                        socket.emit('game-hint', false);
                    }
                });
            } else {
                socket.emit('hash', 'menu');
            }
        });
        socket.on('check-cell', function (data) {
            console.log('========CHECKING-CELL===========')
            var correct_total = (socket.request.session.level.correct[0]);
            if (typeof correct_total != 'undefined') {
                correct_total = correct_total.length;

                var clicked_ids = socket.request.session.level.clicked;
                var correct_ids = socket.request.session.level.correct[0];
                var marked_ids = (socket.request.session.level.marked);
                var ifClickedAlready = 0;
                var ifMarkedAlready = 0;
                var needremove = [];
                var clicked_id = data.x + '_' + data.y;
                clicked_ids.forEach(function (value, index, clicked_ids) {
                    if (clicked_ids[index] == clicked_id) {
                        ifClickedAlready++;
                    }
                });
                if (data.marker) {
                    ifClickedAlready++;
                }
                if (ifClickedAlready == 0) {
                    socket.request.session.level.clicked.push(clicked_id);
                    socket.request.session.save();
                    var ifLevelComplete = 0;
                    var ifClickedCorrect = 0;
                    correct_ids.forEach(function (value, index, correct_ids) {
                        if (clicked_id == correct_ids[index]) {
                            ifClickedCorrect = 1;
                        }
                    });
                    if (ifClickedCorrect == 1) {
                        if (typeof socket.request.session.level.combo == 'undefined') {
                            socket.request.session.level.combo = 0;
                            socket.request.session.level.combo++;
                        } else {
                            socket.request.session.level.combo++;
                        }
                        socket.request.session.save();
                        socket.emit('check-cell', {
                            result: 1,
                            x: data.x,
                            y: data.y,
                            combo: socket.request.session.level.combo
                        });
                        if (typeof socket.request.session.level != 'undefined') {
                            if (typeof socket.request.session.level.result != 'undefined') {
                                if (socket.request.session.level.result == correct_total - 1) {
                                    socket.request.session.level.result = 0;

                                    // CHEKING IF USER IS ALREADY HAS NAME IN SESSION AND DB, IF NOT THEN GENERATE IT
                                    if (typeof socket.request.session.name == 'undefined') {
                                        socket.request.session.name = (shortid.generate() + '').toString().toLowerCase();
                                    }
                                    // CHEKING IF USER IS ALREADY HAS NAME IN SESSION AND DB, IF NOT THEN GENERATE IT

                                    var level_complete_data = {
                                        id: socket.request.session.level.id,
                                        mode: (socket.request.session.level.id).charAt(0),
                                        name: socket.request.session.name,
                                        time: socket.request.session.level.time
                                    };

                                    // CHECKING IF PLAYER IS NOT OVERTIMED
                                    //console.log('====== CURRENT MIN ======');
                                    var current_min = (timeCodeUnpack(level_complete_data.time))[1];
                                    var current_hour = (timeCodeUnpack(level_complete_data.time))[0];
                                    var timelimit;
                                    switch (level_complete_data.mode) {
                                        case 'a':
                                            timelimit = 3;
                                            break;
                                        case 'b':
                                            timelimit = 15;
                                            break;
                                        case 'c':
                                            timelimit = 20;
                                            break;
                                    }
                                    console.log('====== LEVEL DATA ======');
                                    console.log(level_complete_data);
                                    console.log('========================');
                                    if (parseInt(current_hour) > parseInt(0)) {
                                        level_complete_data.overtime = true;
                                    }
                                    if (parseInt(current_min) > parseInt(timelimit)) {
                                        level_complete_data.overtime = true;
                                    }
                                    socket.emit('level-complete', level_complete_data);
                                    try {
                                        clearInterval((connected_users[socket.id]).interval.clock);
                                        clearInterval((connected_users[socket.id]).interval.iterator);
                                    } catch (e) {
                                        //console.log(e);
                                    }
                                } else {
                                    if (socket.request.session.level.result + '' == 'NaN') {
                                        socket.request.session.level.result = 1;
                                    } else {
                                        socket.request.session.level.result++;
                                    }
                                }
                            } else {
                                socket.request.session.level = {result: 1};
                            }
                        } else {
                            socket.request.session.level = {result: 1};
                        }
                    } else {
                        socket.request.session.level.combo = 0;
                        socket.request.session.save();
                        //socket.request.session.level.time = parseInt(socket.request.session.level.time) + parseInt(30);
                        socket.request.session.level.time = parseInt(socket.request.session.level.time) + parseInt(60);
                        socket.emit('check-cell', {
                            result: 0,
                            x: data.x,
                            y: data.y,
                            combo: socket.request.session.level.combo
                        });
                    }
                    //console.log('check-cell [' + data.y + ',' + data.x + '] [' + data.marker + '] ...');

                } else {
                    if (!data.marker) {
                        //console.log('check-cell [' + data.y + ',' + data.x + '] [' + data.marker + '] already clicked!');
                    }
                }
            }
            // setTimeout(function(){
            // var clicked_ids = socket.request.session.level.clicked;
            // var correct_ids = socket.request.session.level.correct;
            // var marked_ids = socket.request.session.level.marked;
            //
            // //console.log('=== CORRECT ===');
            // //console.log(JSON.stringify(correct_ids));
            // //console.log('=== CLICKED ===');
            // //console.log(JSON.stringify(clicked_ids));
            // //console.log('=== MARKED ====');
            // //console.log(JSON.stringify(marked_ids));
            // //console.log('===============');
            // },1000);
        });
        socket.on('disconnect', function () {
            //console.log(socket.id + ' is disconnected');
            if (typeof (connected_users[socket.id]) != 'undefined') {
                clearInterval((connected_users[socket.id]).interval.clock);
                clearInterval((connected_users[socket.id]).interval.iterator);
                delete connected_users[socket.id];
            }
        });
        socket.on('notification-add', function (notification) {
            notificationManager.add(notification);
        });
        socket.on('notification-remove', function (notification) {
            notificationManager.remove(notification);
            //console.log('================================================================');
            //console.log('[NOTIFICATION-MANAGER] - Notification removing');
        });
        socket.on('notification-remove-total', function (notification) {
            notificationManager.removeall(notification);
            //console.log('================================================================');
            //console.log('[NOTIFICATION-MANAGER] - Notification removing');
        });
    });
};

module.exports = IO;