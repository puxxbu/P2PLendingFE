
async function fetchRequestedLoan() {
    const token = localStorage.getItem('token');
    const response = await fetch('/ApiBorrower/GetRequestedLoan', {
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


function formatCurrency(amount) {
    return `Rp. ${amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTimeWIB(isoDateString) {
    const date = new Date(isoDateString);
    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        // millisecond: '3-digit'
    };
    return date.toLocaleString('id-ID', options);
}

function populateUserTable(items) {
    const userTableBody = document.querySelector('#historyTable tbody');
    userTableBody.innerHTML = '';


    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.borrowerName}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.interestRate} %</td>
            <td>${item.status}</td>
            <td>
            <button class="btn btn-success btn-sm" onclick="showDetail('${item.loanId}')">Detail</button>
          
            </td>
          
        `;

        userTableBody.appendChild(row);
    });
}


window.onload = fetchRequestedLoan();

function showDetail(id) {
    //alert('Edit user with id: ' + id);
    const token = localStorage.getItem('token');

    console.log('fetching loan with id: ' + id);

    fetch('ApiLender/GetLoanById?id=' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                alert('Failed to fetch loan');
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data) {
                const item = data.data;

                document.getElementById('loanId').textContent = item.loanId;
                document.getElementById('borrowerName').textContent = item.borrowerName;
                document.getElementById('amount').textContent = formatCurrency(item.amount);
                document.getElementById('interestRate').textContent = item.interestRate.toString() + '%';
                document.getElementById('duration').textContent = item.duration;
                document.getElementById('status').textContent = item.status;
                document.getElementById('returnAmount').textContent = formatCurrency(item.returnAmount)
                document.getElementById('returnInterest').textContent = formatCurrency(item.returnInterest)
                document.getElementById('createdAt').textContent = formatDateTimeWIB(item.createdAt);
                document.getElementById('updatedAt').textContent = formatDateTimeWIB(item.updatedAt);

                $('#showLoanModal').modal('show');
            } else {
                alert('Loan not found');
            }
        })
        .catch(error => {
            alert('An error occured while fetching data: ' + error.message);
        });
}

async function requestLoan() {
    const amount = document.getElementById('loanAmount').value;

    const reqAddLoanDto = {
        amount: parseFloat(amount),
        interestRate : 2.5
    }

    const token = localStorage.getItem('token');
    const response = await fetch('/ApiBorrower/AddLoan', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddLoanDto)
    });

    if (!response.ok) {
        alert('Failed to request loan');
        return;
    } else {
        alert('Request loan success');
        $('#requestLoanModal').modal('hide');
        fetchRequestedLoan();
    }

   
}

async function fetchUserData() {
    const token = localStorage.getItem('token');
    const response = await fetch('/ApiMstUser/GetUserData', {
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
        fillLenderData(jsonData.data);
    } else {
        alert('No Users found.')
    }
}

function fillLenderData(lenderData) {
    //document.getElementById('lenderName').textContent = lenderData.name;
    //document.getElementById('lenderRole').textContent = lenderData.role;
    document.getElementById('lenderBalance').textContent = formatCurrency(lenderData.balance);
}

window.onload = fetchUserData();
