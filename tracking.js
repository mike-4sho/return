/* ==========================================================================
   Return It - Tracking Page JavaScript
   Interactive tracking page with map, timeline, and status management
   ========================================================================== */

// ==========================================================================
// Configuration & Sample Data
// ==========================================================================

const RETURN_DATA = {
    returnId: 'RT-4892',
    status: 'in-transit', // scheduled, assigned, in-transit, picked-up, returned
    pickupAddress: '2847 Oakwood Drive, Apt 4B, Austin, TX 78704',
    hubAddress: 'Return Hub, 1200 Commerce St, Austin, TX 78701',
    pickupDate: 'Dec 2, 2024',
    estimatedCompletion: 'Dec 4, 17:00',
    totalItems: '2x',
    driver: {
        name: 'Marcus Johnson',
        phone: '+15125550147',
        initials: 'MJ'
    },
    coordinates: {
        pickup: [30.2442, -97.7528],
        hub: [30.2672, -97.7431],
        driver: [30.2550, -97.7480]
    },
    timeline: [
        {
            time: '10:58 AM',
            title: 'The driver is on the way',
            subtitle: 'Marcus is heading to your location',
            status: 'active'
        },
        {
            time: '09:15 AM',
            title: 'Driver assigned to pickup',
            subtitle: 'Marcus Johnson accepted your pickup',
            status: 'completed'
        },
        {
            time: 'Nov 29, 2:34 PM',
            title: 'Pickup scheduled',
            subtitle: 'Return request confirmed',
            status: 'completed'
        }
    ]
};

// Status configurations
const STATUS_CONFIG = {
    'scheduled': {
        badge: 'Scheduled',
        badgeClass: 'scheduled',
        pickupBadge: 'Pending',
        pickupBadgeClass: 'scheduled',
        showDriver: false,
        showDriverOnMap: false,
        progress: 10,
        eta: '--',
        distance: '--'
    },
    'assigned': {
        badge: 'Assigned',
        badgeClass: 'assigned',
        pickupBadge: 'Driver Assigned',
        pickupBadgeClass: 'assigned',
        showDriver: true,
        showDriverOnMap: true,
        progress: 35,
        eta: '~15 min',
        distance: '2.8 mi away'
    },
    'in-transit': {
        badge: 'In Transit',
        badgeClass: 'in-transit',
        pickupBadge: 'On Going',
        pickupBadgeClass: 'ongoing',
        showDriver: true,
        showDriverOnMap: true,
        progress: 65,
        eta: '~8 min',
        distance: '1.2 mi away'
    },
    'picked-up': {
        badge: 'Picked Up',
        badgeClass: 'picked-up',
        pickupBadge: 'Complete',
        pickupBadgeClass: 'picked-up',
        showDriver: true,
        showDriverOnMap: false,
        progress: 85,
        eta: 'Picked up',
        distance: 'En route to hub'
    },
    'returned': {
        badge: 'Returned',
        badgeClass: 'returned',
        pickupBadge: 'Complete',
        pickupBadgeClass: 'returned',
        showDriver: false,
        showDriverOnMap: false,
        progress: 100,
        eta: 'Complete',
        distance: 'Delivered to hub'
    }
};

// Timeline data for each status
const TIMELINE_BY_STATUS = {
    'scheduled': [
        {
            time: 'Nov 29, 2:34 PM',
            title: 'Pickup scheduled',
            subtitle: 'Return request confirmed',
            status: 'active'
        }
    ],
    'assigned': [
        {
            time: '09:15 AM',
            title: 'Driver assigned to pickup',
            subtitle: 'Marcus Johnson accepted your pickup',
            status: 'active'
        },
        {
            time: 'Nov 29, 2:34 PM',
            title: 'Pickup scheduled',
            subtitle: 'Return request confirmed',
            status: 'completed'
        }
    ],
    'in-transit': [
        {
            time: '10:58 AM',
            title: 'The driver is on the way',
            subtitle: 'Marcus is heading to your location',
            status: 'active'
        },
        {
            time: '09:15 AM',
            title: 'Driver assigned to pickup',
            subtitle: 'Marcus Johnson accepted your pickup',
            status: 'completed'
        },
        {
            time: 'Nov 29, 2:34 PM',
            title: 'Pickup scheduled',
            subtitle: 'Return request confirmed',
            status: 'completed'
        }
    ],
    'picked-up': [
        {
            time: '11:42 AM',
            title: 'Package picked up',
            subtitle: 'Your return is with the driver',
            status: 'active'
        },
        {
            time: '10:58 AM',
            title: 'The driver is on the way',
            subtitle: 'Marcus is heading to your location',
            status: 'completed'
        },
        {
            time: '09:15 AM',
            title: 'Driver assigned to pickup',
            subtitle: 'Marcus Johnson accepted your pickup',
            status: 'completed'
        },
        {
            time: 'Nov 29, 2:34 PM',
            title: 'Pickup scheduled',
            subtitle: 'Return request confirmed',
            status: 'completed'
        }
    ],
    'returned': [
        {
            time: '4:23 PM',
            title: 'Return received by brand',
            subtitle: 'Your return has been processed',
            status: 'active'
        },
        {
            time: '11:42 AM',
            title: 'Package picked up',
            subtitle: 'Your return is with the driver',
            status: 'completed'
        },
        {
            time: '10:58 AM',
            title: 'The driver is on the way',
            subtitle: 'Marcus is heading to your location',
            status: 'completed'
        },
        {
            time: '09:15 AM',
            title: 'Driver assigned to pickup',
            subtitle: 'Marcus Johnson accepted your pickup',
            status: 'completed'
        },
        {
            time: 'Nov 29, 2:34 PM',
            title: 'Pickup scheduled',
            subtitle: 'Return request confirmed',
            status: 'completed'
        }
    ]
};

