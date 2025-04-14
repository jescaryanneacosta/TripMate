function exportItineraryAsPDF(itinerary) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("TripMate Itinerary", 20, 20);
  
    doc.setFontSize(12);
    let y = 40;
  
    itinerary.forEach((place, index) => {
      const item = document.querySelectorAll("#itinerary-list li")[index];
      const info = item.querySelector(".travel-info").textContent;
      doc.text(`${index + 1}. ${place.name}`, 20, y);
      if (info) {
        doc.text(`   ${info}`, 30, y + 6);
        y += 10;
      } else {
        y += 8;
      }
    });
  
    doc.save("TripMate_Itinerary.pdf");
  }
  