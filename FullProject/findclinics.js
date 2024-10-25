// Initialize HERE platform
const platform = new H.service.Platform({
    apikey: '7BDY-cRK-dcNrK58gKoJaayDW-1QNMY935ip6EriM3o'  // Replace with your HERE Maps API key
});

const defaultLayers = platform.createDefaultLayers();

// Initialize the map
const map = new H.Map(
    document.getElementById('map'),
    defaultLayers.vector.normal.map,
    {
        zoom: 14,
        center: { lat: 0, lng: 0 }  // Default center, updated after getting location
    }
);


const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Custom red icon for the user's location
const userIcon = new H.map.Icon(
    '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="red" /></svg>',
    { size: { w: 24, h: 24 } }
);


// Function to find nearby vet clinics and add "Save as Favorite" option
function findVetClinics(location) {
    const service = platform.getSearchService();

    service.discover({
        at: `${location.lat},${location.lng}`,
        q: 'vet clinic'
    }, (result) => {
        result.items.forEach(item => {
            const clinicDetails = `
                <b>${item.title}</b><br>
                ${item.vicinity}<br>
                <button onclick="saveFavorite('${item.id}', '${item.title}', '${item.position.lat}', '${item.position.lng}')">Save as Favorite</button>
            `;

            const marker = new H.map.Marker(item.position);
            marker.setData(clinicDetails);
            marker.addEventListener('tap', event => {
                const bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
                    content: event.target.getData()
                });
                ui.addBubble(bubble);
            });
            map.addObject(marker);
        });
    }, (error) => {
        console.error('Error fetching vet clinics:', error);
        alert('Could not fetch vet clinics. Please try again later.');
    });
}

// Function to save a clinic as a favorite
function saveFavorite(id, title, lat, lng) {
    const clinic = { id, title, lat, lng };

    // Save clinic as favorite, replacing any existing favorite
    localStorage.setItem('favorite', JSON.stringify(clinic));
    alert(`${title} saved as your favorite clinic!`);
}


// Function to load and display saved favorites
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    favorites.forEach(clinic => {
        const marker = new H.map.Marker({ lat: clinic.lat, lng: clinic.lng });
        marker.setData(`<b>${clinic.title}</b><br>Saved as Favorite`);
        marker.addEventListener('tap', event => {
            const bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
                content: event.target.getData()
            });
            ui.addBubble(bubble);
        });
        map.addObject(marker);
    });
}

// Call this on page load to show saved favorites on the map
displayFavorites();


// Get user’s location and find clinics nearby
function locateUserAndFindClinics() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Center the map on the user's location
            map.setCenter(userLocation);

            // Add a red marker for the user's location
            const userMarker = new H.map.Marker(userLocation, { icon: userIcon });
            map.addObject(userMarker);

            // Find nearby vet clinics
            findVetClinics(userLocation);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Start the process
locateUserAndFindClinics();
