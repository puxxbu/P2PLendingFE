async function submitLogin() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            localStorage.setItem('token', result.data.token);
            window.location.href = '/home/index';
        } else {
            alert(result.message || 'Login failed. Please try again.');
        }
    }
    catch (error) {
        alert('An error occured while logging in: ' + error.message)
    }
}