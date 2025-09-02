document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const amountInput = document.getElementById('amount-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const expensesContainer = document.getElementById('expenses-container');

    let expenses = {};

    // ==== ADD EXPENSE BUTTON CLICK ====
    addBtn.addEventListener('click', () => {
        const category = categorySelect.value;
        const amount = Number(amountInput.value);
        const date = dateInput.value;

        // Validation
        if (!category || amount <= 0 || !date) {
            alert('Please fill all fields correctly.');
            return;
        }

        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.toLocaleString('default', { month: 'long' });

        // Check future year
        const currentYear = new Date().getFullYear();
        if (year > currentYear) {
            alert("You cannot enter an expense for a future year!");
            return;
        }

        // Store expense
        if (!expenses[year]) expenses[year] = [];
        expenses[year].push({ category, amount, date, year, month });

        renderTables();
        clearInputs();
    });

    // ==== RENDER ALL TABLES ====
    function renderTables() {
        expensesContainer.innerHTML = '';

        // Sort years from newest to oldest
        Object.keys(expenses).sort((a, b) => b - a).forEach(year => {
            const yearDiv = document.createElement('div');
            yearDiv.classList.add('year-block');
            yearDiv.innerHTML = `<h2>${year}</h2>`;

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Month</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector('tbody');
            let yearTotal = 0;

            expenses[year].forEach((expense, index) => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = expense.category;
                row.insertCell(1).textContent = expense.amount;
                row.insertCell(2).textContent = expense.date;
                row.insertCell(3).textContent = expense.month;

                yearTotal += expense.amount;

                const deleteCell = row.insertCell(4);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.onclick = () => {
                    expenses[year].splice(index, 1);
                    if (expenses[year].length === 0) delete expenses[year];
                    renderTables();
                };
                deleteCell.appendChild(deleteBtn);
            });

            // Add yearly total row
            const totalRow = tbody.insertRow();
            totalRow.classList.add('total-row');
            totalRow.innerHTML = `
                <td colspan="1"><strong>Total</strong></td>
                <td colspan="4"><strong>${yearTotal}</strong></td>
            `;

            yearDiv.appendChild(table);
            expensesContainer.appendChild(yearDiv);
        });
    }

    // ==== CLEAR INPUT FIELDS ====
    function clearInputs() {
        categorySelect.value = '';
        amountInput.value = '';
        dateInput.value = '';
    }
});
