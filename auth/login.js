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

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        if (!email || !password) {
            alert('Please fill all fields.');
            return;
        }

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const token = await userCredential.user.getIdToken();

            console.log('Firebase Auth Token received and saved:', token);
            localStorage.setItem('authToken', token);

            alert('Login successful');
            window.location.href = '../index.html';
        } catch (error) {
            alert(`Login failed: ${error.message}`);
            console.error('Login error:', error);
        }
    });
}); 