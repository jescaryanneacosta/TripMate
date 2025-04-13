let map;
let currentMarker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 14.5995, lng: 120.9842 }, // Default to Quezon City
        zoom: 13
    });
}

// Initialize Google Places Autocomplete
const input = document.getElementById("search-box");
const autocomplete = new google.maps.places.Autocomplete(input);
autocomplete.bindTo('bounds', map);

// Handle Place selection
autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
        alert("No details available for this place.");
        return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(15);

    // Create a marker
    if (currentMarker) {
        currentMarker.setMap(null);
    }
    currentMarker = new google.maps.Marker({
        position: place.geometry.location,
        map: map
    });

    // Display place details in search results
    const resultItem = document.createElement('li');
    resultItem.textContent = place.name;
    resultItem.addEventListener('click', function () {
        showModal(place);
    });

    document.getElementById("search-results").appendChild(resultItem);
});

// Show confirmation modal to add place to itinerary
function showModal(place) {
    document.getElementById("modal-title").textContent = `Add "${place.name}" to your itinerary?`;
    document.getElementById("modal-message").textContent = "Click yes to add it.";
    document.getElementById("confirmation-modal").style.display = "flex"; // Show the modal

    document.getElementById("confirm-button").onclick = function () {
        addToItinerary(place);
        closeModal();
    };

    document.getElementById("cancel-button").onclick = closeModal;
}

// Add selected place to itinerary list
function addToItinerary(place) {
    const itineraryList = document.getElementById("itinerary-list");
    const listItem = document.createElement("li");
    listItem.textContent = place.name;
    itineraryList.appendChild(listItem);
}

// Close the modal
function closeModal() {
    document.getElementById("confirmation-modal").style.display = "none";
}

// Export itinerary as JSON or PDF (stub for now)
function exportItinerary() {
    const itineraryItems = [];
    const items = document.getElementById("itinerary-list").children;
    for (let i = 0; i < items.length; i++) {
        itineraryItems.push(items[i].textContent);
    }
    console.log(itineraryItems); // Export logic goes here
}
