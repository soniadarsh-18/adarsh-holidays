function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  fetchUserProfile();

  // Initialize event listeners
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", saveProfile);
  document
    .getElementById("travellerForm")
    .addEventListener("submit", saveTravellers);
});

// Base API URL
const API_BASE_URL = "https://adarsh-holidays-backend-production.up.railway.app/api";

document.addEventListener("DOMContentLoaded", () => {
  updateNavAuthButton();
  setupDropdownNavigation();
  handleProfileRedirect();

  // Attach logout event to the dropdown and desktop navigation logout buttons
  document.getElementById("logoutButton")?.addEventListener("click", logout);
});

// Logout Function
function logout() {
  localStorage.removeItem("token"); // Remove token
  window.location.href = "/authentication/login.html"; // Redirect to login page
}

// Handles auto-scroll when redirected with a section ID
function handleProfileRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const sectionId = urlParams.get("section");

  if (sectionId) {
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 500); // Wait for the page to load before scrolling
  }
}

// Dropdown Navigation Setup
// Setup dropdown navigation for user profile sections
function setupDropdownNavigation() {
  document.querySelectorAll("#userDropdown a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");
      const targetId = link.getAttribute("href").replace("#", "");

      if (!token) {
        // Redirect to login if not logged in
        window.location.href = "/authentication/login.html";
        return;
      }

      // Check if user is already on the profile page
      if (
        window.location.pathname.includes("/user-dashboard/index.html")
      ) {
        scrollToSection(targetId);
      } else {
        // Redirect to profile page with section ID
        window.location.href = `/user-dashboard/index.html?section=${targetId}`;
      }
    });
  });
}

// Smooth scroll function
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    document
      .querySelectorAll(".section")
      .forEach((section) => section.classList.add("hidden"));
    targetSection.classList.remove("hidden");
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
}

function updateNavAuthButton() {
  const authButton = document.getElementById("authButton");
  const dropdown = document.getElementById("userDropdown");
  const token = localStorage.getItem("token");

  if (token) {
    fetch("https://adarsh-holidays-backend-production.up.railway.app/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const user = data.user;
          authButton.innerHTML = `<i class="fa-solid fa-user"></i>&nbsp;&nbsp;&nbsp;Hi, ${user.fullName}`;
          authButton.href = "#";
          authButton.classList.remove("hidden"); // Show button
          dropdown.classList.remove("hidden"); // Show dropdown for logged-in users

          // Handle dropdown visibility on hover
          let dropdownTimeout;
          authButton.addEventListener("mouseenter", () => {
            clearTimeout(dropdownTimeout);
            dropdown.classList.add("show");
          });

          dropdown.addEventListener("mouseenter", () => {
            clearTimeout(dropdownTimeout);
            dropdown.classList.add("show");
          });

          authButton.addEventListener("mouseleave", () => {
            dropdownTimeout = setTimeout(() => {
              if (!dropdown.matches(":hover"))
                dropdown.classList.remove("show");
            }, 200);
          });

          dropdown.addEventListener("mouseleave", () => {
            dropdownTimeout = setTimeout(() => {
              if (!authButton.matches(":hover"))
                dropdown.classList.remove("show");
            }, 200);
          });

          // Logout functionality
          document
            .getElementById("logoutButton")
            .addEventListener("click", () => {
              localStorage.removeItem("userId"); // Remove stored user ID
              localStorage.removeItem("userData"); // Remove user data
              localStorage.removeItem("token");
              dropdown.classList.add("hidden"); // Hide dropdown after logout
              window.location.href = "/authentication/login.html"; // Redirect to login page
            });
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  } else {
    // User is logged out
    authButton.innerHTML = `<i class="fa-solid fa-user"></i>&nbsp;&nbsp;&nbsp;Sign In`;
    authButton.href = "/authentication/login.html"; // Redirect to login when clicked
    authButton.classList.remove("hidden"); // Ensure button is visible
    dropdown.classList.add("hidden"); // Hide dropdown when logged out
  }
}

// Fetch User Profile from API
function fetchUserProfile() {
  const token = localStorage.getItem("token");

  fetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayUserProfile(data.user);
      } else {
        console.error("Error fetching profile:", data.message);
      }
    })
    .catch((error) => console.error("API Error:", error));
}

