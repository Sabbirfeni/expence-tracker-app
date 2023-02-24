// Create main local storage
!localStorage.getItem('mainStorage') &&  localStorage.setItem('mainStorage', JSON.stringify([])) 
let MAIN_STORAGE = JSON.parse(localStorage.getItem('mainStorage'));

const dateInput = document.querySelector('#date'),
amountInput = document.querySelector('#amount'),
descriptionInput = document.querySelector('#description'),
expenseBtn = document.querySelector('#expense'),
depositBtn = document.querySelector('#deposit'),
totalEarnings = document.querySelector('.totalEarnings'),
totalExpense = document.querySelector('.totalExpense'),
currentBalance = document.querySelector('.currentBalance'),
infoType = document.querySelector('.infoType'),
tbody = document.querySelector('.tbody'),
timeRange = document.querySelector('.timeRange'),
editBtn = document.querySelector('.edit_btn'),
delete_btn = document.querySelector('.delete_btn'),
modelContainer = document.querySelector('.model');

document.body.addEventListener('click', (e) => {
    // Show model to edit
    if(e.target.innerHTML == 'Edit') {
        const parent = e.target;
        const id = parent.getAttribute('data-id');
        const editableData = MAIN_STORAGE.find(data => data.id == id);
        modelContainer.classList.add('active')
        const model = `
                        <div class="card p-4">
                            <label for="">Amount</label>
                            <input type="number" id='updatedAmount' value='${editableData.amount}'>
                            <label for="">Description</label>
                            <input type="text" id='updatedDescription' value='${editableData.description}'>
                            <button type='submit' value='Submit' id='submitEditedData' class='model_btn border-0 bg-primary' data-id='${editableData.id}'>Save</button>
                            <button type='submit' value='Cancel' id='cancelEdit' class='btn-warning model_btn border-0 text-white'>Cancel</button>
                        </div>
                    `
        modelContainer.innerHTML = model
    }
    // Save edited data
    if(document.querySelector('#submitEditedData'))  {
        const saveBtn = document.querySelector('#submitEditedData');
        const updatedAmount = document.querySelector('#updatedAmount');
        const updatedDescription = document.querySelector('#updatedDescription');
        const id = saveBtn.getAttribute('data-id');

        saveBtn.addEventListener('click', () => {
            MAIN_STORAGE.forEach(data => {
                if(data.id == id) {
                    data.amount = updatedAmount.value;
                    data.description = updatedDescription.value;
                }
            })
            localStorage.setItem('mainStorage', JSON.stringify(MAIN_STORAGE));
            modelContainer.classList.remove('active');
            updateTable();
            updateDashboard();
        })
    }
    
    // Confirm to delete
    if(e.target.innerHTML == 'Delete') {
        const parent = e.target;
        const id = parent.getAttribute('data-id');
        const editableData = MAIN_STORAGE.find(data => data.id == id);
        modelContainer.classList.add('active')
        const model = `
                        <div class="card p-4">
                            <h3 class='text-center mb-4'>Are you sure?</h3>
                            <button type='submit' id='delete' class='model_btn bg-warning text-white' data-id='${editableData.id}'>Yes</button>
                            <button type='submit' id='cancelEdit' class='model_btn btn-primary'>No</button>
                        </div>
                    `
        modelContainer.innerHTML = model
    }

    // Delete data
    if(document.querySelector('#delete'))  {
        const yesBtn = document.querySelector('#delete');
        const id = yesBtn.getAttribute('data-id');
        yesBtn.addEventListener('click', () => {
            let newData = MAIN_STORAGE.filter(data => data.id != id);
            MAIN_STORAGE = newData;

            localStorage.setItem('mainStorage', JSON.stringify(MAIN_STORAGE));
            modelContainer.classList.remove('active');
            updateTable();
            updateDashboard();
        })
    }


    if(document.querySelector('#cancelEdit'))  {
        const cancelEdit = document.querySelector('#cancelEdit');
        cancelEdit.addEventListener('click', () => {
            modelContainer.classList.remove('active')
        })
    }

 })

