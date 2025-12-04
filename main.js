// main.js

// 1) Update this AFTER you deploy your Firebase Function
// Example: https://us-central1-your-project-id.cloudfunctions.net/api
const FUNCTION_BASE_URL = "https://us-central1-simpleswitch-leads.cloudfunctions.net/api";

const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");
const successEl = document.getElementById("form-success");

// Set footer year
document.getElementById("year").textContent = new Date().getFullYear();

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.classList.remove("error", "success");
    statusEl.textContent = "Sending your audit request...";
    
    const formData = {
      name: form.name.value.trim(),
      businessName: form.businessName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      industry: form.industry.value,
      message: form.message.value.trim()
    };

    if (!FUNCTION_BASE_URL || FUNCTION_BASE_URL.includes("YOUR_FIREBASE_PROJECT_ID")) {
      statusEl.classList.add("error");
      statusEl.textContent = "Backend is not configured yet. Update FUNCTION_BASE_URL in main.js.";
      return;
    }

    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/submitLead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Error from backend:", data);
        statusEl.classList.add("error");
        statusEl.textContent = data.error || "Something went wrong. Please try again.";
        return;
      }

      // Success – show thank-you, hide form
      statusEl.classList.remove("error");
      statusEl.classList.add("success");
      statusEl.textContent = "Audit requested! Check your email.";

      form.classList.add("hidden");
      successEl.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      statusEl.classList.add("error");
      statusEl.textContent = "Network error. Please try again in a minute.";
    }
  });
}
