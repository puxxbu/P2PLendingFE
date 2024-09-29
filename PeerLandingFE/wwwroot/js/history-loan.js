
async function loadLoansByStatus(status) {
    const token = localStorage.getItem('token');

    if (status === undefined || status === 'all') {
        const response = await fetch('/ApiBorrower/GetAllLoan', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            populateUserTable(jsonData.data)
        } else {
            alert('No Users found.')
        }
        if (!response.ok) {
            alert('Failed to fetch users');
            return;
        }
    } else {
        const response = await fetch('/ApiBorrower/GetLoanByStatus?status=' + status, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const jsonData = await response.json();

        if (jsonData.success) {
            populateUserTable(jsonData.data)
        } else {
            alert('No Users found.')
        }
        if (!response.ok) {
            alert('Failed to fetch users');
            return;
        }
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
        let actionButtons = `
            <button class="btn btn-success btn-sm" onclick="showDetail('${item.loanId}')">Detail</button>
        `;

        if (item.status === 'funded') {
            actionButtons += `
                <button class="btn btn-primary btn-sm" onclick="payLoan('${item.loanId}')">Pay</button>
            `;
        }

        if (item.status === 'repaid') {
            actionButtons += `
                <button class="btn btn-success btn-sm" onclick="paidLoan('${item.loanId}')">Detail Pembayaran</button>
            `;
        }

        row.innerHTML = `
            <td>${item.borrowerName}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.interestRate} %</td>
            <td>${item.status}</td>
            <td>${actionButtons}</td>
        `;

        userTableBody.appendChild(row);
    });
}


window.onload = loadLoansByStatus();

