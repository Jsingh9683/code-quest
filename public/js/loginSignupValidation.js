document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(event) {
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            const confirmPassword = this.querySelector('input[type="password"][placeholder="Confirm password"]');

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                event.preventDefault(); // Prevent form submission
            } else if (password.length < 8) {
                alert('Password must be at least 8 characters long.');
                event.preventDefault(); // Prevent form submission
            }

            if (confirmPassword && password !== confirmPassword.value) {
                alert('Passwords do not match.');
                event.preventDefault(); // Prevent form submission
            }
        });
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