const addExpenseToStorage = (e) => {
    e.preventDefault()

    if(dateInput.value != '' && amountInput.value != '' && descriptionInput.value != '') {
        const id = Math.floor(Math.random() * 100000000000);
        const expenseInfo = {
            id,
            type: 'expense',
            date: dateInput.value,
            amount: Number.parseInt(amountInput.value),
            description: descriptionInput.value
        }
        MAIN_STORAGE.unshift(expenseInfo);
        localStorage.setItem('mainStorage', JSON.stringify(MAIN_STORAGE));
        updateDashboard();
        updateTable();
        dateInput.value = amountInput.value = descriptionInput.value = '';
    } else {
        alert('Please add all data!')
    }
}
const addDepositToStorage = (e) => {
    e.preventDefault()
    if(dateInput.value != '' && amountInput.value != '' && descriptionInput.value != '') {
        const id = Math.floor(Math.random() * 10000);
        const depositInfo = {
            id,
            type: 'deposit',
            date: dateInput.value,
            amount: Number.parseInt(amountInput.value),
            description: descriptionInput.value
        }
        MAIN_STORAGE.unshift(depositInfo);
    
        localStorage.setItem('mainStorage', JSON.stringify(MAIN_STORAGE));
        updateDashboard();
        updateTable();
        dateInput.value = amountInput.value = descriptionInput.value = '';
    } else {
        alert('Please add all data!')
    }
}
expenseBtn.addEventListener('click', addExpenseToStorage);
depositBtn.addEventListener('click', addDepositToStorage);

// Table update
let typeFiltered = [];
let timeFiltered = [];
const filtersData = (timeRange, infoType) => {
    let dataToShow = MAIN_STORAGE;

    let today = new Date();
    today.setDate(today.getDate() - Number.parseInt(timeRange))
    const monthPrefix = today.getMonth()+1 < 10 ? '-0' : '-';
    const datePrefix = today.getDate() < 10 ? '-0' : '-';
    let filterDays = today.getFullYear() +`${monthPrefix}`+ (today.getMonth()+1) +`${datePrefix}`+today.getDate();

    infoType === 'expense' ? dataToShow = dataToShow.filter(data => data.type === 'expense') : infoType === 'deposit' ? dataToShow = dataToShow.filter(data => data.type === 'deposit') : ''; 
    timeRange === 'all' ? dataToShow = dataToShow : dataToShow = dataToShow.filter(data => data.date > filterDays);

    return dataToShow;
}

const updateTable = () => {
    let html = ``;
    const allData = filtersData(timeRange.value, infoType.value);

    allData.forEach(data => {
            const { id, date, type, amount, description } = data;
            html += `
                    <tr class=${type === 'expense' ? 'expense disable' : 'deposit disable'}>
                        <td>${date}</td>
                        <td>${description}</td>
                        <td class="text-center">৳${amount}</td>
                        <td><span>
                        <button class="delete_btn update_btn float-right" data-id='${id}'>Delete</button>
                        <button class="edit_btn update_btn float-right" data-id='${id}'>Edit</button>
                    </td>
                    `
        })
    tbody.innerHTML = html;









    // let dataToShow = MAIN_STORAGE;

    // let today = new Date();
    // timeRange.value === '7' && today.setDate(today.getDate() - 7);
    // timeRange.value === '30' && today.setDate(today.getDate() - 30);

    // const monthPrefix = today.getMonth()+1 < 10 ? '-0' : '-';
    // const datePrefix = today.getDate() < 10 ? '-0' : '-';
    // var filterDays = today.getFullYear() +`${monthPrefix}`+ (today.getMonth()+1) +`${datePrefix}`+today.getDate();

    // infoType.value === 'expense' ? dataToShow = dataToShow.filter(data => data.type === 'expense') : infoType.value === 'deposit' ? dataToShow = dataToShow.filter(data => data.type === 'deposit') : ''; 
    // timeRange.value == '7' ? dataToShow = dataToShow.filter(data => data.date > filterDays) : '';
    // timeRange.value == '30' ? dataToShow = dataToShow.filter(data => data.date > filterDays) : '';
}

