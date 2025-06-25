document.addEventListener('DOMContentLoaded', () => {
    const propertyList = document.getElementById('property-list');
    const searchInput = document.getElementById('search-input');
    let properties = [];

    const renderProperties = (propertiesToRender) => {
        propertyList.innerHTML = '';
        if (propertiesToRender.length === 0) {
            propertyList.innerHTML = '<p>No properties found.</p>';
            return;
        }

        propertiesToRender.forEach(property => {
            const card = document.createElement('div');
            card.className = 'property-card';

            const imageUrl = property.images && property.images.urls && property.images.urls.length > 0
                ? property.images.urls[0]
                : 'https://via.placeholder.com/300x200.png?text=No+Image';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${property.address}">
                <div class="property-card-content">
                    <h3>${property.type}</h3>
                    <p class="price">₹ ${property.price}</p>
                    <p class="address">${property.address}</p>
                    <a href="property.html?id=${property.property_id}">View Details</a>
                </div>
            `;
            propertyList.appendChild(card);
        });
    };

    const fetchProperties = async () => {
        const authToken = localStorage.getItem('authToken');
        console.log('Retrieved Auth Token from localStorage to send with request:', authToken);

        if (!authToken) {
            propertyList.innerHTML = '<p>Please log in to view properties.</p>';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/property`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch properties');
            }

            const data = await res.json();
            properties = data.properties || [];
            renderProperties(properties);
        } catch (error) {
            propertyList.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProperties = properties.filter(property =>
            property.address.toLowerCase().includes(searchTerm) ||
            property.type.toLowerCase().includes(searchTerm)
        );
        renderProperties(filteredProperties);
    });

    fetchProperties();
}); 