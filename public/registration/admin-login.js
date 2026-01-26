const form = document.getElementById("adminLoginForm");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMsg = document.getElementById("popupMsg");
const popupIcon = document.getElementById("popupIcon");

function showPopup(title, msg, success = true) {
  popupTitle.innerText = title;
  popupMsg.innerText = msg;
  popupIcon.innerText = success ? "✅" : "❌";

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");

    if (success) {
      window.location.href = "/registration/admin.html";
    }
  }, 1500);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      showPopup("Login Success", "Welcome Admin", true);
    } else {
      showPopup("Login Failed", data.message || "Invalid Credentials", false);
    }

  } catch (err) {
    showPopup("Server Error", "Try again later", false);
  }
});