// Display User Profile Data
function displayUserProfile(user) {
  document.getElementById("profileName").textContent = user.fullName || "N/A"; // Use fullName instead of name
  // Format birthday to YYYY-MM-DD
  const formattedBirthday = user.birthday
    ? new Date(user.birthday).toISOString().split("T")[0]
    : "N/A";
  // Update the title dynamically
  if (user.fullName) {
    document.title = `Hi, ${user.fullName}`;
    document.getElementById("userTitleName").textContent = user.fullName; // Update the <h2> title
  }

  document.getElementById("profileBirthday").textContent = formattedBirthday;
  document.getElementById("profileGender").textContent = user.gender || "N/A";
  document.getElementById("profileMaritalStatus").textContent =
    user.maritalStatus || "N/A";
  document.getElementById("profileAddress").textContent = user.address || "N/A";
  document.getElementById("profilePincode").textContent = user.pincode || "N/A";
  document.getElementById("profileState").textContent = user.state || "N/A";
}

// Toggle Sections function
function showSection(sectionId, event) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });

  // Show the selected section
  const selectedSection = document.getElementById(sectionId + "Section");
  if (selectedSection) {
    selectedSection.classList.remove("hidden");
  }

  // Remove active class from all tabs
  document.querySelectorAll(".sidebar ul li").forEach((li) => {
    li.classList.remove("active");
  });

  // Add active class to the clicked tab
  if (event && event.target) {
    event.target.classList.add("active");
  } else {
    // Fallback: Find the tab with the matching sectionId and add active class
    const tab = document.querySelector(
      `.sidebar ul li[onclick*="${sectionId}"]`
    );
    if (tab) {
      tab.classList.add("active");
    }
  }

  // If the "Bookings" section is shown, fetch and display bookings
  if (sectionId === "bookingsDetails") {
    fetchUserBookings();
  }
}
let allBookings = []; // Global storage for all bookings

// Decode JWT Token
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// Fetch User Bookings
async function fetchUserBookings(filterDate = null) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your bookings.");
      return;
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.userId) {
      throw new Error("Invalid token. Please login again.");
    }

    const userId = decodedToken.userId;

    const response = await fetch(`https://adarsh-holidays-backend-production.up.railway.app/api/flights/user-bookings/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch flight bookings.");
    }

    const data = await response.json();

    if (data.success) {
      allBookings = data.bookings;

      let bookings = allBookings;

      // ✅ Apply date filter if provided
      if (filterDate) {
        bookings = bookings.filter(booking => {
          const depDate = new Date(booking.departureTime).toISOString().split("T")[0];
          return depDate === filterDate;
        });
      }

      displayBookings(bookings);

      // Show or hide clear button
      document.getElementById("clearDateFilter").style.display = filterDate ? "inline-block" : "none";
    } else {
      throw new Error("No bookings found.");
    }
  } catch (error) {
    console.error("Error fetching flight bookings:", error);
    alert(error.message);
  }
}

// Filter button click handler
function filterBookingsByDate() {
  const dateInput = document.getElementById("bookingDate").value;
  const errorElement = document.getElementById("dateError");

  if (!dateInput) {
    errorElement.textContent = "Please select a date to filter.";
    errorElement.style.display = "block";
    return;
  }

  errorElement.style.display = "none"; // Hide error if date selected

  const filtered = allBookings.filter(booking => {
    const depDate = new Date(booking.departureTime).toISOString().split("T")[0];
    return depDate === dateInput;
  });

  displayBookings(filtered);
  document.getElementById("clearDateFilter").style.display = "inline-block";
}

// Clear filter
function clearDateFilter() {
  const dateInput = document.getElementById("bookingDate");
  const errorElement = document.getElementById("dateError");

  dateInput.value = "";
  dateInput.placeholder = "Select Booking Date";
  errorElement.textContent = "";
  errorElement.style.display = "none";

  // Reset the flatpickr input
  flatpickr("#bookingDate").clear(); // Clears the date and resets the input

  displayBookings(allBookings);
  document.getElementById("clearDateFilter").style.display = "none";
}

// Flatpickr initialization
flatpickr("#bookingDate", {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "d-m-Y",
  allowInput: true,
});


// Format Date and Time
function formatDateTime(dateTime) {
  const dateObj = new Date(dateTime);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  };
  return dateObj.toLocaleString("en-GB", options).replace(",", "");
}

// Toggle Flight Details
function toggleFlightDetails(bookingId) {
  const detailsSection = document.getElementById(`flight-details-${bookingId}`);
  const button = document.getElementById(`toggle-btn-${bookingId}`);

  if (detailsSection.style.display === "none") {
    detailsSection.style.display = "block";
    button.textContent = "Hide Flight Details";
  } else {
    detailsSection.style.display = "none";
    button.textContent = "View Flight Details";
  }
}

// Cancel Booking (Dynamic Button Update)
async function cancelBooking(bookingId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const button = document.getElementById(`cancel-btn-${bookingId}`);
    const errorMsg = document.getElementById(`error-msg-${bookingId}`);

    if (!button) return;

    // Disable button & update text
    button.disabled = true;
    button.textContent = "Cancelling...";
    errorMsg.textContent = ""; // Clear error message

    // Send DELETE request
    const response = await fetch(
      `https://adarsh-holidays-backend-production.up.railway.app/api/flights/delete/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel booking.");
    }

    // Success: Update button text
    button.textContent = "Booking Cancelled";
    button.style.backgroundColor = "#d9534f"; // Change to red

    // Delay before hiding the booking card
    setTimeout(() => {
      document.getElementById(`booking-${bookingId}`).remove();
      checkEmptyBookings();
    }, 1500);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    const errorMsg = document.getElementById(`error-msg-${bookingId}`);
    if (errorMsg) errorMsg.textContent = error.message;

    // Reset button state
    const button = document.getElementById(`cancel-btn-${bookingId}`);
    if (button) {
      button.textContent = "Cancel Booking";
      button.disabled = false;
    }
  }
}