// ==========================================================================
// Global Variables
// ==========================================================================

let map = null;
let pickupMarker = null;
let hubMarker = null;
let driverMarker = null;
let routeLine = null;
let currentStatus = RETURN_DATA.status;

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    initializeUI();
    updateUIForStatus(currentStatus);

    // Simulate driver movement (demo purposes)
    if (currentStatus === 'in-transit') {
        simulateDriverMovement();
    }
});

// ==========================================================================
// Map Functions
// ==========================================================================

function initializeMap() {
    // Create map centered between pickup and hub
    const centerLat = (RETURN_DATA.coordinates.pickup[0] + RETURN_DATA.coordinates.hub[0]) / 2;
    const centerLng = (RETURN_DATA.coordinates.pickup[1] + RETURN_DATA.coordinates.hub[1]) / 2;

    map = L.map('tracking-map', {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    // Create custom markers
    createMarkers();

    // Draw route
    drawRoute();

    // Fit map to show all markers
    fitMapToBounds();
}

function createMarkers() {
    // Pickup location marker
    const pickupIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-pickup">
                <svg class="marker-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });

    pickupMarker = L.marker(RETURN_DATA.coordinates.pickup, { icon: pickupIcon })
        .addTo(map)
        .bindPopup('<strong>Pickup Location</strong><br>' + RETURN_DATA.pickupAddress);

    // Hub location marker
    const hubIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-hub">
                <svg class="marker-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });

    hubMarker = L.marker(RETURN_DATA.coordinates.hub, { icon: hubIcon })
        .addTo(map)
        .bindPopup('<strong>Return Hub</strong><br>' + RETURN_DATA.hubAddress);

    // Driver marker (only shown during certain statuses)
    const driverIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-driver">
                <svg class="marker-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
    });

    driverMarker = L.marker(RETURN_DATA.coordinates.driver, { icon: driverIcon })
        .bindPopup('<strong>Driver</strong><br>' + RETURN_DATA.driver.name);
}

function drawRoute() {
    // Create a curved route line between pickup, driver, and hub
    const routePoints = [
        RETURN_DATA.coordinates.hub,
        RETURN_DATA.coordinates.driver,
        RETURN_DATA.coordinates.pickup
    ];

    // Add some intermediate points to make the route look more realistic
    const detailedRoute = createDetailedRoute(routePoints);

    routeLine = L.polyline(detailedRoute, {
        color: '#6366f1',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        dashArray: null
    }).addTo(map);
}

function createDetailedRoute(points) {
    // Create a more detailed route with bezier-like curves
    const detailed = [];

    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];

        // Add intermediate points
        for (let t = 0; t <= 1; t += 0.1) {
            const lat = start[0] + (end[0] - start[0]) * t;
            const lng = start[1] + (end[1] - start[1]) * t;
            // Add slight variation to simulate real roads
            const variation = Math.sin(t * Math.PI) * 0.002;
            detailed.push([lat + variation, lng]);
        }
    }

    return detailed;
}

function fitMapToBounds() {
    const bounds = L.latLngBounds([
        RETURN_DATA.coordinates.pickup,
        RETURN_DATA.coordinates.hub,
        RETURN_DATA.coordinates.driver
    ]);

    map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 14
    });
}

function updateDriverPosition(newPosition) {
    if (driverMarker) {
        driverMarker.setLatLng(newPosition);
    }
}

function showDriverMarker(show) {
    if (driverMarker) {
        if (show) {
            driverMarker.addTo(map);
        } else {
            driverMarker.remove();
        }
    }
}

