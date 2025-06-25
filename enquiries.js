document.addEventListener('DOMContentLoaded', () => {
    const enquiriesList = document.getElementById('enquiries-list');

    const renderEnquiries = (enquiries) => {
        enquiriesList.innerHTML = '';
        if (enquiries.length === 0) {
            enquiriesList.innerHTML = '<p>No enquiries found.</p>';
            return;
        }

        enquiries.forEach(enquiry => {
            const enquiryCard = document.createElement('div');
            enquiryCard.className = 'property-card'; // Reusing some styles
            enquiryCard.dataset.enquiryId = enquiry.enquiry_id;

            enquiryCard.innerHTML = `
                <div class="property-card-content">
                    <h3>Enquiry for: ${enquiry.property.address}</h3>
                    <p><strong>Buyer:</strong> ${enquiry.buyer.name} (${enquiry.buyer.email})</p>
                    <p><strong>Status:</strong> ${enquiry.stages}</p>
                    <p><strong>Date:</strong> ${new Date(enquiry.enquiry_date).toLocaleDateString()}</p>
                    <div class="actions">
                        <button class="btn btn-accept">Accept</button>
                        <button class="btn btn-reject">Reject</button>
                    </div>
                </div>
            `;
            enquiriesList.appendChild(enquiryCard);
        });
    };

    const fetchEnquiries = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'auth/login.html';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/seller-enquiries`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!res.ok) throw new Error('Failed to fetch enquiries');
            
            const data = await res.json();
            renderEnquiries(data.enquiries.enquiries || []);
        } catch (error) {
            enquiriesList.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    enquiriesList.addEventListener('click', (e) => {
        const enquiryCard = e.target.closest('.property-card');
        if (!enquiryCard) return;

        const enquiryId = enquiryCard.dataset.enquiryId;
        if (e.target.classList.contains('btn-accept')) {
            acceptEnquiry(enquiryId);
        } else if (e.target.classList.contains('btn-reject')) {
            if (confirm('Are you sure you want to reject this enquiry?')) {
                rejectEnquiry(enquiryId);
            }
        }
    });

    const acceptEnquiry = async (enquiryId) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/seller-enquiries`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ enquiry_id: enquiryId })
            });
            if (!res.ok) throw new Error('Failed to accept enquiry');
            fetchEnquiries();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const rejectEnquiry = async (enquiryId) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/seller-enquiries`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ enquiry_id: enquiryId })
            });
            if (!res.ok) throw new Error('Failed to reject enquiry');
            fetchEnquiries();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    fetchEnquiries();
}); 