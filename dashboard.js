document.addEventListener('DOMContentLoaded', () => {
    const propertyList = document.getElementById('dashboard-property-list');

    const renderProperties = (properties) => {
        propertyList.innerHTML = '';
        if (properties.length === 0) {
            propertyList.innerHTML = '<p>No properties found.</p>';
            return;
        }

        properties.forEach(property => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.dataset.propertyId = property.property_id;

            const imageUrl = property.images && property.images.urls && property.images.urls.length > 0
                ? property.images.urls[0]
                : 'https://via.placeholder.com/300x200.png?text=No+Image';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${property.address}">
                <div class="property-card-content">
                    <h3>${property.address}</h3>
                    <p>Status: <span class="status">${property.prop_status}</span></p>
                    <div class="actions">
                        <a href="property.html?id=${property.property_id}" class="btn">View</a>
                        <button class="btn btn-delete">Delete</button>
                        <select class="status-select">
                            <option value="processing" ${property.prop_status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="available" ${property.prop_status === 'available' ? 'selected' : ''}>Available</option>
                            <option value="sold" ${property.prop_status === 'sold' ? 'selected' : ''}>Sold</option>
                        </select>
                    </div>
                </div>
            `;
            propertyList.appendChild(card);
        });
    };

    const fetchProperties = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'auth/login.html';
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
            renderProperties(data.properties || []);
        } catch (error) {
            propertyList.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    propertyList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const card = e.target.closest('.property-card');
            const propertyId = card.dataset.propertyId;
            if (confirm('Are you sure you want to delete this property?')) {
                deleteProperty(propertyId);
            }
        }
    });

    propertyList.addEventListener('change', async (e) => {
        if (e.target.classList.contains('status-select')) {
            const card = e.target.closest('.property-card');
            const propertyId = card.dataset.propertyId;
            const newStatus = e.target.value;
            updatePropertyStatus(propertyId, newStatus);
        }
    });

    const deleteProperty = async (propertyId) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/property`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prop_id: propertyId })
            });
            if (!res.ok) throw new Error('Failed to delete');
            fetchProperties(); // Refresh list
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const updatePropertyStatus = async (propertyId, status) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/property`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ property_id: propertyId, status: status })
            });
            if (!res.ok) throw new Error('Failed to update status');
            fetchProperties(); // Refresh list
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    fetchProperties();
}); 