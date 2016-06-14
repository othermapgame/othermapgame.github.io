import 'babel-polyfill';
import $ from 'jquery';
import '../node_modules/sweetalert/dist/sweetalert-dev.js';
require("../style/normalize.css");
require("../style/style.css");
require("../node_modules/sweetalert/dist/sweetalert.css");

var alertm = require('./message').showalert;
alertm();

var draw = require('./functions');
draw();

var lat = 0;
var long = 0;
var questions = []; /*array questions (name)*/
var answer = []; /*copy of array questions*/
var idquestion = [];
var idanswer = [];
var correct = []; /*array questions good answered*/
var fail = []; /*array question bad answered*/
var number = 0; /*random number for questions, always differente*/
var scorenumber = 0; /*quantity of good answers*/
var numberquestion = 1; /*order questions*/
var contador = 0; /*many questions are complete*/
var startmap = false;
var map = "";
var totalnumber = 0;

window.addCursorInteraction = function() {
    var hovers = [];
    layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
        hovers[layer] = 1;
        if (_.any(hovers)) {
            $('#map').css('cursor', 'pointer');
        }
    });
    layer.bind('featureOut', function(m, layer) {
        hovers[layer] = 0;
        if (!_.any(hovers)) {
            $('#map').css('cursor', 'auto');
        }
    });
}

window.opendash = function() {
    $(".sideBar").css("top", "0px");
    $("#openmenu").html("Close menu");
    $("#openmenu").attr("onClick", "closedash()");
}

window.closedash = function() {
    $(".sideBar").css("top", "-610px");
    $("#openmenu").html("Open menu");
    $("#openmenu").attr("onClick", "opendash()");
}

window.getdata = function() {
    $.getJSON('https://hectoruch.cartodb.com/api/v2/sql?q= SELECT * FROM map_game_nature', function(data) {
        $.each(data.rows, function(key, val) {
            totalnumber = data.rows.length;
            questions.push(val.name);
            answer.push(val.name);
            idquestion.push(val.cartodb_id);
            idanswer.push(val.cartodb_id);
        });
    });
}

