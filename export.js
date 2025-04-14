function exportItineraryAsPDF(itinerary) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("TripMate Itinerary", 20, 20);
  
    doc.setFontSize(12);
    itinerary.forEach((place, index) => {
      doc.text(`${index + 1}. ${place.name}`, 20, 40 + index * 10);
    });
  
    doc.save("TripMate_Itinerary.pdf");
  }
  