fetchWithAuth("/auth/home")
    .catch(() => {
        console.log("session expired");
        // window.location.href = "login.html";
        window.location.href = "home.html";
    });


function goBack() {
    const origin = localStorage.getItem("paymentOrigin");

    if (origin === "ADMIN") {
        window.location.href = "adminDashboard.html";
    } else {
        window.location.href = "user-dashboard.html";
    }

    // optional cleanup
    localStorage.removeItem("paymentOrigin");
}


document.addEventListener("DOMContentLoaded", () => {
document.getElementById("payBtn").onclick = async function () {

  const rent = localStorage.getItem("rentAmount");
console.log("Rent to pay:", rent);

  // 1. Call backend to create order
  const res = await fetchWithAuth("/auth/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount: rent })  // ₹100
  });

  const order = await res.json();

  // 2. Initialize Razorpay Checkout
  const options = {
    key: "rzp_test_S41OxbRp67UfaE",
    amount: order.amount,
    currency: "INR",
    name: "My Project",
    description: "Test Transaction",
    order_id: order.id,
    handler: async function (response){
    	
    	const verifyRes = await fetchWithAuth("/auth/verify", {
    	      method: "POST",
    	      headers: {
    	         "Content-Type": "application/json"
    	      },
    	      body: JSON.stringify({
    	         payment_id: response.razorpay_payment_id,
    	         order_id: response.razorpay_order_id,
    	         signature: response.razorpay_signature
    	      })
    	   });


         // 2. Display success modal with details
        showPaymentSuccess({
            amount: order.amount,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
        });
    	
      //  alert("Payment Successful");
      //  console.log(response);
       // send to backend for verification
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
});

function showPaymentSuccess(data) {
    const modal = document.getElementById("paymentSuccessModal");

    document.getElementById("succAmount").textContent = "₹" + data.amount;
    document.getElementById("succOrderId").textContent = data.orderId;
    document.getElementById("succPaymentId").textContent = data.paymentId;
    document.getElementById("succDate").textContent = new Date().toLocaleString();

    modal.style.display = "flex";
}

function goToDashboard() {
    const origin = localStorage.getItem("paymentOrigin");
    
    if (origin === "USER") {
        window.location.href = "user-dashboard.html";
    } else {
        window.location.href = "home.html";
    }
}