// Check if all bookings are deleted
function checkEmptyBookings() {
  const bookingsList = document.getElementById("bookingsList");
  if (bookingsList.children.length === 0) {
    bookingsList.innerHTML = `<p class="no-bookings">No bookings found.</p>`;
  }
}

function displayBookings(bookings) {
  const bookingsList = document.getElementById("bookingsList");

  // Show the loader while waiting for data
  bookingsList.innerHTML = `<span class="loader"></span>`;

  // Simulate API delay (if applicable)
  setTimeout(() => {
    bookingsList.innerHTML = ""; // Clear previous content or loader

    if (!bookings || bookings.length === 0) {
      bookingsList.innerHTML = `<p class="no-bookings">No bookings found.</p>`;
      return;
    }

    // Show latest bookings at the top
    bookings.slice().reverse().forEach((booking) => {
      const bookingCard = document.createElement("div");
      bookingCard.classList.add("booking-card");
      bookingCard.id = `booking-${booking.bookingId}`;

      bookingCard.innerHTML = `
  <div class="booking-header">
    <div class="flight-icon">
      <i class="fa-solid fa-plane-up"></i>
    </div>
    <div class="flight-info">
      <h3>${booking.flightNumber} | ${booking.departure} → ${booking.arrival}</h3>
      <p>${formatDateTime(booking.departureTime)}</p>
      <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
    </div>
    <div class="price">
      <h3><b>${booking.status}</b></h3>
    </div>
  </div>

  <div class="booking-footer">
    <button id="toggle-btn-${booking.bookingId}" onclick="toggleFlightDetails('${booking.bookingId}')">
      View Flight Details
    </button>
  </div>

  <div class="flight-details" id="flight-details-${booking.bookingId}" style="display: none;">
    <h4>${booking.flightNumber} | ${booking.departure} → ${booking.arrival}</h4>
    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
    <p><strong>Departure:</strong> ${formatDateTime(booking.departureTime)}</p>
    <p><strong>Arrival:</strong> ${formatDateTime(booking.arrivalTime)}</p>
    <p><strong>Price:</strong> ₹${booking.price}</p>
    <p id="error-msg-${booking.bookingId}" class="error-msg"></p>
    <button id="cancel-btn-${booking.bookingId}" onclick="cancelBooking('${booking.bookingId}')">
      Cancel Booking
    </button>
  </div>
`;


      bookingsList.appendChild(bookingCard);
    });
  }, 1500); // Simulate a delay (replace this with your actual API call)
}


// Decode JWT Token to Extract userId
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

function openEditProfile() {
  const modal = document.getElementById("editProfileModal");
  modal.classList.remove("hidden");

  // Pre-fill the form with existing profile data
  document.getElementById("editFullName").value =
    document.getElementById("profileName").textContent;

  let birthdayText = document.getElementById("profileBirthday").textContent;

  if (birthdayText !== "N/A" && birthdayText) {
    let dateObj = new Date(birthdayText);
    let formattedDate = dateObj.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Initialize Flatpickr with the prefilled date
    flatpickr("#editBirthday", {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d-m-Y",
      allowInput: true,
      maxDate: new Date().setDate(new Date().getDate() - 1),
      defaultDate: formattedDate, // Set default date from DB
    });

    document.getElementById("editBirthday").value = formattedDate;
  } else {
    flatpickr("#editBirthday", {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d-m-Y",
      allowInput: true,
      maxDate: new Date().setDate(new Date().getDate() - 1),
    });

    document.getElementById("editBirthday").value = "";
  }

  document.getElementById("editGender").value =
    document.getElementById("profileGender").textContent;
  document.getElementById("editMaritalStatus").value = document.getElementById(
    "profileMaritalStatus"
  ).textContent;
  document.getElementById("editAddress").value =
    document.getElementById("profileAddress").textContent;
  document.getElementById("editPincode").value =
    document.getElementById("profilePincode").textContent;
  document.getElementById("editState").value =
    document.getElementById("profileState").textContent;

  // Add event listener to close modal when clicking outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeEditProfile();
    }
  });
}

