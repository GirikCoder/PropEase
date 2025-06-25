document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBrbUdQhNQEXRLXI2ke8id0hoBSD1RgFAc",
        authDomain: "easyestate-6c357.firebaseapp.com",
        projectId: "easyestate-6c357",
        storageBucket: "easyestate-6c357.appspot.com",
        messagingSenderId: "752298354527",
        appId: "1:752298354527:web:4c0f9768d56b8e5691b8ea",
        measurementId: "G-0LFSC6TEVM"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const forgotPasswordForm = document.getElementById('forgot-password-form');

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = forgotPasswordForm.email.value;

        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);
            alert('Password reset email sent! Please check your inbox.');
            forgotPasswordForm.reset();
        } catch (error) {
            alert(`Failed to send reset email: ${error.message}`);
            console.error('Reset email error:', error);
        }
    });
}); 