// Simulate driver movement for demo
function simulateDriverMovement() {
    const pickup = RETURN_DATA.coordinates.pickup;
    const current = [...RETURN_DATA.coordinates.driver];
    const speed = 0.0001; // Movement speed

    const moveDriver = () => {
        // Move towards pickup
        const dLat = pickup[0] - current[0];
        const dLng = pickup[1] - current[1];
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distance > speed * 2) {
            current[0] += (dLat / distance) * speed;
            current[1] += (dLng / distance) * speed;
            updateDriverPosition(current);

            // Update ETA based on distance
            const remainingMiles = distance * 69; // Rough conversion to miles
            const eta = Math.ceil(remainingMiles * 8); // 8 min per mile estimate
            document.getElementById('driver-eta').textContent = `~${eta} min`;
            document.getElementById('driver-distance').textContent = `${remainingMiles.toFixed(1)} mi away`;

            // Update progress
            const totalDistance = Math.sqrt(
                Math.pow(pickup[0] - RETURN_DATA.coordinates.hub[0], 2) +
                Math.pow(pickup[1] - RETURN_DATA.coordinates.hub[1], 2)
            );
            const progress = Math.min(95, ((totalDistance - distance) / totalDistance) * 100 + 35);
            document.getElementById('progress-fill').style.width = `${progress}%`;

            setTimeout(moveDriver, 2000);
        }
    };

    setTimeout(moveDriver, 3000);
}

// ==========================================================================
// UI Functions
// ==========================================================================

function initializeUI() {
    // Populate initial data
    document.getElementById('return-id').textContent = RETURN_DATA.returnId;
    document.getElementById('pickup-date').textContent = RETURN_DATA.pickupDate;
    document.getElementById('estimated-completion').textContent = RETURN_DATA.estimatedCompletion;
    document.getElementById('total-items').textContent = RETURN_DATA.totalItems;
    document.getElementById('from-address').textContent = RETURN_DATA.pickupAddress;
    document.getElementById('to-address').textContent = RETURN_DATA.hubAddress;
    document.getElementById('driver-name').textContent = RETURN_DATA.driver.name;
    document.getElementById('driver-avatar').textContent = RETURN_DATA.driver.initials;
}

function updateUIForStatus(status) {
    const config = STATUS_CONFIG[status];
    if (!config) return;

    // Update main status badge
    const mainBadge = document.getElementById('main-status-badge');
    mainBadge.textContent = config.badge;
    mainBadge.className = `status-badge ${config.badgeClass}`;

    // Update pickup status badge
    const pickupBadge = document.getElementById('pickup-status-badge');
    pickupBadge.textContent = config.pickupBadge;
    pickupBadge.className = `status-badge ${config.pickupBadgeClass}`;

    // Show/hide driver card
    const driverCard = document.getElementById('driver-card');
    if (config.showDriver) {
        driverCard.classList.remove('hidden');
    } else {
        driverCard.classList.add('hidden');
    }

    // Show/hide driver on map
    showDriverMarker(config.showDriverOnMap);

    // Update map info card
    document.getElementById('driver-eta').textContent = config.eta;
    document.getElementById('driver-distance').textContent = config.distance;
    document.getElementById('progress-fill').style.width = `${config.progress}%`;

    // Update timeline
    renderTimeline(status);
}

function renderTimeline(status) {
    const timeline = document.getElementById('timeline');
    const events = TIMELINE_BY_STATUS[status] || [];

    timeline.innerHTML = events.map((event, index) => {
        const isLast = index === events.length - 1;
        const dotClass = event.status === 'active' ? 'active' : 'completed';
        const lineClass = event.status === 'completed' ? 'completed' : '';

        return `
            <div class="timeline-item">
                <div class="timeline-time">${event.time}</div>
                <div class="timeline-indicator">
                    <div class="timeline-dot ${dotClass}">
                        ${event.status === 'active' ? `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                        ` : `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        `}
                    </div>
                    ${!isLast ? `<div class="timeline-line ${lineClass}"></div>` : ''}
                </div>
                <div class="timeline-content">
                    <div class="timeline-title">${event.title}</div>
                    <div class="timeline-subtitle">${event.subtitle}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================================================
// Interactive Functions
// ==========================================================================

function toggleShipmentCard() {
    const card = document.getElementById('shipment-card');
    card.classList.toggle('expanded');
}

function copyReturnId() {
    const returnId = document.getElementById('return-id').textContent;
    const copyBtn = document.querySelector('.copy-btn');

    navigator.clipboard.writeText(returnId).then(() => {
        // Show copied feedback
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        `;

        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
            `;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ==========================================================================
// Demo: Status Switcher (for testing different states)
// ==========================================================================

// Expose function to change status from console for demo purposes
window.setReturnStatus = function(status) {
    if (STATUS_CONFIG[status]) {
        currentStatus = status;
        updateUIForStatus(status);
        console.log(`Status changed to: ${status}`);
    } else {
        console.log('Invalid status. Valid options: scheduled, assigned, in-transit, picked-up, returned');
    }
};

// Log instructions for demo
console.log('Return Tracking Page Demo');
console.log('------------------------');
console.log('To test different status states, run one of these commands:');
console.log('  setReturnStatus("scheduled")');
console.log('  setReturnStatus("assigned")');
console.log('  setReturnStatus("in-transit")');
console.log('  setReturnStatus("picked-up")');
console.log('  setReturnStatus("returned")');
