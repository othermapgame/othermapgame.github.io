var questions = []; /*array questions (name)*/
var answer = []; /*copy of array questions*/
var correct = []; /*array questions good answered*/
var fail = []; /*array question bad answered*/
var number = 0; /*random number for questions, always differente*/
var scorenumber = 0; /*quantity of good answers*/
var numberquestion = 1; /*order questions*/
var contador = /*many questions are complete*/

    /*Get all the information about the map, use cartodb and leaflet*/
    $.getJSON('https://hectoruch.cartodb.com/api/v2/sql?q= SELECT * FROM map_game_nature', function(data) {
        $.each(data.rows, function(key, val) {
            questions.push(val.name);
            answer.push(val.name);
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
    var map = new L.Map('map', {
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
                if (questions.length == 1) {
                    swal({
                        title: "Your score is",
                        text: scorenumber,
                        confirmButtonColor: "#0472b8",
                        confirmButtonText: "Play again",
                        closeOnConfirm: false,
                    }, function() {
                        scorenumber = 0;
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
                        });
                    });
                } else {
                    if (questions[number] == data.name) {
                        scorenumber++;
                        questions.splice(number, 1);
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
                        scorenumber--;
                        swal({
                            title: "Fail :(",
                            text: "do not worry, go next!",
                            type: "error",
                            confirmButtonColor: "#0472b8",
                            confirmButtonText: "Next question",
                            closeOnConfirm: false,
                        }, function() {
                            questions.splice(number, 1);
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
                        });
                    }
                }
            });
        }).on('error', function() {
            cartodb.log.log("some error occurred");
        });
}

$("#openmenubutn").click(function() {
    $("#menu").slideToggle("slow", function() {});
});

$("#finishbutn").click(function() {
    $("#questionbox").css("display", "none");
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
            swal({
                title: "Your score is",
                text: scorenumber,
                confirmButtonColor: "#0472b8",
                confirmButtonText: "Play again",
                closeOnConfirm: false,
            }, function() {
                scorenumber = 0;
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
                });
            });
        } else {
            swal("Cancelled", "Your game is save", "error");
        }
    });
});

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
