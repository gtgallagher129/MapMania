const locations = [
    { name: "Yellowstone National Park", lat: 44.427963, lng: -110.588455 },
    { name: "Zion National Park", lat: 37.298202, lng: -113.026300 },
    { name: "Torres del Paine National Park", lat: -51.259167, lng: -72.345000 },
    { name: "Kruger National Park", lat: -24.776108, lng: 31.486630 },
    { name: "Banff National Park", lat: 51.175100, lng: -115.571000 },
    { name: "Fiordland National Park", lat: -45.416668, lng: 167.716667 },
    { name: "Plitvice Lakes National Park", lat: 44.865300, lng: 15.583400 },
    { name: "Vatnajökull National Park", lat: 64.471204, lng: -16.185447 },
    { name: "Galápagos National Park", lat: -0.848037, lng: -91.142578 },
    { name: "Fuji-Hakone-Izu National Park", lat: 35.400000, lng: 138.983333 },
    { name: "Serengeti National Park", lat: -2.154375, lng: 34.685177 },
    { name: "Chitwan National Park", lat: 27.555091, lng: 84.469220 },
    { name: "Kakadu National Park", lat: -12.682247, lng: 132.461838 }
];

let currentLocation = null;
let map;
let marker;
let guesses = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 3,
    });

    const randomIndex = Math.floor(Math.random() * locations.length);
    currentLocation = locations[randomIndex];
    const loc1 = new google.maps.LatLng(12.432, 43.234); 

    map.addListener('click', function(e) {
        const clickLatLng = e.latLng;

        // Check if the location is within the map bounds
        const isWithinBounds = map.getBounds().contains(loc1);

        // Write the results of bounds
        console.log("Location is within bounds: " + isWithinBounds);
        console.log("Current Zoom Level: " + map.getZoom());

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            currentLocationLatLng(), clickLatLng
        );

        const direction = getDirection(clickLatLng, currentLocationLatLng());
        const distanceHint = getDistanceHint(distance);

        guesses++;

        if (distance < 1000000) { 
            showLocationInfo();
            updateHint("Congratulations! You found the national park in " + guesses + " guesses.");
        } else {
            updateHint("You're not there yet. Keep guessing. " + direction + " and " + distanceHint);
            document.getElementById("guesses").textContent = guesses;
        }
    });
}

function updateHint(hint) {
    document.getElementById("hint").textContent = hint;
}

function currentLocationLatLng() {
    return new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
}

function getDirection(from, to) {
    const latDiff = to.lat() - from.lat();
    const lngDiff = to.lng() - from.lng();

    let direction = "";

    if (latDiff > 0) {
        direction += "North";
    } else if (latDiff < 0) {
        direction += "South";
    }

    if (lngDiff > 0) {
        if (direction) direction += " and ";
        direction += "East";
    } else if (lngDiff < 0) {
        if (direction) direction += " and ";
        direction += "West";
    }

    return direction;
}

function getDistanceHint(distance) {
    if (distance < 2000000) {
        return "You're very close!";
    } else if (distance < 4000000) {
        return "You're getting closer!";
    } else if (distance < 6000000) {
        return "You're getting warm.";
    } else if (distance < 10000000) {
        return "You're cold.";
    } else {
        return "You're very far away.";
    }
}

function showLocationInfo() {
    const locationLatLng = currentLocationLatLng();
    marker = new google.maps.Marker({
        position: locationLatLng,
        map: map,
        title: currentLocation.name
    });


    const service = new google.maps.places.PlacesService(map);
    service.textSearch({
        location: locationLatLng,
        radius: 1000,
        query: currentLocation.name
}, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
            const place = results[0];
            document.getElementById("locationName").textContent = "It's " + place.name + "!";
            if (place.photos && place.photos.length > 0) {
                const photo = place.photos[0];
                const imageUrl = photo.getUrl({ maxWidth: 400, maxHeight: 300 });
                document.getElementById("locationImage").src = imageUrl;
            }
        }
    });
}