// Close Edit Profile Modal
function closeEditProfile() {
  const modal = document.getElementById("editProfileModal");
  modal.classList.add("hidden");

  // Remove the event listener to avoid memory leaks
  modal.removeEventListener("click", closeEditProfile);
}

// PROFILE UPDATE DETAILS

// Wait for the DOM to be fully loaded before executing the script
// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem("token");

  // If no token is found, redirect to login page

  // Attach the event listener to the profile update form submission
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission behavior

      // Get the Save button
      const saveBtn = document.querySelector(".save-btn");

      // Change button text to "Saving..."
      saveBtn.textContent = "Saving...";
      saveBtn.disabled = true; // Disable button during update

      // Collect updated user data from the form
      const updatedData = {
        fullName: document.getElementById("editFullName").value,
        birthday: document.getElementById("editBirthday").value,
        gender: document.getElementById("editGender").value,
        maritalStatus: document.getElementById("editMaritalStatus").value,
        address: document.getElementById("editAddress").value,
        pincode: document.getElementById("editPincode").value,
        state: document.getElementById("editState").value,
      };

      try {
        // Send a PUT request to update the user's profile
        const response = await fetch("https://adarsh-holidays-backend-production.up.railway.app/api/user/update", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        // Parse the response JSON
        const data = await response.json();

        // If the request was unsuccessful, throw an error with the response message
        if (!data.success) {
          throw new Error(data.message);
        }

        // Update button text and style to indicate success
        saveBtn.textContent = "Saved";
        saveBtn.style.backgroundColor = "green"; // Make button green
        saveBtn.style.color = "white";

        // Close the edit profile modal or section (if applicable)
        closeEditProfile();

        // Refresh the profile details to reflect the changes
        fetchUserProfile();

        // Re-enable button after a short delay
        setTimeout(() => {
          saveBtn.textContent = "Save";
          saveBtn.disabled = false;
          saveBtn.style.backgroundColor = ""; // Reset to default color
          saveBtn.style.color = "";
        }, 2000); // Reset after 2 seconds
      } catch (error) {
        console.error("Error updating profile:", error);

        // Revert button state if an error occurs
        saveBtn.textContent = "Save";
        saveBtn.disabled = false;
      }
    });
});

// Change Password Functions
// Change Password Functions
function openChangePassword() {
  const modal = document.getElementById("changePasswordModal");
  modal.classList.remove("hidden");

  // Add event listener to close modal when clicking outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeChangePassword();
    }
  });
}

function closeChangePassword() {
  const modal = document.getElementById("changePasswordModal");
  modal.classList.add("hidden");
  document.getElementById("changePasswordForm").reset();

  // Remove the event listener to avoid memory leaks
  modal.removeEventListener("click", closeChangePassword);
}

// Traveller Management
function openTravellerModal() {
  document.getElementById("travellerModal").classList.remove("hidden");
}

function closeTravellerModal() {
  document.getElementById("travellerModal").classList.add("hidden");
}

function addTraveller() {
  let newTraveller = prompt("Enter Traveller Name:");
  if (newTraveller) {
    let travellerItem = document.createElement("div");
    travellerItem.textContent = newTraveller;
    document.getElementById("travellerList").appendChild(travellerItem);
  }
}

function saveTravellers(event) {
  event.preventDefault();
  setTimeout(() => {
    closeTravellerModal();
    alert("Travellers saved successfully!");
  }, 1000);
}

