
async function fetchUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch('ApiMstUser/GetAllUsers', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }


    const jsonData = await response.json();

    if (jsonData.success) {
        populateUserTable(jsonData.data)
    } else {
        alert('No Users found.')
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = '';


    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.balance}</td>
            <td>
            <button class="btn btn-primary btn-sm" onclick="editUser('${user.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
          
        `;

        userTableBody.appendChild(row);
    });
}


window.onload = fetchUsers();

function editUser(id) {
    //alert('Edit user with id: ' + id);
    const token = localStorage.getItem('token');

    console.log('fetching user with id: ' + id);

    fetch('ApiMstUser/GetUserById?id=' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                alert('Failed to fetch user');
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data) {
                const user = data.data;

                document.getElementById('userName').value = user.name;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userBalance').value = user.balance;
                document.getElementById('userId').value = user.id;

                $('#editUserModal').modal('show');
            } else {
                alert('User not found');
            }
        })
        .catch(error => {
            alert('An error occured while fetching user: ' + error.message);
        });
}



async function updateUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const balance = document.getElementById('userBalance').value;

    const reqMstUserDto = {
        name: name,
        role: role,
        balance: parseFloat(balance)
    }

    console.log(reqMstUserDto);


    const token = localStorage.getItem('token');

    const response = await fetch('ApiMstUser/UpdateUser?id=' + id, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(reqMstUserDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        })
        .then(data => {
            alert('User updated successfully');
            $('#editUserModal').modal('hide');
            fetchUsers();
        })
        .catch(error => {
            alert('An error occured while update user: ' + error.message);
        });


}



async function deleteUser(id) {

    const token = localStorage.getItem('token');

    const response = await fetch('ApiMstUser/DeleteUser?id=' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.json();
        })
        .then(data => {
            alert('User deleted successfully');
            $('#editUserModal').modal('hide');
            fetchUsers();
        })
        .catch(error => {
            alert('An error occured while deleting user: ' + error.message);
        });
}


function openAddUserModal() {
    $('#addUserModal').modal('show');
}


async function createUser() {
    const email = document.getElementById('userEmail-input').value;
    const password = document.getElementById('userPassword-input').value;
    const name = document.getElementById('name-input').value;
    const role = document.getElementById('userRole-input').value;
    const balance = document.getElementById('balance-input').value;


    const reqAddUserDto = {
        email: email,
        password: password,
        name: name,
        role: role,
        balance: parseFloat(balance)
    }

    console.log(reqAddUserDto);


    try {
        const response = await fetch('ApiMstUser/AddUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqAddUserDto)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
        }

        const data = await response.json();
        alert('User Added successfully');
        $('#addUserModal').modal('hide');
        fetchUsers();
    } catch (error) {
        alert('An error occurred while adding user: ' + error.message);
    }
}