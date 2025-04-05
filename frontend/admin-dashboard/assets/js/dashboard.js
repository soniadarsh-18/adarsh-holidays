// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     let token = localStorage.getItem("token");

//     if (!token) {
//       console.log("🔍 Checking cookies for token...");
//       const cookieToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("token="));
//       token = cookieToken ? cookieToken.split("=")[1] : null;
//     }

//     console.log("📢 Stored Token:", token || "No Token Found");

//     if (!token) {
//       console.error("❌ No token found! Redirecting to login...");
//       alert("Session expired! Please log in again.");
//       window.location.href = "login.html";
//       return;
//     }

//     // ✅ Debugging API Request
//     console.log("🔹 Sending Token to Backend:", `Bearer ${token}`);

//     // ✅ Fetch User Dashboard Data
//     const response = await fetch("http://localhost:5000/api/user/dashboard", {
//       method: "GET",
//       credentials: "include",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("🔹 Response Status:", response.status);

//     if (response.status === 401) {
//       console.error("❌ Unauthorized - Invalid token!");
//       alert("Session expired. Please log in again.");
//       localStorage.removeItem("token"); // Remove invalid token
//       document.cookie =
//         "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//       window.location.href = "login.html";
//       return;
//     }

//     if (!response.ok) {
//       throw new Error("Failed to fetch user data");
//     }

//     let data;
//     try {
//       data = await response.json();
//     } catch (jsonError) {
//       console.error("❌ Failed to parse JSON response:", jsonError);
//       throw new Error("Invalid server response");
//     }

//     console.log("✅ User Data Fetched:", data);

//     // ✅ Display User Details
//     document.getElementById("userName").textContent =
//       data.user?.fullName || "Unknown User";
//     document.getElementById("userEmail").textContent =
//       data.user?.email || "No Email Found";
//   } catch (error) {
//     console.error("❌ Error loading dashboard:", error);
//     alert("Failed to load user dashboard. Please try again.");
//   }
// });

document.getElementById("logoutBtn").addEventListener("click", () => {
  console.log("🔹 Logging out user...");
  localStorage.removeItem("token"); // ✅ Remove token
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "user-dashboard/login.html"; // ✅ Redirect
});