(function () {
  const API_BASE_URL = "https://adarsh-holidays-backend-production.up.railway.app/api";
  const token = localStorage.getItem("token"); // Retrieve the token

  async function fetchUserDetails() {
    if (!token) {
      console.error("User not logged in!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();

      if (data.success && data.user) {
        // document.getElementById("profileMobileNumber").textContent =
        //   data.user.mobileNumber || "Not Available";
        document.getElementById("profileEmail").textContent =
          data.user.email || "Not Available";
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  // Call the function on page load
  fetchUserDetails();
})();
document.addEventListener("DOMContentLoaded", function () {
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("passwordError");

  // Live validation while typing
  function checkPasswordsMatch() {
    if (newPasswordInput.value && confirmPasswordInput.value) {
      if (newPasswordInput.value !== confirmPasswordInput.value) {
        passwordError.classList.remove("hidden");
      } else {
        passwordError.classList.add("hidden");
      }
    }
  }

  confirmPasswordInput.addEventListener("input", checkPasswordsMatch);
  newPasswordInput.addEventListener("input", checkPasswordsMatch);
});

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const saveBtn = document.querySelector(".change-save");
    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    // Final check before sending API
    if (newPassword !== confirmPassword) {
      passwordError.classList.remove("change-hidden");
      saveBtn.textContent = "Save";
      saveBtn.disabled = false;
      return;
    } else {
      passwordError.classList.add("change-hidden");
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        saveBtn.textContent = "Saved";
        saveBtn.style.backgroundColor = "green";
        saveBtn.style.color = "white";

        closeChangePassword();

        setTimeout(() => {
          saveBtn.textContent = "Save";
          saveBtn.disabled = false;
          saveBtn.style.backgroundColor = "";
          saveBtn.style.color = "";
        }, 2000);
      } else {
        // Show backend error if any
        if (data?.message) {
          alert(data.message); // Or show inside an element
        }
        saveBtn.textContent = "Save";
        saveBtn.disabled = false;
      }
    } catch (error) {
      console.error("Error changing password:", error);
      saveBtn.textContent = "Save";
      saveBtn.disabled = false;
    }
  });


// Function to close the modal
function closeChangePassword() {
  document.getElementById("changePasswordModal").classList.add("hidden");
}

// Co-travelers
document.addEventListener("DOMContentLoaded", fetchTravellers);

let updatingTravelerId = null; // Track traveler being updated

// Fetch and display co-travelers
async function fetchTravellers() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE_URL}/user/co-travelers/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      displayTravellers(data.coTravelers || []);
    } else {
      console.error("Error fetching travellers:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display co-travelers inside the list
function displayTravellers(travellers) {
  const travellersList = document.getElementById("travellersList");
  travellersList.innerHTML = ""; // Clear previous list

  if (travellers.length === 0) {
    travellersList.innerHTML = "<p>No co-travellers added yet.</p>";
    return;
  }

  travellers.forEach((traveller) => {
    const div = document.createElement("div");
    div.classList.add("traveller-item");
    div.setAttribute("data-id", traveller._id); // Add a data-id for easy reference

    // Create action buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("traveller-actions");

    const updateBtn = document.createElement("button");
    updateBtn.classList.add("update-btn");
    updateBtn.setAttribute("data-id", traveller._id);
    updateBtn.setAttribute("data-name", traveller.name);
    updateBtn.setAttribute("data-age", traveller.age);
    updateBtn.setAttribute("data-relation", traveller.relation);

    // Create Update Icon
    const updateIcon = document.createElement("i");
    updateIcon.classList.add("fa-solid", "fa-pen");
    updateIcon.style.fontSize = "12px";

    updateBtn.appendChild(updateIcon);
    updateBtn.appendChild(document.createTextNode(" Update")); // Keep text

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.setAttribute("data-id", traveller._id);

    // Create Remove Icon
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fa-solid", "fa-user-slash");
    removeIcon.style.fontSize = "12px";

    removeBtn.appendChild(removeIcon);
    removeBtn.appendChild(document.createTextNode(" Remove")); // Keep text

    // Append buttons to actionsDiv
    actionsDiv.appendChild(updateBtn);
    actionsDiv.appendChild(removeBtn);

    // Construct the traveller div
    div.innerHTML = `<p><strong>${traveller.name}</strong> (Age: ${traveller.age}, ${traveller.relation})</p>`;
    div.appendChild(actionsDiv);
    travellersList.appendChild(div);

    // Handle update button click
    updateBtn.addEventListener("click", function () {
      const coTravelerId = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const age = this.getAttribute("data-age");
      const relation = this.getAttribute("data-relation");

      populateUpdateForm(coTravelerId, name, age, relation);
    });

    // Handle remove button click
    removeBtn.addEventListener("click", function () {
      const coTravelerId = this.getAttribute("data-id");
      removeTraveller(coTravelerId, this);
    });
  });

  // Listen for window resize to toggle icons dynamically
  function toggleIcons() {
    const isMobile = window.innerWidth < 768;
    document
      .querySelectorAll(".update-btn i, .remove-btn i")
      .forEach((icon) => {
        icon.style.display = isMobile ? "none" : "inline";
      });
  }

  toggleIcons(); // Run on load
  window.addEventListener("resize", toggleIcons); // Run on resize
}

// Populate the form with traveler details for updating
function populateUpdateForm(travellerId, name, age, relation) {
  document.getElementById("travellerName").value = name;
  document.getElementById("travellerAge").value = age;
  document.getElementById("travellerRelation").value = relation;

  updatingTravelerId = travellerId; // Store the ID of the traveler being updated

  const submitButton = document.querySelector(".add-traveller-btn");
  submitButton.innerHTML =
    "<i class='fa-solid fa-user-edit'></i>&nbsp;&nbsp;&nbsp;Update Traveller";
  submitButton.style.backgroundColor = "orange";
}

// Handle Add/Update Traveller Form Submission
document
  .getElementById("addTravellerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const name = document.getElementById("travellerName").value.trim();
    const age = parseInt(document.getElementById("travellerAge").value, 10);
    const relation = document.getElementById("travellerRelation").value.trim();
    const submitButton = document.querySelector(".add-traveller-btn");

    if (!name || isNaN(age) || age <= 0 || !relation) {
      return; // Stop execution if fields are invalid
    }

    let url, method, requestData, successMessage;
    if (updatingTravelerId) {
      // Update existing traveler
      url = `${API_BASE_URL}/user/co-traveler/update`;
      method = "PUT";
      requestData = { coTravelerId: updatingTravelerId, name, age, relation };
      successMessage = "Updated!";
    } else {
      // Add new traveler
      url = `${API_BASE_URL}/user/co-travelers/add`;
      method = "POST";
      requestData = { name, age, relation };
      successMessage = "Added!";
    }

    // Update button state while processing
    submitButton.innerHTML = "Adding...";
    submitButton.disabled = true;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        updatingTravelerId = null;
        document.getElementById("addTravellerForm").reset();
        fetchTravellers(); // Refresh traveler list

        // Update button text and style
        submitButton.innerHTML = successMessage;
        submitButton.style.backgroundColor = "#4CAF50";
        submitButton.style.color = "white";

        // Reset button after 3 seconds
        setTimeout(() => {
          submitButton.innerHTML =
            "<i class='fa-solid fa-user-plus'></i>&nbsp;&nbsp;&nbsp;Add Traveller";
          submitButton.style.backgroundColor = "";
          submitButton.style.color = "";
          submitButton.disabled = false;
        }, 2000);

        // Scroll to last updated traveler if more than 6 travelers
        setTimeout(() => {
          const travellersList = document.getElementById("travellersList");
          if (travellersList.children.length > 6) {
            const lastTraveller = travellersList.lastElementChild;
            lastTraveller.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 500);
      } else {
        console.error("Error:", data);
        submitButton.innerHTML =
          "<i class='fa-solid fa-user-plus'></i>&nbsp;&nbsp;&nbsp;Add Traveller";
        submitButton.disabled = false;
      }
    } catch (error) {
      console.error("Error:", error);
      submitButton.innerHTML =
        "<i class='fa-solid fa-user-plus'></i>&nbsp;&nbsp;&nbsp;Add Traveller";
      submitButton.disabled = false;
    }
  });

// Remove a co-traveler
// Remove a co-traveler (Smooth UI update)
async function removeTraveller(coTravelerId, buttonElement) {
  const token = localStorage.getItem("token");

  if (!buttonElement) return;

  // Change button text and disable while removing
  buttonElement.innerHTML = "Removing...";
  buttonElement.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/user/co-travelers/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coTravelerId }),
    });

    const data = await response.json();

    if (response.ok) {
      // Smoothly fade out and remove the traveler
      const travellerRow = document.querySelector(
        `[data-id="${coTravelerId}"]`
      );
      if (travellerRow) {
        travellerRow.style.transition = "opacity 0.3s ease-out";
        travellerRow.style.opacity = "0";
        setTimeout(() => travellerRow.remove(), 300);
      }

      // Refresh the list after a short delay
      setTimeout(fetchTravellers, 500);
    } else {
      console.error("Error removing traveler:", data);
      buttonElement.innerHTML = `<i class="fa-solid fa-user-slash" style="font-size: 12px"></i>&nbsp;&nbsp;Remove`;
      buttonElement.disabled = false;
    }
  } catch (error) {
    console.error("Error:", error);
    buttonElement.innerHTML = `<i class="fa-solid fa-user-slash" style="font-size: 12px"></i>&nbsp;&nbsp;Remove`;
    buttonElement.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const emailToggle = document.getElementById("emailToggle"); // Toggle for disabling email login
  const body = document.body;

  // Fetch user settings from the backend
  async function fetchUserSettings() {
    try {
      const response = await fetch("/api/settings", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch user settings");

      const data = await response.json();

      if (data.darkMode) {
        body.classList.add("dark-mode");
        darkModeToggle.checked = true;
      }

      if (data.disableLoginEmail) {
        emailToggle.checked = true;
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }

  // Toggle dark mode and update backend
  darkModeToggle.addEventListener("change", async function () {
    const isDarkModeEnabled = darkModeToggle.checked;
    body.classList.toggle("dark-mode", isDarkModeEnabled);
    await updateUserSettings({ darkMode: isDarkModeEnabled });
  });

  // Toggle email login disable setting
  emailToggle.addEventListener("change", async function () {
    const isEmailLoginDisabled = emailToggle.checked;
    await updateUserSettings({ disableLoginEmail: isEmailLoginDisabled });
  });
});

// JavaScript to handle tab switching on desktop
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".sidebar ul li");

  // Show the first section by default on desktop
  sections[0].classList.remove("hidden");

  // Add click event listeners to sidebar links
  navLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      // Hide all sections
      sections.forEach((section) => section.classList.add("hidden"));
      // Show the selected section
      sections[index].classList.remove("hidden");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  // Show/hide button on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  // Scroll to top when button is clicked
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ✅ Fetch and display the user's profile picture on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchProfilePicture();
});

