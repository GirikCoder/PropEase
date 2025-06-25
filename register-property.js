document.addEventListener('DOMContentLoaded', () => {
    const registerPropertyForm = document.getElementById('register-property-form');

    registerPropertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Please log in to register a property.');
            window.location.href = 'auth/login.html';
            return;
        }

        const formData = new FormData(registerPropertyForm);

        // Dummy data for fields not in the simplified form
        formData.append('ownership_status', 'owned');
        formData.append('ownership_history', 'N/A');
        formData.append('latitude', '28.644800');
        formData.append('longitude', '77.216721');
        formData.append('garage', '0');
        formData.append('flooring_type', 'tiles');
        formData.append('garden', 'false');
        formData.append('balcony', 'false');
        formData.append('swimming_pool', 'false');
        formData.append('security', 'none');
        formData.append('furnishing_status', 'unfurnished');

        try {
            const res = await fetch(`${API_BASE_URL}/api/property`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to register property');
            }

            alert('Property registered successfully!');
            window.location.href = 'dashboard.html';

        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Property registration error:', error);
        }
    });
}); 