updateTable();
infoType.addEventListener('change', updateTable);
timeRange.addEventListener('change', updateTable);

// Dashboard update
const updateDashboard = () => {
    const allDeposit = MAIN_STORAGE.filter(data => data.type == 'deposit');
    let totalDeposit = 0;
    allDeposit.forEach(data => {
        totalDeposit += Number.parseInt(data.amount);
    });

    const allExpense = MAIN_STORAGE.filter(data => data.type == 'expense');
    let expenseSum = 0;
    allExpense.forEach(data => {
        expenseSum += Number.parseInt(data.amount);
    });

    totalEarnings.innerText = `৳${totalDeposit}`;
    totalExpense.innerText = `৳${expenseSum}`;
    currentBalance.innerText = `৳${totalDeposit - expenseSum}`;
}
updateDashboard();


































// Previous project
// let currentBalance = document.getElementById('balance');
// let totalIncome = document.getElementById('totalIncome');
// let totalExpense = document.getElementById('totalExpense');

// let addIncomeBtn = document.getElementById('addIncome');
// let addExpenseBtn = document.getElementById('addExpense');

// let historyContainer = document.getElementById('transactionHistory');
// let date = new Date().getDate();
// let getMonth = new Date().getMonth();
// let getFullYear = new Date().getFullYear();

// let fullDate = date + '/' + getMonth + '/' + getFullYear;

// let updateBalance = 0;
// let updateExpense = 0;

// // Event Listener for Adding income
// addIncomeBtn.addEventListener('click', () => {

//     let transactionName = document.getElementById('transactionName');
//     let transactionAmount = document.getElementById('transactionAmount');

//     if(transactionName.value !== '' && transactionAmount.value !== 0) {
//         let dateContainer = document.createElement('span');
//         let transactionNameHistory = document.createElement('span');
//         let transactionAmountHistory = document.createElement('span');
//         transactionAmountHistory.classList.add('incomeAdd');
    
//         dateContainer.innerText = fullDate;
//         transactionNameHistory.innerText = transactionName.value;
//         transactionAmountHistory.innerText = '$ ' + transactionAmount.value;
    
//         historyContainer.appendChild(dateContainer);
//         historyContainer.appendChild(transactionNameHistory);
//         historyContainer.appendChild(transactionAmountHistory);
//         historyContainer.appendChild(document.createElement('br'));
        
//         updateBalance += Number(transactionAmount.value);
    
//         currentBalance.innerText = updateBalance;
//         totalIncome.innerText = updateBalance;
    
//         transactionName.value = '';
//         transactionAmount.value = '';
//     }
// })


// // Event Listener for Adding income
// addExpenseBtn.addEventListener('click', () => {
//     let transactionName = document.getElementById('transactionName');
//     let transactionAmount = document.getElementById('transactionAmount');

//     let dateContainer = document.createElement('span');
//     let transactionNameHistory = document.createElement('span');
//     let transactionAmountHistory = document.createElement('span');
//     transactionAmountHistory.classList.add('expenseAdd');

//     dateContainer.innerText = fullDate;
//     transactionNameHistory.innerText = transactionName.value;
//     transactionAmountHistory.innerText = '$ ' + transactionAmount.value;

//     historyContainer.appendChild(dateContainer);
//     historyContainer.appendChild(transactionNameHistory);
//     historyContainer.appendChild(transactionAmountHistory);
//     historyContainer.appendChild(document.createElement('br'));

//     updateExpense += Number(transactionAmount.value);
//     updateBalance -= Number(transactionAmount.value);

//     currentBalance.innerText = updateBalance;
//     totalExpense.innerText = updateExpense;

//     transactionName.value = '';
//     transactionAmount.value = '';
// })


