require("../node_modules/sweetalert/dist/sweetalert.css");
import '../node_modules/sweetalert/dist/sweetalert-dev.js';
/*
0:start game
1:questions
2:answerfinal?
3:cancelanswerfinal
4:results
alertm(0, numberquestion, totalnumber, questions[number]);
*/
exports.showalert = function(type, number, total, textquestion) {
    if (type == 0) {
        swal({
            title: "half_earth_game",
            text: "Answer questions with the map, good luck!",
            confirmButtonColor: "#0472b8",
            confirmButtonText: "Start, right now!",
            closeOnConfirm: false,
        }, function() {
            document.getElementById("questionbox").innerHTML = "<span>WHERE IS " + textquestion + " ?</span> <b onClick='skipquestion()'>Skip Question</b>";
            swal({
                title: "Question " + number + "/ " + total,
                text: "WHERE IS " + textquestion + " ?",
                confirmButtonColor: "#0472b8",
                confirmButtonText: "Go map",
            }, function(isConfirm) {
                if (isConfirm) {
                    $("#questionbox").css("display", "block");
                }
            });
        });
    }
};