window.main = function() {
    $.post("https://hectoruch.cartodb.com/api/v2/sql?q=UPDATE map_game_nature SET isanswer = false WHERE isanswer = true &api_key=be1f15570e60388973be3cb08edb426e8df1dfbf");
    scorenumber = 1;
    getdata();
    if (startmap == false) {
        //alert(numberquestion);
        contador = questions.length;
        number = Math.floor((Math.random() * contador) + 0);
        swal({
            title: "half_earth_game",
            text: "Answer questions with the map, good luck!",
            confirmButtonColor: "#0472b8",
            confirmButtonText: "Start, right now!",
            closeOnConfirm: false,
        }, function() {
            document.getElementById("questionbox").innerHTML = "<span>( " + numberquestion + "/ " + totalnumber + " ) WHERE IS " + questions[number] + " ?</span> <b onClick='skipquestion()'>Skip Question</b>";
            swal({
                title: "Question " + numberquestion + "/ " + totalnumber,
                text: "WHERE IS " + questions[number] + " ?",
                showCancelButton: true,
                confirmButtonColor: "#0472b8",
                confirmButtonText: "Go map",
                cancelButtonText: "Skip question",
                closeOnConfirm: true,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    $("#questionbox").css("display", "block");
                } else {
                    skipquestion();
                }
            });
        });
    } else {
        map.remove();
    }
    startmap = true;
    $("#finishbutn").attr("onClick", "finishgame()");
    $("#finishbutn").html("Finish game");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3,
        maxZoom: 6,
        minZoom: 3
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { /*http://maps.stamen.com/*/
        attribution: 'Stamen'
    }).addTo(map);
    var popup = L.popup();
    //map.on('click', onMapClick);
    cartodb.createLayer(map, {
            user_name: 'hectoruch',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM map_game_nature",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 25; marker-fill: #0272b9; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
            var hovers = [];
            layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
                hovers[layer] = 1;
                if (_.any(hovers)) {
                    $('#map').css('cursor', 'pointer');
                }
            });
            layer.bind('featureOut', function(m, layer) {
                hovers[layer] = 0;
                if (!_.any(hovers)) {
                    $('#map').css('cursor', 'auto');
                }
            });
            layer.on('featureClick', function(e, latlng, pos, data) {
                $("#questionbox").css("display", "none");
                if (idquestion.length == 1) {
                    $("#finishbutn").attr("onClick", "main()");
                    $("#finishbutn").html("Start new game");
                    swal({
                        title: "You have",
                        text: "<span style='color:green;'>success: " + correct.length + "</span> <span style='color:red;'>fails:" + fail.length + "</span>",
                        confirmButtonColor: "#0472b8",
                        confirmButtonText: "Show map results",
                        closeOnConfirm: true,
                        html: true,
                    }, function() {
                        $.post("https://hectoruch.cartodb.com/api/v2/sql?q=INSERT INTO user_half_earth_game (the_geom, correctanswer, failanswer, points, lat, long) VALUES (ST_SetSRID(ST_Point(" + long + ", " + lat + "),4326), '" + correct + "', '" + fail + "', '" + scorenumber + "', '" + lat + "', '" + long + "')&api_key=be1f15570e60388973be3cb08edb426e8df1dfbf");
                        map.remove();
                        if (fail.length == 0 && correct.length == 0) {}
                        if (fail.length > 0 && correct.length > 0) {
                            numberquestion = 0;
                            showmapresultall();
                        }
                        if (fail.length > 0 && correct.length == 0) {
                            numberquestion = 0;
                            showmapresultfail();
                        }
                        if (fail.length == 0 && correct.length > 0) {
                            numberquestion = 0;
                            showmapresultcorrect();
                        }
                    });
                } else {
                    if (questions[number] == data.name) {
                        $.post("https://hectoruch.cartodb.com/api/v2/sql?q=UPDATE map_game_nature SET isanswer = true WHERE cartodb_id = " + idquestion[number] + " &api_key=be1f15570e60388973be3cb08edb426e8df1dfbf");
                        scorenumber++;
                        correct.push(idquestion[number]);
                        questions.splice(number, 1);
                        idquestion.splice(number, 1);
                        contador = questions.length;
                        number = Math.floor((Math.random() * contador) + 0);
                        numberquestion++;
                        document.getElementById("questionbox").innerHTML = "<span>( " + numberquestion + "/ " + totalnumber + " ) WHERE IS " + questions[number] + " ?</span> <b onClick='skipquestion()'>Skip Question</b>";
                        swal({
                            title: "Question " + numberquestion + "/ " + totalnumber,
                            text: "WHERE IS " + questions[number] + " ?",
                            confirmButtonColor: "#0472b8",
                            showCancelButton: true,
                            confirmButtonText: "Go map",
                            cancelButtonText: "Skip question",
                            closeOnConfirm: true,
                            closeOnCancel: false
                        }, function(isConfirm) {
                            if (isConfirm) {
                                $("#questionbox").css("display", "block");
                            } else {
                                skipquestion();
                            }
                        });
                    } else {
                        $.post("https://hectoruch.cartodb.com/api/v2/sql?q=UPDATE map_game_nature SET isanswer = true WHERE cartodb_id = " + idquestion[number] + " &api_key=be1f15570e60388973be3cb08edb426e8df1dfbf");
                        fail.push(idquestion[number]);
                        questions.splice(number, 1);
                        idquestion.splice(number, 1);
                        contador = questions.length;
                        number = Math.floor((Math.random() * contador) + 0);
                        numberquestion++;
                        document.getElementById("questionbox").innerHTML = "<span>( " + numberquestion + "/ " + totalnumber + " ) WHERE IS " + questions[number] + " ?</span> <b onClick='skipquestion()'>Skip Question</b>";

                        swal({
                            title: "Question " + numberquestion + "/ " + totalnumber,
                            text: "WHERE IS " + questions[number] + " ?",
                            confirmButtonColor: "#0472b8",
                            showCancelButton: true,
                            confirmButtonText: "Go map",
                            cancelButtonText: "Skip question",
                            closeOnConfirm: true,
                            closeOnCancel: false
                        }, function(isConfirm) {
                            if (isConfirm) {
                                $("#questionbox").css("display", "block");
                            } else {
                                skipquestion();
                            }
                        });
                    }
                }
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

window.finishgame = function() {
    swal({
        title: "Are you sure?",
        text: "You will lose all your progress",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes!",
        cancelButtonText: "No!",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(isConfirm) {
        if (isConfirm) {
            $("#questionbox").css("display", "none");
            $("#finishbutn").attr("onClick", "main()");
            $("#finishbutn").html("Start new game");
            swal({
                title: "You have",
                text: "<span style='color:green;'>success: " + correct.length + "</span> <span style='color:red;'>fails:" + fail.length + "</span>",
                confirmButtonColor: "#0472b8",
                confirmButtonText: "Show map results",
                closeOnConfirm: true,
                html: true,
            }, function() {
                map.remove();
                $.post("https://hectoruch.cartodb.com/api/v2/sql?q=INSERT INTO user_half_earth_game (the_geom, correctanswer, failanswer, points, lat, long) VALUES (ST_SetSRID(ST_Point(" + long + ", " + lat + "),4326), '" + correct + "', '" + fail + "', '" + scorenumber + "', '" + lat + "', '" + long + "')&api_key=be1f15570e60388973be3cb08edb426e8df1dfbf");
                if (fail.length == 0 && correct.length == 0) {
                    showmapresultfail();
                }
                if (fail.length > 0 && correct.length > 0) {
                    numberquestion = 0;
                    showmapresultall();
                }
                if (fail.length > 0 && correct.length == 0) {
                    numberquestion = 0;
                    showmapresultfail();
                }
                if (fail.length == 0 && correct.length > 0) {
                    numberquestion = 0;
                    showmapresultcorrect();
                }

            });
        } else {
            swal("Cancelled", "Your game is save", "error");
        }
    });
}

window.skipquestion = function() {
    if (idquestion.length == 1) {
        $("#finishbutn").attr("onClick", "main()");
        $("#finishbutn").html("Start new game");
        swal({
            title: "You have",
            text: "<span style='color:green;'>success: " + correct.length + "</span> <span style='color:red;'>fails:" + fail.length + "</span>",
            confirmButtonColor: "#0472b8",
            confirmButtonText: "Show map results",
            closeOnConfirm: true,
            html: true,
        }, function() {
            $.post("https://hectoruch.cartodb.com/api/v2/sql?q=INSERT INTO user_half_earth_game (the_geom, correctanswer, failanswer, points, lat, long) VALUES (ST_SetSRID(ST_Point(" + long + ", " + lat + "),4326), '" + correct + "', '" + fail + "', '" + scorenumber + "', '" + lat + "', '" + long + "')&api_key=be1f15570e60388973be3cb08edb426e8df1dfbf");
            map.remove();
            if (fail.length == 0 && correct.length == 0) {
              numberquestion = 0;
              showmapresultall();
            }
            if (fail.length > 0 && correct.length > 0) {
                numberquestion = 0;
                showmapresultall();
            }
            if (fail.length > 0 && correct.length == 0) {
                numberquestion = 0;
                showmapresultfail();
            }
            if (fail.length == 0 && correct.length > 0) {
                numberquestion = 0;
                showmapresultcorrect();
            }
        });
    } else {
        questions.splice(number, 1);
        idquestion.splice(number, 1);
        contador = questions.length;
        number = Math.floor((Math.random() * contador) + 0);
        $("#questionbox").css("display", "none");
        numberquestion++;
        document.getElementById("questionbox").innerHTML = "<span>( " + numberquestion + "/ " + totalnumber + " ) WHERE IS " + questions[number] + " ?</span> <b onClick='skipquestion()'>Skip Question</b>";

        swal({
            title: "Question " + numberquestion + "/ " + totalnumber,
            text: "WHERE IS " + questions[number] + " ?",
            confirmButtonColor: "#0472b8",
            showCancelButton: true,
            confirmButtonText: "Go map",
            cancelButtonText: "Skip question",
            closeOnConfirm: true,
            closeOnCancel: false
        }, function(isConfirm) {
            if (isConfirm) {
                $("#questionbox").css("display", "block");
            } else {
                skipquestion();
            }
        });
    }
}

window.showmapresultall = function() {
    $("body").append("<div id='map'></div>");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3,
        maxZoom: 6,
        minZoom: 3
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { /*http://maps.stamen.com/*/
        attribution: 'Stamen'
    }).addTo(map);
    cartodb.createLayer(map, {
            user_name: 'hectoruch',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + fail + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 25; marker-fill: red; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }, {
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + correct + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 25; marker-fill: green; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
            var hovers = [];
            layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
                hovers[layer] = 1;
                if (_.any(hovers)) {
                    $('#map').css('cursor', 'pointer');
                }
            });
            layer.bind('featureOut', function(m, layer) {
                hovers[layer] = 0;
                if (!_.any(hovers)) {
                    $('#map').css('cursor', 'auto');
                }
            });
            layer.on('featureClick', function(e, latlng, pos, data) {
                swal({
                    title: data.name,
                    text: data.description,
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Return map",
                    cancelButtonText: "Know more",
                    closeOnConfirm: true,
                    closeOnCancel: false
                }, function(isConfirm) {
                    if (isConfirm) {} else {
                        //alert(data.moreinfo);
                    }
                });
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

window.showmapresultfail = function() {
    $("body").append("<div id='map'></div>");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3,
        maxZoom: 6,
        minZoom: 3
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { /*http://maps.stamen.com/*/
        attribution: 'Stamen'
    }).addTo(map);
    var popup = L.popup();
    cartodb.createLayer(map, {
            user_name: 'hectoruch',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + fail + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 25; marker-fill: red; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
            var hovers = [];
            layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
                hovers[layer] = 1;
                if (_.any(hovers)) {
                    $('#map').css('cursor', 'pointer');
                }
            });
            layer.bind('featureOut', function(m, layer) {
                hovers[layer] = 0;
                if (!_.any(hovers)) {
                    $('#map').css('cursor', 'auto');
                }
            });
            layer.on('featureClick', function(e, latlng, pos, data) {
                swal({
                    title: data.name,
                    text: data.description,
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Return map",
                    cancelButtonText: "Know more",
                    closeOnConfirm: true,
                    closeOnCancel: false
                }, function(isConfirm) {
                    if (isConfirm) {} else {
                        //alert(data.moreinfo);
                    }
                });
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

window.showmapresultcorrect = function() {
    $("body").append("<div id='map'></div>");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3,
        maxZoom: 6,
        minZoom: 3
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { /*http://maps.stamen.com/*/
        attribution: 'Stamen'
    }).addTo(map);
    cartodb.createLayer(map, {
            user_name: 'hectoruch',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + correct + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 25; marker-fill: green; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
            var hovers = [];
            layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
                hovers[layer] = 1;
                if (_.any(hovers)) {
                    $('#map').css('cursor', 'pointer');
                }
            });
            layer.bind('featureOut', function(m, layer) {
                hovers[layer] = 0;
                if (!_.any(hovers)) {
                    $('#map').css('cursor', 'auto');
                }
            });
            layer.on('featureClick', function(e, latlng, pos, data) {
                swal({
                    title: data.name,
                    text: data.description,
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Return map",
                    cancelButtonText: "Know more",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function(isConfirm) {
                    if (isConfirm) {} else {
                        //alert(data.moreinfo);
                        //window.open(data.moreinfo, '_blank');
                    }
                });
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}


window.onload = main;
