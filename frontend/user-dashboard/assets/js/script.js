// PROFILE DETAILS

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem("token");

  // If no token is found, prompt the user to log in and redirect them to the login page
  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html"; // Redirect to login page
    return; // Stop further execution
  }

  try {
    // Send a GET request to fetch the user's profile details
    const response = await fetch("http://localhost:5000/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include token for authentication
        "Content-Type": "application/json",
      },
    });

    // Parse the response JSON
    const data = await response.json();

    // If the request was unsuccessful, throw an error with the response message
    if (!data.success) {
      throw new Error(data.message);
    }

    // 🌟 Update profile details dynamically in the UI

    // Set the profile picture, using a default fallback image if none is available
    document.getElementById("profilePicture").src =
      data.user.profilePicture ||
      "assets/images/default-user-profile-fallback-image.png";

    // Display the user's full name or a default placeholder
    document.getElementById("userName").textContent =
      data.user.fullName || "User";

    // Display the user's address or a placeholder if not provided
    document.getElementById("userAddress").textContent =
      data.user.address || "Address not provided";

    // Display the user's phone number or a placeholder if not available
    document.getElementById("userPhone").textContent =
      data.user.mobileNumber || "Not available";
  } catch (error) {
    // Log any errors encountered during the fetch operation
    console.error("Error fetching profile:", error);

    // Alert the user that the profile could not be loaded
    alert("Failed to load profile. Please try again.");
  }
});


// PROFILE UPDATE DETAILS

