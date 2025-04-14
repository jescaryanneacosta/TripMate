let map;
let itinerary = [];

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
  ];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.676, lng: 121.0437 }, // Quezon City
    zoom: 13,
  });
  
  if (document.body.classList.contains("dark")) {
        map.setOptions({ styles: darkMapStyle });
    }
  

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

  enableDragAndDrop();
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
    const list = document.getElementById("itinerary-list");
  
    const li = document.createElement("li");
    li.setAttribute("draggable", true);
    li.innerHTML = `
      <div>
        <strong>${place.name}</strong>
        <div class="travel-info"></div>
      </div>
      <button>&times;</button>
    `;
  
    li.querySelector("button").onclick = () => {
      li.remove();
      itinerary = itinerary.filter(p => p.place_id !== place.place_id);
    };
  
    list.appendChild(li);
    itinerary.push(place);
  
    // Calculate and show travel time/distance if there is a previous place
    if (itinerary.length > 1) {
      const origin = itinerary[itinerary.length - 2].geometry.location;
      const destination = place.geometry.location;
      const infoDiv = li.querySelector(".travel-info");
  
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK') {
            const result = response.rows[0].elements[0];
            infoDiv.textContent = `${result.distance.text} – ${result.duration.text}`;
          } else {
            infoDiv.textContent = `Distance info unavailable`;
          }
        }
      );
    }
  }
  

document.getElementById("export-btn").addEventListener("click", () => {
  exportItineraryAsPDF(itinerary);
});

document.getElementById("theme-toggle").addEventListener("change", function () {
    const isDark = document.body.classList.toggle("dark");
    if (map) {
      map.setOptions({ styles: isDark ? darkMapStyle : null });
    }
  });
  

  function enableDragAndDrop() {
    const list = document.getElementById("itinerary-list");
  
    let dragged;
  
    list.addEventListener("dragstart", (e) => {
      dragged = e.target;
      e.target.style.opacity = 0.5;
    });
  
    list.addEventListener("dragend", (e) => {
      e.target.style.opacity = "";
      updateItineraryOrder();
    });
  
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
  
    list.addEventListener("drop", (e) => {
      e.preventDefault();
      if (e.target.tagName === "LI" && e.target !== dragged) {
        list.insertBefore(dragged, e.target.nextSibling);
      }
    });
  }

  function updateItineraryOrder() {
    const items = Array.from(document.querySelectorAll("#itinerary-list li"));
    const newOrder = [];
  
    items.forEach((li) => {
      const placeName = li.querySelector("strong").textContent;
      const place = itinerary.find(p => p.name === placeName);
      newOrder.push(place);
    });
  
    itinerary = newOrder;
  
    // Recalculate travel times
    items.forEach((li, i) => {
      const infoDiv = li.querySelector(".travel-info");
      infoDiv.textContent = "";
  
      if (i > 0) {
        const origin = itinerary[i - 1].geometry.location;
        const destination = itinerary[i].geometry.location;
  
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
          },
          (response, status) => {
            if (status === 'OK') {
              const result = response.rows[0].elements[0];
              infoDiv.textContent = `${result.distance.text} – ${result.duration.text}`;
            } else {
              infoDiv.textContent = `Distance info unavailable`;
            }
          }
        );
      }
    });
  }
  
  
