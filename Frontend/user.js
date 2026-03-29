// document.getElementById("adminSwitchBtn").addEventListener("click", () => {
//     window.location.href = "adminDashboard.html";
// });

// get role from token
const token = localStorage.getItem("accessToken");

// if (token) {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const role = payload.role;

//     const btn = document.getElementById("adminSwitchBtn");

//     if (role === "ROLE_ADMIN") {
//         btn.style.display = "inline-block";
//     }
// }

if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (role !== "ROLE_USER") {
        console.log("Unauthorized access attempt");
        window.location.href = "home.html"; 
    }
} else {
    // window.location.href = "login.html";
    window.location.href = "home.html";
}

// verify session on load
fetchWithAuth("/auth/home")
    .then(res => {
      if (res.status === 401) {
          window.location.href = "home.html";
          return;
      }
  })
    .catch(() => {
        console.log("session expired");
        // window.location.href = "login.html";
        window.location.href = "home.html";
    });


function goToPayment() {
    let rentText = document.getElementById("roomRent").textContent;
    let rent = rentText.replace(/[₹,\s]/g, "");

    localStorage.setItem("rentAmount", rent);
    localStorage.setItem("paymentOrigin", "USER");

    fetchWithAuth("/auth/home")
        .then(() => {
            window.location.href = "paymentPage.html";
        })
        .catch(() => {
            console.log("session expired");
            window.location.href = "home.html";
        });
}
