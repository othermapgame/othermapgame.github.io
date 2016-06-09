function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("do not work")
    }
}
function showPosition(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log(lat+","+long);
}
