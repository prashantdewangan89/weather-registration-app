// ----------- Helper functions -----------
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showPopup() {
  const popup = document.getElementById("successPopup");
  if (!popup) return;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 5000);
}

// ----------- REGISTER PAGE -----------
if (document.getElementById("register-page")) {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const countrySelect = document.getElementById("country");
    if (countrySelect) countrySelect.value = "India";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const gender = document.getElementById("gender").value;
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const country = document.getElementById("country").value;

      if (!name || !gender || !email || !phone || !country) {
        alert("⚠️ Please fill all fields.");
        return;
      }
      if (!validateEmail(email)) {
        alert("⚠️ Invalid email address.");
        return;
      }
      if (!validatePhone(phone)) {
        alert("⚠️ Invalid phone number.");
        return;
      }

      const user = { name, gender, email, phone, country };

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        const data = await res.json();
        if (data.success) {
    showPopup();       // popup show
    form.reset();
    countrySelect.value = "India";

    // ✅ Redirect to weather page after 0.5 sec
    setTimeout(() => {
        window.location.href = "../weather/index.html";
    }, 2000);
}else {
          alert("❌ Registration failed.");
        }
      } catch (err) {
        console.error("Error registering user:", err);
        alert("❌ Server not responding. Please try again.");
      }
    });
  });
}

// ----------- ADMIN PAGE -----------
if (document.getElementById("admin-page")) {
  document.addEventListener("DOMContentLoaded", () => {
    renderTable();

    const clearAllBtn = document.getElementById("clearAll");
    clearAllBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete ALL users?")) return;
      await fetch("/api/clear", { method: "DELETE" });
      renderTable();
    });
  });

  async function renderTable() {
    try {
      const res = await fetch("/api/users");
      const users = await res.json();
      const tbody = document.querySelector("#usersTable tbody");
      const noData = document.getElementById("noData");
      tbody.innerHTML = "";

      if (!users || users.length === 0) {
        noData.style.display = "block";
        return;
      } else {
        noData.style.display = "none";
      }

      users.forEach((u, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td>${escapeHtml(u.name)}</td>
          <td>${escapeHtml(u.gender)}</td>
          <td>${escapeHtml(u.email)}</td>
          <td>${escapeHtml(u.phone)}</td>
          <td>${escapeHtml(u.country)}</td>
          <td><button class="action-btn delete-btn" data-email="${u.email}">Delete</button></td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const email = e.target.getAttribute("data-email");
          if (!confirm(`Delete user ${email}?`)) return;
          await fetch(`/api/users/${email}`, { method: "DELETE" });
          renderTable();
        });
      });
    } catch (err) {
      console.error("Error loading users:", err);
    }
  }
}