// ✅ Upload Profile Picture with Progress
function uploadProfilePicture() {
  const fileInput = document.getElementById("userProfileFileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  const formData = new FormData();
  formData.append("profilePicture", file);

  // Progress bar UI
  const progressBar = document.createElement("div");
  progressBar.style.height = "5px";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "dodgerblue";
  progressBar.style.transition = "width 0.3s ease";
  document.getElementById("userProfileImageContainer").appendChild(progressBar);

  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://adarsh-holidays-backend-production.up.railway.app/api/user/upload-profile-picture",
    true
  );
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      progressBar.style.width = `${(event.loaded / event.total) * 100}%`;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if (data.success && data.profilePicture) {
        const newImageUrl = `https://adarsh-holidays-backend-production.up.railway.app/api/user/profile_pictures/${data.profilePicture
          }?t=${Date.now()}`;

        document.getElementById("userProfileImg").src = newImageUrl;
        localStorage.setItem("profilePicture", newImageUrl);

        // ✅ Fetch profile again to avoid stale data
        setTimeout(fetchProfilePicture, 500);
      } else {
        alert(data.message);
      }
    } else {
      alert("Failed to upload image.");
    }
    setTimeout(() => progressBar.remove(), 500);
  };

  xhr.send(formData);
}

// ✅ Fetch Profile Picture with Fallback
function fetchProfilePicture() {
  const profileImage = document.getElementById("userProfileImg");
  const cachedImage = localStorage.getItem("profilePicture");

  if (cachedImage) {
    profileImage.src = cachedImage;
    return;
  }

  fetch("https://adarsh-holidays-backend-production.up.railway.app/api/user/profile", {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User profile data:", data);

      if (data.profilePicture) {
        const profilePicUrl = `https://adarsh-holidays-backend-production.up.railway.app/api/user/profile_pictures/${data.profilePicture
          }?t=${Date.now()}`;

        profileImage.src = profilePicUrl;
        localStorage.setItem("profilePicture", profilePicUrl);
      } else {
        // ✅ Default fallback image for users without a profile picture
        profileImage.src =
          "/assets/images/default-user-profile-fallback-image.png";
        localStorage.removeItem("profilePicture");
      }
    })
    .catch((err) => {
      console.error("Error fetching profile:", err);
      setDefaultProfilePicture();
    });
}