function showDetail(id) {
    //alert('Edit user with id: ' + id);
    const token = localStorage.getItem('token');

    console.log('fetching loan with id: ' + id);

    fetch('/ApiLender/GetLoanById?id=' + id, {
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

function payLoan(id) {
    const token = localStorage.getItem('token');
    let totalPayment = 0;

    $('#loan-payAmount').text(formatCurrency(totalPayment));

    console.log('fetching loan with id: ' + id);

    fetch('/ApiBorrower/GetPaymentDetail?id=' + id, {
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

                $('#loan-loanId').text(item.loanId);
                $('#loan-amount').text(formatCurrency(item.amount));
                $('#loan-interestRate').text(item.interestRate.toString() + '%');
                $('#loan-duration').text(item.duration);
                $('#loan-status').text(item.status);
                $('#loan-returnAmount').text(formatCurrency(item.returnAmount))
                $('#loan-returnInterest').text(formatCurrency(item.returnInterest))
                $('#loan-createdAt').text(formatDateTimeWIB(item.createdAt));
                $('#loan-updatedAt').text(formatDateTimeWIB(item.updatedAt));

                $('#payment-checkboxes').empty();

                

                console.log(item);
                console.log(item.paySchedules);
                console.log(item.paySchedules);


                for (let i = 0; i < item.paySchedules.length; i++) {
                    const paymentSchedule = item.paySchedules[i];
                    const paymentDate = new Date(paymentSchedule.repaymentDate);
                    const paymentMonth = paymentDate.getMonth() + 1;
                    const paymentYear = paymentDate.getFullYear();
                    const paymentAmount = item.loanRatio;

                    const checkbox = $('<div>')
                        .addClass('form-check mb-2')
                        .html(`
                          <input class="form-check-input payment-checkbox" type="checkbox" value="${paymentAmount}" id="payment-${i + 1}" ${paymentSchedule.isPaid ? 'disabled' : ''}>
                          <label class="form-check-label" for="payment-${i + 1}">
                            Bulan ${paymentMonth} ${paymentYear} - ${formatCurrency(paymentAmount)}
                          </label>
                          <input type="hidden" class="payment-date" value="${paymentSchedule.repaymentDate}">
                        `);

                    $('#payment-checkboxes').append(checkbox);

                    checkbox.find('.payment-checkbox').on('change', function () {
                        updateTotalPayment();
                    });

                    if (paymentSchedule.isPaid) {
                        checkbox.find('.payment-checkbox').prop('checked', true);
                    }

                    totalPayment += paymentAmount;
                }

                function updateTotalPayment() {
                    totalPayment = 0;

                    $('.payment-checkbox:checked').each(function () {
                        if (!$(this).prop('disabled')) {
                            console.log('adding payment: ' + $(this).val());
                            totalPayment += parseFloat($(this).val());
                        }
                    });

                    console.log('updating total payment ' + totalPayment);
                    $('#loan-payAmount').text(formatCurrency(totalPayment));
                }

                $('#showPayModal').modal('show');
            } else {
                alert('Loan not found');
            }
        });
        
}

function paidLoan(id) {
    const token = localStorage.getItem('token');
    let totalPayment = 0;

    $('#paid-payAmount').text(formatCurrency(totalPayment));

    console.log('fetching loan with id: ' + id);

    fetch('/ApiBorrower/GetPaymentDetail?id=' + id, {
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

                $('#paid-loanId').text(item.loanId);
                $('#paid-amount').text(formatCurrency(item.amount));
                $('#paid-interestRate').text(item.interestRate.toString() + '%');
                $('#paid-duration').text(item.duration);
                $('#paid-status').text(item.status);
                $('#paid-returnAmount').text(formatCurrency(item.returnAmount))
                $('#paid-returnInterest').text(formatCurrency(item.returnInterest))
                $('#paid-createdAt').text(formatDateTimeWIB(item.createdAt));
                $('#paid-updatedAt').text(formatDateTimeWIB(item.updatedAt));
                $('#paid-lastPaymentStatus').text(item.lastPaymentStatus);

                $('#paid-checkboxes').empty();



                console.log(item);
                console.log(item.paySchedules);
                console.log(item.paySchedules);


                for (let i = 0; i < item.paySchedules.length; i++) {
                    const paymentSchedule = item.paySchedules[i];
                    const paymentDate = new Date(paymentSchedule.repaymentDate);
                    const paymentMonth = paymentDate.getMonth() + 1;
                    const paymentYear = paymentDate.getFullYear();
                    const paymentAmount = item.loanRatio;

                    const checkbox = $('<div>')
                        .addClass('form-check mb-2')
                        .html(`
                          <input class="form-check-input paid-checkbox" type="checkbox" value="${paymentAmount}" id="payment-${i + 1}" ${paymentSchedule.isPaid ? 'disabled' : ''}>
                          <label class="form-check-label" for="payment-${i + 1}">
                            Bulan ${paymentMonth} ${paymentYear} - ${formatCurrency(paymentAmount)}
                          </label>
                          <input type="hidden" class="payment-date" value="${paymentSchedule.repaymentDate}">
                        `);

                    $('#paid-checkboxes').append(checkbox);

                    checkbox.find('.paid-checkbox').on('change', function () {
                        updateTotalPayment();
                    });

                    if (paymentSchedule.isPaid) {
                        checkbox.find('.paid-checkbox').prop('checked', true);
                    }

                    totalPayment += paymentAmount;
                }

                function updateTotalPayment() {
                    totalPayment = 0;

                    $('.payment-checkbox:checked').each(function () {
                        if (!$(this).prop('disabled')) {
                            console.log('adding payment: ' + $(this).val());
                            totalPayment += parseFloat($(this).val());
                        }
                    });

                    console.log('updating total payment ' + totalPayment);
                    $('#loan-payAmount').text(formatCurrency(totalPayment));
                }

                $('#showPaidModal').modal('show');
            } else {
                alert('Loan not found');
            }
        });

}


async function pay() {
    const selectedPaymentDates = [];
    const loanId = $('#loan-loanId').text();

    $('.payment-checkbox:checked').each(function () {
        if (!$(this).prop('disabled')) {
            selectedPaymentDates.push($(this).siblings('.payment-date').val());
        }
    });

    if (selectedPaymentDates.length <= 0) {
        alert('Please select at least one payment date.');
    } 


    const reqPayLoan = {
        loanId: loanId,
        repaidAt: selectedPaymentDates
    };


    const token = localStorage.getItem('token');
    const response = await fetch('/ApiBorrower/PayLoan', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqPayLoan)
    });

    console.log(response);

    if (!response.ok) {
        alert('Failed to pay loan');
        return;
    } else {
        alert('Pay loan success');
        $('#showPayModal').modal('hide');
        loadLoansByStatus();
        return;
    }

   

   
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
    }

    const jsonData = await response.json();

    if (jsonData.success) {
        alert('Request loan success');
        $('#requestLoanModal').modal('hide');
        fetchRequestedLoan();
    } else {
        alert('Topup failed');
    }
}

//async function fetchUserData() {
//    const token = localStorage.getItem('token');
//    const response = await fetch('/ApiMstUser/GetUserData', {
//        method: 'GET',
//        headers: {
//            'Authorization': 'Bearer ' + token
//        }
//    });

//    if (!response.ok) {
//        alert('Failed to fetch users');
//        return;
//    }
//    const jsonData = await response.json();

//    if (jsonData.success) {
//        fillLenderData(jsonData.data);
//    } else {
//        alert('No Users found.')
//    }
//}

//function fillLenderData(lenderData) {
//    //document.getElementById('lenderName').textContent = lenderData.name;
//    //document.getElementById('lenderRole').textContent = lenderData.role;
//    document.getElementById('lenderBalance').textContent = formatCurrency(lenderData.balance);
//}

//window.onload = fetchUserData();
