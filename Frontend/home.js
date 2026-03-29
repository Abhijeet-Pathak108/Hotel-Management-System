

        function openLogin() {
            document.getElementById("loginModal").style.display = "flex";
            document.getElementById("pageContent").classList.add("blur");
        }

        function closeLogin() {
            document.getElementById("loginModal").style.display = "none";
            document.getElementById("pageContent").classList.remove("blur");
        }

        function openRegister() {
            document.getElementById("registerModal").style.display = "flex";
            document.getElementById("pageContent").classList.add("blur");
        }

        function closeRegister() {
            document.getElementById("registerModal").style.display = "none";
            document.getElementById("pageContent").classList.remove("blur");
        }

        function switchToRegister() {
            closeLogin();
            openRegister();
        }

        function switchToLogin() {
            closeRegister();
            openLogin();
        }

        /* === LOGIN FORM HANDLER === */
        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault(); // prevent page refresh

            const username = document.getElementById("login_username").value;
            const password = document.getElementById("login_password").value;
            const loader = document.getElementById("loginLoader");
            const msgBox = document.getElementById("loginMsg");

            loader.style.display = "block";
            msgBox.textContent = "";

            try {
                const r = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include"
                });

                loader.style.display = "none";

                if (r.status === 401) {
                    msgBox.style.color = "red";
                    msgBox.textContent = "User Not found!";
                    return;
                }

                if (!r.ok) {
                    msgBox.style.color = "red";
                    msgBox.textContent = "Login failed!";
                    return;
                }

                const data = await r.json();
                saveAccessToken(data.accessToken);

                const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
                const role = payload.role;

                closeLogin();

                if (role === "ROLE_ADMIN") {
                    window.location.href = "adminDashboard.html";
                } else if(role === "ROLE_USER") {
                    window.location.href = "user-dashboard.html";
                }
                else if(role === "ROLE_STAFF"){
                    window.location.href="staff-dashboard.html";
                }
                else{
                    window.location.href="manager-dashboard.html";
                }

            } catch (err) {
                loader.style.display = "none";
                msgBox.style.color = "red";
                msgBox.textContent = "Network error! Try again.";
            }
        });

        /* === REGISTER FORM HANDLER === */
        // document.getElementById("registerForm").addEventListener("submit", async (e) => {
        //     e.preventDefault();

        //     const username = document.getElementById("reg_username").value;
        //     const password = document.getElementById("reg_password").value;
        //     const role = document.getElementById("reg_role").value;

        //     const loader = document.getElementById("registerLoader");
        //     const msgBox = document.getElementById("regMsg");

        //     loader.style.display = "block";
        //     msgBox.textContent = "";

        //     try {
        //         const r = await fetch(`${API_BASE}/auth/register`, {
        //             method: "POST",
        //             headers: { "Content-Type": "application/json" },
        //             body: JSON.stringify({ username, password, role })
        //         });

        //         loader.style.display = "none";

        //         if (r.status === 409) {
        //             msgBox.style.color = "red";
        //             msgBox.textContent = "User already exists!";
        //             return;
        //         }

        //         if (r.ok) {
        //             msgBox.style.color = "green";
        //             msgBox.textContent = "Registered successfully!";
        //             setTimeout(() => switchToLogin(), 1500);
        //         } else {
        //             msgBox.style.color = "red";
        //             msgBox.textContent = "Registration failed!";
        //         }

        //     } catch (err) {
        //         loader.style.display = "none";
        //         msgBox.style.color = "red";
        //         msgBox.textContent = "Network error! Try again.";
        //     }
        // });

