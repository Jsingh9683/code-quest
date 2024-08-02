document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userName) {
        const userNameElement = document.getElementById("userName");
        userNameElement.textContent = user.userName + '  ';
    } else {
        console.error("User data not found in localStorage.");
    }
});