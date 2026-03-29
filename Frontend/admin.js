const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownMenu = document.querySelector(".dropdown-menu");

function openRegister() {
            document.getElementById("registerModal").style.display = "flex";
            document.getElementById("pageContent").classList.add("blur");
        }

        function closeRegister() {
            document.getElementById("registerModal").style.display = "none";
            document.getElementById("pageContent").classList.remove("blur");
        }

        /* === REGISTER FORM HANDLER === */
        document.getElementById("registerForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("reg_username").value;
            const password = document.getElementById("reg_password").value;
            const role = document.getElementById("reg_role").value;

            const loader = document.getElementById("registerLoader");
            const msgBox = document.getElementById("regMsg");

            loader.style.display = "block";
            msgBox.textContent = "";

            try {
                const r = await fetch(`${API_BASE}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, role })
                });

                loader.style.display = "none";

                if (r.status === 409) {
                    msgBox.style.color = "red";
                    msgBox.textContent = "User already exists!";
                    return;
                }

                if (r.ok) {
                    msgBox.style.color = "green";
                    msgBox.textContent = "Registered successfully!";
                    setTimeout(() => switchToLogin(), 1500);
                } else {
                    msgBox.style.color = "red";
                    msgBox.textContent = "Registration failed!";
                }

            } catch (err) {
                loader.style.display = "none";
                msgBox.style.color = "red";
                msgBox.textContent = "Network error! Try again.";
            }
        });


// dropdownBtn.onclick = () => {
//     dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
// };

// document.addEventListener("click", function(e){
//     if (!dropdownBtn.contains(e.target)) {
//         dropdownMenu.style.display = "none";
//     }
// });

// Hooks for later modal/pages
// function registerAdmin(){ console.log("Register Admin Clicked"); }
// function registerManager(){ console.log("Register Manager Clicked"); }
// function registerStaff(){ console.log("Register Staff Clicked"); }



// protect admin-only access
const token = localStorage.getItem("accessToken");

if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (role !== "ROLE_ADMIN") {
        console.log("Unauthorized access attempt");
        window.location.href = "user-dashboard.html"; 
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

function switchToUser() {
    fetchWithAuth("/auth/home")
        .then(() => window.location.href = "user-dashboard.html")
        .catch(() => {
        // window.location.href = "login.html"
        window.location.href = "home.html";
        }
    );
}

function manageUsers() {
    alert("Redirect to Manage Users (feature placeholder)");
}

function viewReports() {
    alert("Redirect to Reports (feature placeholder)");
}

// function goToPayment() {
//     // mark that user came from user dashboard
//     localStorage.setItem("paymentOrigin", "ADMIN");
//     fetchWithAuth("/auth/home")
//         .then(() => window.location.href = "PaymentPage.html")
//         .catch(() => {
//         // window.location.href = "login.html"
//         window.location.href = "home.html";
//         }
//     );
// }

function openModal(type) {
  const overlay = document.getElementById("modalOverlay");
  const box = document.getElementById("modalContent");
  const title = document.getElementById("modalTitle");

  // blur page
  document.getElementById("pageContent").classList.add("blur");
  
  overlay.style.display = "flex";

  switch(type) {
    case 'MANAGERS':
      title.textContent = "Managers List";
      loadManagers(box);
      break;
    case 'TENANTS':
      title.textContent = "Tenants List";
      loadTenants(box);
      break;
    case 'ADD_ROOM':
      title.textContent = "Add Room";
      loadAddRoomForm(box);
      break;
    case 'VIEW_ROOMS':
      title.textContent = "Rooms List";
      loadRooms(box);
      break;
  }
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById("pageContent").classList.remove("blur");
}


function loadManagers(box){
  box.innerHTML = `
     <table border="1" width="100%">
       <tr><th>ID</th><th>username</th><th>Name</th><th>Contact No.</th><th>Address</th><th>Identity</th></tr>
       <tbody id="managerTable"></tbody>
     </table>
  `;
  
  fetchWithAuth("/admin/managers")
    .then(r => r.json())
    .then(data => {
       const tbody = document.getElementById("managerTable");
       tbody.innerHTML = data.map(u=>`
         <tr>
           <td>${u.id}</td>
           
           <td>${u.username}</td>
           <td>${u.name}</td>
           <td>${u.contactNo}</td>
           <td>${u.address}</td>
           <td>${u.identity}</td>
         </tr>
       `).join("");
    });
}


function loadTenants(box){
  box.innerHTML = `
     <table border="1" width="100%">
       <tr><th>ID</th><th>username</th><th>Name</th><th>Contact No.</th><th>Address</th><th>Identity</th></tr>
       <tbody id="tenantTable"></tbody>
     </table>
  `;
  
  fetchWithAuth("/admin/tenants")
    .then(r => r.json())
    .then(data => {
       document.getElementById("tenantTable").innerHTML =
         data.map(u=>`
           <tr>
            td>${u.id}</td>
           
           <td>${u.username}</td>
           <td>${u.name}</td>
           <td>${u.contactNo}</td>
           <td>${u.address}</td>
           <td>${u.identity}</td>
           </tr>
         `).join("");
    });
}


function loadAddRoomForm(box){
  box.innerHTML = `
    <input id="roomNumber" placeholder="Room Number"><br><br>
    <input id="capacity" placeholder="Capacity" type="number"><br><br>
    <label for="roomType">Room Type</label>
<select id="roomType">
<option value="" disabled selected>Choose Room Type</option>
    <option value="AC">AC</option>
    <option value="NON_AC">Non-AC</option>
</select>

    <br><br>
    <button onclick="saveRoom()">Save Room</button>
    <p id="roomMsg"></p>
  `;
}


function loadRooms(box){
  box.innerHTML = `
     <table border="1" width="100%">
       <tr><th>ID</th><th>Room No</th><th>Capacity</th><th>Room Type</th><th>Status</th></tr>
       <tbody id="roomTable"></tbody>
     </table>
  `;

  fetchWithAuth("/admin/rooms")
    .then(r => r.json())
    .then(data => {
      document.getElementById("roomTable").innerHTML =
        data.map(r=>`
          <tr>
            <td>${r.id}</td>
            <td>${r.roomNumber}</td>
            <td>${r.capacity}</td>
            <td>${r.status}</td>
          </tr>
        `).join("");
    });
}
