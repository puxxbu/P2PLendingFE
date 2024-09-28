async function fetchLenderData() {
    const token = localStorage.getItem('token');
    const response = await fetch('ApiMstUser/GetUserData', {
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
    document.getElementById('lenderBalance').textContent = formatCurrency(lenderData.balance);
}

window.onload = fetchLenderData();

async function topup() {
    const amount = document.getElementById('balance').value;
    
    const reqTopupDto = {
        balance: parseFloat(amount)
    }

    const token = localStorage.getItem('token');
    const response = await fetch('ApiMstUser/UpdateUserBalance', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqTopupDto)
    });

    if (!response.ok) {
        alert('Failed to topup');
        return;
    }

    const jsonData = await response.json();

    if (jsonData.success) {
        alert('Topup success');
        $('#addBalanceModal').modal('hide');
        fetchLenderData();
    } else {
        alert('Topup failed');
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
