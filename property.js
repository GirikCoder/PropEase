document.addEventListener('DOMContentLoaded', () => {
    const propertyDetailsContainer = document.getElementById('property-details-container');
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    const renderPropertyDetails = (property) => {
        const imageUrl = property.images && property.images.urls && property.images.urls.length > 0
            ? property.images.urls[0]
            : 'https://via.placeholder.com/800x400.png?text=No+Image';

        let detailsHtml = `
            <h1>${property.address}</h1>
            <img src="${imageUrl}" alt="${property.address}" style="width:100%; max-width: 800px; height:auto;">
            <h2>Price: ₹ ${property.price}</h2>
            <p><strong>Status:</strong> ${property.status}</p>
            <p><strong>Type:</strong> ${property.type}</p>
            <button id="enquire-btn" class="btn">Enquire</button>
            <hr>
            <h3>Details</h3>
        `;

        if (property.residential_details) {
            const resDetails = property.residential_details;
            detailsHtml += `
                <ul>
                    <li>Bedrooms: ${resDetails.bedrooms}</li>
                    <li>Bathrooms: ${resDetails.bathrooms}</li>
                    <li>Area: ${resDetails.area} sq.ft.</li>
                    <li>Garage: ${resDetails.garage}</li>
                    <li>Garden: ${resDetails.garden ? 'Yes' : 'No'}</li>
                    <li>Swimming Pool: ${resDetails.swimming_pool ? 'Yes' : 'No'}</li>
                </ul>
            `;
        } else if (property.commercial_details) {
            const comDetails = property.commercial_details;
            detailsHtml += `
                <ul>
                    <li>Floor Area: ${comDetails.floor_area} sq.ft.</li>
                    <li>Parking Spaces: ${comDetails.parking_spaces}</li>
                    <li>Number of Floors: ${comDetails.num_floors}</li>
                    <li>Restrooms: ${comDetails.restrooms}</li>
                </ul>
            `;
        }

        propertyDetailsContainer.innerHTML = detailsHtml;

        document.getElementById('enquire-btn').addEventListener('click', handleEnquire);
    };

    const fetchProperty = async () => {
        if (!propertyId) {
            propertyDetailsContainer.innerHTML = '<p>No property ID provided.</p>';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/view/${propertyId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch property details');
            }
            const data = await res.json();
            renderPropertyDetails(data.property);
        } catch (error) {
            propertyDetailsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    const handleEnquire = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Please log in to make an enquiry.');
            window.location.href = 'auth/login.html';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/enquire`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ prop_id: propertyId })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to submit enquiry');
            }
            alert('Enquiry submitted successfully!');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    fetchProperty();
}); 