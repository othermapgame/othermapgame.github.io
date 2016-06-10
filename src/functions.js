import $ from 'jquery';

module.exports = function(){
  $("body").html('<div id="questionbox"></div><div id="openmenu" onclick="opendash();">Open menu</div><div class="sideBar"><div class="sideBar__section"><div class="sideBar__item" id="finishbutn" onclick="finishgame()">Finish game</div><div class="sideBar__item" onclick="dosql();">See results</div><div class="sideBar__item">About</div></div><div class="sideBar__section"><div class="sideBar__item">Change theme</div><div class="sideBar__item">Legal</div></div></div><div id="map"></div>');
}
