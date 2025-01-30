const coordinates=listing.geometry.coordinates;
const map = L.map('map').setView(coordinates, 13); 

    // Add OpenStreetMap tile layer to the map
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // add the Atlas tile layer to the map
    L.tileLayer('https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png').addTo(map);

    // Define the custom SVG icon
    const customIcon = L.divIcon({
      className: 'custom-icon',
      html: `<i class="fa-solid fa-person-walking-luggage" style="color: #fe424d;"></i>`,
      iconSize: [0, 0], 
      iconAnchor: [25, 25],  
    });

    // Add the marker with the custom SVG icon to the map
    const marker=L.marker(coordinates, { icon: customIcon }).addTo(map);

    const circleMarker = L.circleMarker(coordinates, {
      color: '#fe424d',
      fillColor: '#fe424d',
      fillOpacity: 0.5,
      radius: 100
    }).addTo(map);

    marker.bindPopup(`<h1> ${listing.location} </h1> Exact location will be provided after booking`).openPopup();
