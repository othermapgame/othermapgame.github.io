var questions = [];
var answer = [];
$.getJSON('https://hectoruch.cartodb.com/api/v2/sql?q= SELECT * FROM map_game_nature', function(data) {
    $.each(data.rows, function(key, val) {
        questions.push(val.name);
        answer.push(val.name);
    });
});
var number = 0;
var scorenumber = 0;
var numbers = [number];
var numberquestion = 1;
var contador = questions.length;
number = Math.floor((Math.random() * contador) + 0);
swal({
    title: "half_earth_game",
    text: "Answer questions with the map, good luck!",
    confirmButtonColor: "#f55959",
    confirmButtonText: "Start, right now!",
    closeOnConfirm: false,
}, function() {
    document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
    swal({
        title: "Question " + numberquestion,
        text: "WHERE IS " + questions[number] + " ?",
        confirmButtonColor: "#f55959",
        confirmButtonText: "Go map",
    }, function(isConfirm) {
        if (isConfirm) {
            $("#questionbox").css("display", "block");
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
                        confirmButtonColor: "#f55959",
                        confirmButtonText: "Play again",
                        closeOnConfirm: false,
                    }, function() {
                        scorenumber = 0;
                        document.getElementById("scorenumber").innerHTML = scorenumber + " | ";
                        questions = answer;
                        contador = questions.length;
                        number = Math.floor((Math.random() * contador) + 0);
                        document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
                        numberquestion = 1;
                        swal({
                            title: "Question",
                            text: "WHERE IS " + questions[number] + " ?",
                            confirmButtonColor: "#f55959",
                            confirmButtonText: "Go map",
                        });
                    });
                } else {
                    if (questions[number] == data.name) {
                        scorenumber++;
                        document.getElementById("scorenumber").innerHTML = scorenumber + " ";
                        swal({
                            title: "Great :)",
                            text: data.description,
                            type: "success",
                            confirmButtonColor: "#f55959",
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
                                confirmButtonColor: "#f55959",
                                confirmButtonText: "Go map",
                            }, function(isConfirm) {
                                if (isConfirm) {
                                    $("#questionbox").css("display", "block");
                                }
                            });
                        });
                    } else {
                        scorenumber--;
                        document.getElementById("scorenumber").innerHTML = scorenumber + " ";
                        swal({
                            title: "Fail :(",
                            text: "do not worry, go next!",
                            type: "error",
                            confirmButtonColor: "#f55959",
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
                                confirmButtonColor: "#f55959",
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
    $("#scorenav").css("display", "none");
    $("#menu").slideToggle("slow", function() {});
});

$("#finishbutn").click(function() {
    $("#questionbox").css("display", "none");
    swal({
        title: "Your score is",
        text: scorenumber /*+'<br><div class="custom-tweet-button"><a href="https://twitter.com/intent/tweet?url=http://othermapgame.github.io/&amp;text=I play MapGame and I get '+scorenumber+' points" target="_blank" alt="Tweet this pen"><i class="btn-icon"></i><span class="btn-text">Tweet</span></a></div>'*/ ,
        confirmButtonColor: "#f55959",
        html: true,
        confirmButtonText: "Play again",
        closeOnConfirm: false,
    }, function() {
        scorenumber = 0;
        document.getElementById("scorenumber").innerHTML = scorenumber + " | ";
        questions = answer;
        contador = questions.length;
        number = Math.floor((Math.random() * contador) + 0);
        document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + questions[number] + " ?</span>";
        numberquestion = 1;
        swal({
            title: "Question",
            text: "WHERE IS " + questions[number] + " ?",
            confirmButtonColor: "#f55959",
            confirmButtonText: "Go map",
        }, function(isConfirm) {
            if (isConfirm) {
                $("#questionbox").css("display", "block");
            }
        });
    });
});
