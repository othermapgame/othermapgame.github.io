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
/*Get all the information about the map, use cartodb and leaflet*/
$.getJSON('https://hectoruch.cartodb.com/api/v2/sql?q= SELECT * FROM map_game_nature', function(data) {
    $.each(data.rows, function(key, val) {
        questions.push(val.name);
        answer.push(val.name);
        idquestion.push(val.cartodb_id);
        idanswer.push(val.cartodb_id);
    });
});


contador = questions.length;
number = Math.floor((Math.random() * contador) + 0); /*get random number for questions*/
swal({
    title: "half_earth_game",
    /*introduction title*/
    text: "Answer questions with the map, good luck!",
    /*introduction description*/
    confirmButtonColor: "#0472b8",
    confirmButtonText: "Start, right now!",
    closeOnConfirm: false,
    /*when click button, not close, next function*/
}, function() {
    document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
    swal({
        title: "Question " + numberquestion,
        /*question, number*/
        text: "WHERE IS " + questions[number] + " ?",
        /*question, name*/
        confirmButtonColor: "#0472b8",
        confirmButtonText: "Go map",
    }, function(isConfirm) {
        if (isConfirm) {
            $("#questionbox").css("display", "block"); /*appear box question with the question, all the users need read two times :)*/
        }
    });
});

function main() {
    if (startmap == false) {
        /*fail = [];
        correct = [];
        scorenumber = 0;
        questions=[];
        idquestion=[];
        questions = answer;
        idquestion = idanswer;*/
        contador = questions.length;
        number = Math.floor((Math.random() * contador) + 0);
        swal({
            title: "half_earth_game",
            text: "Answer questions with the map, good luck!",
            confirmButtonColor: "#0472b8",
            confirmButtonText: "Start, right now!",
            closeOnConfirm: false,
        }, function() {
            document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
            swal({
                title: "Question " + numberquestion,
                text: "WHERE IS " + questions[number] + " ?",
                confirmButtonColor: "#0472b8",
                confirmButtonText: "Go map",
            }, function(isConfirm) {
                if (isConfirm) {
                    $("#questionbox").css("display", "block");
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
        zoom: 3
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
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 20; marker-fill: #0272b9; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
            layer.on('featureClick', function(e, latlng, pos, data) {
                $("#questionbox").css("display", "none");
                if (idquestion.length == 1) {
                  $("#finishbutn").attr("onClick", "main()");
                  $("#finishbutn").html("Start new game");
                    swal({
                        title: "You have",
                        text: "success: " + correct.length + " fails:" + fail.length + " ",
                        confirmButtonColor: "#0472b8",
                        confirmButtonText: "Show map results",
                        closeOnConfirm: true,
                        html: true,
                    }, function() {
                        /*scorenumber = 0;
                        questions = answer;
                        contador = questions.length;
                        number = Math.floor((Math.random() * contador) + 0);
                        document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
                        numberquestion = 1;
                        swal({
                            title: "Question",
                            text: "WHERE IS " + questions[number] + " ?",
                            confirmButtonColor: "#0472b8",
                            confirmButtonText: "Go map",
                        });*/
                        map.remove();
                        if (fail.length == 0 && correct.length == 0) {}
                        if (fail.length > 0 && correct.length > 0) {
                            showmapresultall();
                        }
                        if (fail.length > 0 && correct.length == 0) {
                            showmapresultfail();
                        }
                        if (fail.length == 0 && correct.length > 0) {
                            showmapresultcorrect();
                        }
                    });
                } else {
                    console.log(idquestion.length);
                    console.log(questions.length);
                    console.log(questions);
                    if (questions[number] == data.name) {
                        scorenumber++;
                        correct.push(idquestion[number]);
                        questions.splice(number, 1);
                        idquestion.splice(number, 1);
                        contador = questions.length;
                        number = Math.floor((Math.random() * contador) + 0);
                        document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
                        numberquestion++;
                        swal({
                            title: "Question " + numberquestion,
                            text: "WHERE IS " + questions[number] + " ?",
                            confirmButtonColor: "#0472b8",
                            confirmButtonText: "Go map",
                        }, function(isConfirm) {
                            if (isConfirm) {
                                $("#questionbox").css("display", "block");
                            }
                        });
                    } else {
                        fail.push(idquestion[number]);
                        questions.splice(number, 1);
                        idquestion.splice(number, 1);
                        contador = questions.length;
                        number = Math.floor((Math.random() * contador) + 0);
                        document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
                        numberquestion++;
                        swal({
                            title: "Question " + numberquestion,
                            text: "WHERE IS " + questions[number] + " ?",
                            confirmButtonColor: "#0472b8",
                            confirmButtonText: "Go map",
                        }, function(isConfirm) {
                            if (isConfirm) {
                                $("#questionbox").css("display", "block");
                            }
                        });
                    }
                }
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

function finishgame() {
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
                /*scorenumber = 0;
                questions = answer;
                contador = questions.length;
                number = Math.floor((Math.random() * contador) + 0);
                document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
                numberquestion = 1;
                swal({
                    title: "Question",
                    text: "WHERE IS " + questions[number] + " ?",
                    confirmButtonColor: "#0472b8",
                    confirmButtonText: "Go map",
                });*/
                map.remove();
                if (fail.length == 0 && correct.length == 0) {}
                if (fail.length > 0 && correct.length > 0) {
                    showmapresultall();
                }
                if (fail.length > 0 && correct.length == 0) {
                    showmapresultfail();
                }
                if (fail.length == 0 && correct.length > 0) {
                    showmapresultcorrect();
                }

            });
        } else {
            swal("Cancelled", "Your game is save", "error");
        }
    });
}

function showmapresultall() {
    $("body").append("<div id='map'></div>");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { /*http://maps.stamen.com/*/
        attribution: 'Stamen'
    }).addTo(map);
    cartodb.createLayer(map, {
            user_name: 'hectoruch',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + fail + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 20; marker-fill: red; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }, {
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + correct + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 20; marker-fill: green; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
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
                        window.open(data.moreinfo, '_blank');
                    }
                });
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

function showmapresultfail() {
    $("body").append("<div id='map'></div>");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3
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
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 20; marker-fill: red; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
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
                        window.open(data.moreinfo, '_blank');
                    }
                });
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}


function showmapresultcorrect() {
    $("body").append("<div id='map'></div>");
    map = new L.Map('map', {
        zoomControl: false,
        center: [0, 0],
        zoom: 3
    });
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { /*http://maps.stamen.com/*/
        attribution: 'Stamen'
    }).addTo(map);
    cartodb.createLayer(map, {
            user_name: 'hectoruch',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM map_game_nature WHERE cartodb_id IN (" + correct + ")",
                cartocss: '#map_game_nature{ marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 1.5; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 20; marker-fill: green; marker-allow-overlap: true; }',
                interactivity: 'name, the_geom, description'
            }]
        })
        .addTo(map)
        .done(function(layer) {
            layer.setInteraction(true);
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
                      alert(data.moreinfo);
                      //window.open(data.moreinfo, '_blank');
                    }
                });
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

function opendash() {
    $(".sideBar").css("top", "0px");
    $("#openmenu").html("Close menu");
    $("#openmenu").attr("onClick", "closedash()");
}

function closedash() {
    $(".sideBar").css("top", "-610px");
    $("#openmenu").html("Open menu");
    $("#openmenu").attr("onClick", "opendash()");
}
