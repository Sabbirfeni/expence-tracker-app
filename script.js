// Create main local storage
!localStorage.getItem('mainStorage') && localStorage.setItem('mainStorage', JSON.stringify([])) 
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
// modelContainer = document.querySelector('.modal-body');
depositExpenceModel = document.querySelector('.depositExpenceModel'),
generalModel = document.querySelector('.generalModel'),
done_btn = document.querySelector('.done_btn'),
tableTotalAmount = document.querySelector('.table-total-amount');

document.body.addEventListener('click', (e) => {

    // Show model to edit
    if(e.target.id == 'edit_btn') {
        const parent = e.target.parentElement;
        const id = parent.getAttribute('data-id');
        const editableData = MAIN_STORAGE.find(data => data.id == id);

        const model = `
                <form>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="amount">Amount</label>
                            <input type="number" class="form-control" id='updatedAmount' value='${editableData.amount}' placeholder="">
                        </div>
                        <div class="form-group">
                            <label for="amodescriptionunt">Description</label>
                            <input type="text" class="form-control"  id='updatedDescription' value='${editableData.description}'  placeholder="">
                        </div>
                    </div>
                </form>
                <div class="modal-footer">
                    <button type="button" class="btn border" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-dark" id='submitEditedData' data-id='${editableData.id}'>Save</button>
                </div>
                `
                generalModel.innerHTML = model
    }
    // Save edited data
    if(document.querySelector('#submitEditedData'))  {
        const saveBtn = document.querySelector('#submitEditedData');
        const updatedAmount = document.querySelector('#updatedAmount');
        const updatedDescription = document.querySelector('#updatedDescription');
        const id = saveBtn.getAttribute('data-id');

        saveBtn.addEventListener('click', () => {
            saveBtn.setAttribute('data-dismiss',"modal")
            MAIN_STORAGE.forEach(data => {
                if(data.id == id) {
                    data.amount = updatedAmount.value;
                    data.description = updatedDescription.value;
                }
            })
            localStorage.setItem('mainStorage', JSON.stringify(MAIN_STORAGE));

            updateTable();
            updateDashboard();
        })
    }
    
    // Confirm to delete
    if(e.target.id == 'delete_btn') {
        const parent = e.target.parentElement;
        const id = parent.getAttribute('data-id');
        console.log(id)
        const editableData = MAIN_STORAGE.find(data => data.id == id);
        const model = `
                    <div class="modal-content">
                        <div class="modal-body depositExpenceModel">
                            <h4>Are you sure?</h4>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn border" data-dismiss="modal">Cancel</button>
                            <button class="btn btn-dark" id='delete' data-id='${editableData.id}'>Yes</button>
                        </div>
                    </div>
                    `
        generalModel.innerHTML = model
    }

    // Delete data
    if(document.querySelector('#delete'))  {
        const yesBtn = document.querySelector('#delete');
        const id = yesBtn.getAttribute('data-id');
        yesBtn.addEventListener('click', () => {
            yesBtn.setAttribute('data-dismiss',"modal")
            let newData = MAIN_STORAGE.filter(data => data.id != id);
            MAIN_STORAGE = newData;

            localStorage.setItem('mainStorage', JSON.stringify(MAIN_STORAGE));
            updateTable();
            updateDashboard();
        })
    }
 })

const addDataToStorage = (e) => {
    e.preventDefault()

    const dataType = e.target.id;
    if(dateInput.value != '' && amountInput.value != '' && descriptionInput.value != '') {
        e.target.setAttribute('data-dismiss',"modal")
        const id = Math.floor(Math.random() * 100000000000);
        const expenseInfo = {
            id,
            type: dataType,
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
const showDataAddForm = (e) => {
    done_btn.id = e.target.id
}

done_btn.addEventListener('click', e => addDataToStorage(e));
depositBtn.addEventListener('click', e => showDataAddForm(e));
expenseBtn.addEventListener('click', e => showDataAddForm(e));

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
    
    let totalAmount = 0;
    dataToShow.forEach(data => {
        totalAmount += Number.parseInt(data.amount);
    });

    tableTotalAmount.innerText = '৳ ' + totalAmount

    return dataToShow;
}
   
const updateTable = () => {
    let html = ``;
    const allData = filtersData(timeRange.value, infoType.value);

    allData.forEach(data => {
            const { id, date, type, amount, description } = data;
            html += `
                    <tr class='${type}-row'>
                        <td class='p-md-3 p-2'>${date}</td>
                        <td  class='p-md-3 p-2'>${description}</td>
                        <td class="text-left p-md-3 p-2">৳ ${amount}</td>
                        <td class='tr-button p-md-3 p-2 '>
                            <button class="float-right mr-2" data-id='${id}'> <img class='delete_btn update_btn' id='delete_btn' data-toggle="modal" data-target="#changingModel" src="./images/delete.png" alt=""></button>
                            <button class=" float-right mr-2" data-id='${id}'><img class='edit_btn update_btn' id='edit_btn' data-toggle="modal" data-target="#changingModel" src="./images/edit.png" alt=""></button>
                        </td>
                    </tr>
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

    totalEarnings.innerText = `৳ ${totalDeposit}`;
    totalExpense.innerText = `৳ ${expenseSum}`;
    currentBalance.innerText = `৳ ${totalDeposit - expenseSum}`;
}
updateDashboard();

