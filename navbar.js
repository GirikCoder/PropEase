document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const isAuthPage = window.location.pathname.includes('/auth/');
    const prefix = isAuthPage ? '../' : './';

    const renderNavbar = () => {
        const authToken = localStorage.getItem('authToken');

        let menuItems = '';
        if (authToken) {
            menuItems = `
                <li><a href="${prefix}dashboard.html">Dashboard</a></li>
                <li><a href="${prefix}register-property.html">Register Property</a></li>
                <li><a href="${prefix}sent-enquiries.html">Sent Enquiries</a></li>
                <li><a href="#" id="logout-btn">Logout</a></li>
            `;
        } else {
            menuItems = `
                <li><a href="${prefix}auth/login.html">Login</a></li>
                <li><a href="${prefix}auth/signup.html">Sign Up</a></li>
            `;
        }

        navbar.innerHTML = `
            <div class="container">
                <div id="branding">
                    <h1><a href="${prefix}index.html">PropEase</a></h1>
                </div>
                <nav>
                    <ul>
                        ${menuItems}
                    </ul>
                </nav>
            </div>
        `;

        if (authToken) {
            const logoutBtn = document.getElementById('logout-btn');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                window.location.href = `${prefix}auth/login.html`;
            });
        }
    };

    renderNavbar();
}); 