
async function initMap() {
    const uac = { lat: 37.74634, lng: -25.66380 };
    let map = new google.maps.Map(
        document.getElementById("googlemap"), {zoom: 15, center: uac});
    let marker = new google.maps.Marker({position: uac, map: map});

    const inputLocal = document.getElementById('event-local');
    if (inputLocal) {
        // Inicializa o Autocomplete no input
        const autocomplete = new google.maps.places.Autocomplete(inputLocal, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'pt' }
        });

        // Quando o utilizador seleciona um local
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                document.getElementById('event-lat').value = place.geometry.location.lat();
                document.getElementById('event-lng').value = place.geometry.location.lng();
            } else {
                console.warn("Utilizador escreveu manualmente sem selecionar da lista.");
                return;
            }

        });
    }
}

(function loadGoogleMapsAPI() {

    if (typeof CONFIG === 'undefined' || !CONFIG.GOOGLE_MAPS_API_KEY) {
        console.error("Google Maps API key não foi encontrada no config.js");
        return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
})();