// ✅ Remove Profile Picture and Set Default
function removeProfilePicture() {
  fetch("https://adarsh-holidays-backend-production.up.railway.app/api/user/remove-profile-picture", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setDefaultProfilePicture();
      } else {
        alert(data.message);
      }
    })
    .catch((err) => console.error(err));
}

// ✅ Handle Profile Picture Dropdown Actions
document.addEventListener("DOMContentLoaded", () => {
  const userProfileImageContainer = document.getElementById(
    "userProfileImageContainer"
  );
  const userProfileDropdown = document.getElementById("userProfileDropdown");
  const userProfileFileInput = document.getElementById("userProfileFileInput");

  userProfileImageContainer.addEventListener("click", (event) => {
    event.stopPropagation();
    userProfileDropdown.style.display =
      userProfileDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    userProfileDropdown.style.display = "none";
  });

  userProfileDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document
    .getElementById("changeUserProfileImage")
    .addEventListener("click", () => {
      userProfileFileInput.click();
    });

  userProfileFileInput.addEventListener("change", uploadProfilePicture);

  document
    .getElementById("removeUserProfileImage")
    .addEventListener("click", removeProfilePicture);
});

// ✅ View Profile Picture in a Popup Modal
document.addEventListener("DOMContentLoaded", () => {
  const viewImageBtn = document.getElementById("viewUserProfileImage");
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");
  const closePopup = document.querySelector(".closePopup");
  const overlay = document.getElementById("popupOverlay");
  const userProfileDropdown = document.getElementById("userProfileDropdown");

  viewImageBtn.addEventListener("click", () => {
    const imgSrc = document.getElementById("userProfileImg").src;
    if (imgSrc) {
      popupImage.src = imgSrc;
      popup.style.display = "flex";
      overlay.style.display = "block";
      userProfileDropdown.style.display = "none";
    }
  });

  const closePopupFunction = () => {
    popup.style.display = "none";
    overlay.style.display = "none";
  };

  closePopup.addEventListener("click", closePopupFunction);
  overlay.addEventListener("click", closePopupFunction);

  // ✅ Close popup when Esc key is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopupFunction();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Check if the user is on the homepage
  if (
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("index.html")
  ) {
    // Add a specific class to the header for homepage-specific styles
    document.getElementById("masthead").classList.add("homepage-header");
  }
});

