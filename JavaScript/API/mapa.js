
async function initMap() {
    const uac = { lat: 37.74634, lng: -25.66380 };
    let map = new google.maps.Map(
        document.getElementById("googlemap"), {zoom: 15, center: uac});
    let marker = new google.maps.Marker({position: uac, map: map});
}

(function loadGoogleMapsAPI() {

    if (typeof CONFIG === 'undefined' || !CONFIG.GOOGLE_MAPS_API_KEY) {
        console.error("Google Maps API key não foi encontrada no config.js");
        return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
})();