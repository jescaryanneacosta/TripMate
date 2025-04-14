let map;
let itinerary = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.676, lng: 121.0437 }, // Quezon City
    zoom: 13,
  });

  const input = document.getElementById("search-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.panTo(place.geometry.location);
    map.setZoom(15);

    showModal(place);
  });
}

function showModal(place) {
  document.getElementById("modal-text").textContent = `Add "${place.name}" to your itinerary?`;
  document.getElementById("modal").classList.remove("hidden");

  document.getElementById("modal-confirm").onclick = () => {
    addToItinerary(place);
    closeModal();
  };

  document.getElementById("modal-cancel").onclick = closeModal;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function addToItinerary(place) {
  itinerary.push(place);

  const li = document.createElement("li");
  li.textContent = place.name;
  document.getElementById("itinerary-list").appendChild(li);
}

document.getElementById("export-btn").addEventListener("click", () => {
  exportItineraryAsPDF(itinerary);
});