// User Settings

document.addEventListener("DOMContentLoaded", async function () {
  const emailToggle = document.getElementById("emailToggle");
  const countrySelect = document.getElementById("countrySelect");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");

  // Get logged-in user ID from localStorage/sessionStorage
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  if (!userId) {
    console.error("User ID not found! Please log in.");
    return; // Stop execution if no user ID is found
  }

  // Function to fetch user settings
  async function fetchUserSettings() {
    try {
      const response = await fetch(
        `https://adarsh-holidays-backend-production.up.railway.app/api/user/settings/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user settings");

      const settings = await response.json();
      // Set toggle and dropdown values
      emailToggle.checked = settings.disableLoginEmails;
      countrySelect.value = settings.country || ""; // Default empty if no value
    } catch (error) {
      console.error("Error fetching settings:", error.message);
    }
  }

  async function saveUserSettings() {
    const updatedSettings = {
      disableLoginEmails: emailToggle.checked,
      country: countrySelect.value || "", // Save empty if no selection
    };

    // Disable button and show "Saving..."
    saveSettingsBtn.disabled = true;
    saveSettingsBtn.classList.add("saving");
    saveSettingsBtn.innerHTML = "Saving";

    try {
      const response = await fetch(
        `https://adarsh-holidays-backend-production.up.railway.app/api/user/settings/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSettings),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Show saved success effect
        saveSettingsBtn.classList.remove("saving");
        saveSettingsBtn.classList.add("saved");
        saveSettingsBtn.innerHTML = "✅ Saved!";

        setTimeout(() => {
          saveSettingsBtn.innerHTML = "Save Settings";
          saveSettingsBtn.classList.remove("saved");
          saveSettingsBtn.disabled = false;
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error.message);

      // Show error effect
      saveSettingsBtn.classList.remove("saving");
      saveSettingsBtn.classList.add("error");
      saveSettingsBtn.innerHTML = "❌ Failed! Try Again";

      setTimeout(() => {
        saveSettingsBtn.innerHTML = "Save Settings";
        saveSettingsBtn.classList.remove("error");
        saveSettingsBtn.disabled = false;
      }, 2000);
    }
  }

  // Attach event listener
  document
    .getElementById("saveSettingsBtn")
    .addEventListener("click", saveUserSettings);

  // Load settings when page loads
  fetchUserSettings();
});

// ✅ Function to toggle password visibility
function togglePassword(id) {
  const input = document.getElementById(id);
  const icon = input.nextElementSibling.querySelector("i");
  input.type = input.type === "password" ? "text" : "password";
  icon.classList.toggle("fa-eye-slash");
  icon.classList.toggle("fa-eye");
}
