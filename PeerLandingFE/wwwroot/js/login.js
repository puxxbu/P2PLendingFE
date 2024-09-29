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
            localStorage.setItem('role', result.data.role);
          
            if (result.data.role === 'admin') {
                window.location.href = '/Admin';
            } else if (result.data.role === 'lender') {
                window.location.href = '/Lender';
            } else if (result.data.role === 'borrower') {
                window.location.href = '/Borrower';
            }
        } else {
            alert(result.message || 'Login failed. Please try again.');
        }
    }
    catch (error) {
        alert('An error occured while logging in: ' + error.message)
    }
}