document.addEventListener('DOMContentLoaded', () => {
    const sentEnquiriesList = document.getElementById('sent-enquiries-list');

    const renderSentEnquiries = (enquiries) => {
        sentEnquiriesList.innerHTML = '';
        if (enquiries.length === 0) {
            sentEnquiriesList.innerHTML = '<p>You have not sent any enquiries.</p>';
            return;
        }

        enquiries.forEach(enquiry => {
            const enquiryCard = document.createElement('div');
            enquiryCard.className = 'property-card'; // Reusing some styles

            const imageUrl = enquiry.property.images && enquiry.property.images.urls && enquiry.property.images.urls.length > 0
                ? enquiry.property.images.urls[0]
                : 'https://via.placeholder.com/300x200.png?text=No+Image';

            enquiryCard.innerHTML = `
                <img src="${imageUrl}" alt="${enquiry.property.address}">
                <div class="property-card-content">
                    <h3>Enquiry for: ${enquiry.property.address}</h3>
                    <p><strong>Status:</strong> ${enquiry.stages}</p>
                    <p><strong>Date:</strong> ${new Date(enquiry.enquiry_date).toLocaleDateString()}</p>
                    <a href="property.html?id=${enquiry.property.property_id}" class="btn">View Property</a>
                </div>
            `;
            sentEnquiriesList.appendChild(enquiryCard);
        });
    };

    const fetchSentEnquiries = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'auth/login.html';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/enquire`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!res.ok) throw new Error('Failed to fetch sent enquiries');

            const data = await res.json();
            renderSentEnquiries(data.enquiries || []);
        } catch (error) {
            sentEnquiriesList.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    fetchSentEnquiries();
}); 