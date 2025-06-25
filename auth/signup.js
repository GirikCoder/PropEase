document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: signupForm.name.value,
            email: signupForm.email.value,
            password: signupForm.password.value,
            phone: signupForm.phone.value,
            address: signupForm.address.value,
        };

        for (const key in formData) {
            if (!formData[key]) {
                alert(`Please fill in the ${key} field.`);
                return;
            }
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/accounts/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            alert('Account created successfully! Please log in.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(`Signup failed: ${error.message}`);
            console.error('Signup error:', error);
        }
    });
}); 