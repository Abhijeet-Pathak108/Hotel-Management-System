// protect admin-only access
const token = localStorage.getItem("accessToken");

if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (role !== "ROLE_MANAGER") {
        console.log("Unauthorized access attempt");
        window.location.href = "home.html"; 
    }
} else {
    // window.location.href = "login.html";
    window.location.href = "home.html";
}

// check session on load
fetchWithAuth("/auth/home")
    .catch(() => {
        console.log("session expired");
        // window.location.href = "login.html";
        window.location.href = "home.html";
    });
