class UserManager {
    constructor() {
        this.users = [];
        this.originalUsers = [];
        this.isDataLoaded = false;
        this.init();
    }

    // ES6: Arrow function and template literals
    init = () => {
        this.loadBtn = document.getElementById('loadBtn');
        this.tableContainer = document.getElementById('tableContainer');
        this.userTableBody = document.getElementById('userTableBody');
        
        this.loadBtn.addEventListener('click', this.handleLoadClick);
        this.setupInitialData();
    }

    // ES6: Arrow function with destructuring
    setupInitialData = () => {
        // Sample JSON data stored in code
        this.originalUsers = [
            {
                id: 1,
                firstName: 'John',
                middleName: 'Michael',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+1-555-0123',
                role: 'Software Developer',
                address: '123 Main St, New York, NY 10001'
            },
            {
                id: 2,
                firstName: 'Jane',
                middleName: 'Elizabeth',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                phoneNumber: '+1-555-0456',
                role: 'Product Manager',
                address: '456 Oak Ave, Los Angeles, CA 90210'
            },
            {
                id: 3,
                firstName: 'Robert',
                middleName: 'James',
                lastName: 'Johnson',
                email: 'robert.johnson@example.com',
                phoneNumber: '+1-555-0789',
                role: 'UX Designer',
                address: '789 Pine St, Chicago, IL 60601'
            },
            {
                id: 4,
                firstName: 'Emily',
                middleName: 'Rose',
                lastName: 'Davis',
                email: 'emily.davis@example.com',
                phoneNumber: '+1-555-0987',
                role: 'Data Analyst',
                address: '321 Elm St, Houston, TX 77001'
            },
            {
                id: 5,
                firstName: 'Michael',
                middleName: 'Andrew',
                lastName: 'Wilson',
                email: 'michael.wilson@example.com',
                phoneNumber: '+1-555-0654',
                role: 'DevOps Engineer',
                address: '654 Maple Dr, Phoenix, AZ 85001'
            }
        ];
    }

    // ES6: Arrow function with ternary operator
    handleLoadClick = () => {
        if (!this.isDataLoaded) {
            this.loadData();
        } else {
            this.refreshData();
        }
    }

    // ES6: Spread operator and const/let
    loadData = () => {
        // Using spread operator to create a copy
        this.users = [...this.originalUsers];
        this.renderTable();
        this.showTable();
        this.updateButton();
        this.isDataLoaded = true;
    }

    refreshData = () => {
        this.users = [...this.originalUsers];
        this.renderTable();
    }

    showTable = () => {
        this.tableContainer.style.display = 'block';
    }

    updateButton = () => {
        this.loadBtn.textContent = this.isDataLoaded ? 'Refresh Data' : 'Load Data';
    }

    // ES6: Template literals and map function
    renderTable = () => {
        const tableRows = this.users.map(user => this.createTableRow(user)).join('');
        this.userTableBody.innerHTML = tableRows;
        this.attachEventListeners();
    }

    // ES6: Template literals and destructuring
    createTableRow = (user) => {
        const { id, firstName, middleName, lastName, email, phoneNumber, role, address } = user;
        
        return `
            <tr data-user-id="${id}">
                <td data-field="firstName">${firstName}</td>
                <td data-field="middleName">${middleName}</td>
                <td data-field="lastName">${lastName}</td>
                <td data-field="email">${email}</td>
                <td data-field="phoneNumber">${phoneNumber}</td>
                <td data-field="role">${role}</td>
                <td data-field="address">${address}</td>
                <td class="actions">
                    <button class="action-btn edit-btn" onclick="userManager.editUser(${id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="userManager.deleteUser(${id})">Delete</button>
                </td>
            </tr>
        `;
    }

    attachEventListeners = () => {
        // Using event delegation for better performance
        this.userTableBody.addEventListener('click', this.handleTableClick);
    }

    // ES6: Arrow function with event handling
    handleTableClick = (event) => {
        const { target } = event;
        
        if (target.classList.contains('edit-btn')) {
            const userId = parseInt(target.closest('tr').dataset.userId);
            this.editUser(userId);
        } else if (target.classList.contains('delete-btn')) {
            const userId = parseInt(target.closest('tr').dataset.userId);
            this.deleteUser(userId);
        } else if (target.classList.contains('save-btn')) {
            const userId = parseInt(target.closest('tr').dataset.userId);
            this.saveUser(userId);
        } else if (target.classList.contains('cancel-btn')) {
            const userId = parseInt(target.closest('tr').dataset.userId);
            this.cancelEdit(userId);
        }
    }

    // ES6: Find method and querySelector
    editUser = (userId) => {
        const row = document.querySelector(`tr[data-user-id="${userId}"]`);
        const user = this.users.find(u => u.id === userId);
        
        if (!row || !user) return;

        row.classList.add('editing');
        
        // Convert cells to input fields
        const fields = ['firstName', 'middleName', 'lastName', 'email', 'phoneNumber', 'role', 'address'];
        
        fields.forEach(field => {
            const cell = row.querySelector(`td[data-field="${field}"]`);
            const currentValue = user[field];
            cell.innerHTML = `<input type="text" class="editable-input" value="${currentValue}" data-original-value="${currentValue}">`;
        });

        // Update action buttons
        const actionsCell = row.querySelector('.actions');
        actionsCell.innerHTML = `
            <button class="action-btn save-btn">Save</button>
            <button class="action-btn cancel-btn">Cancel</button>
        `;
    }

    // ES6: Object property shorthand and find method
    saveUser = (userId) => {
        const row = document.querySelector(`tr[data-user-id="${userId}"]`);
        const user = this.users.find(u => u.id === userId);
        
        if (!row || !user) return;

        // Get updated values from inputs
        const inputs = row.querySelectorAll('.editable-input');
        const updatedUser = { ...user };

        inputs.forEach(input => {
            const field = input.closest('td').dataset.field;
            updatedUser[field] = input.value.trim();
        });

        // Update user in array
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = updatedUser;
        }

        // Re-render the specific row
        this.renderSingleRow(userId);
    }

    cancelEdit = (userId) => {
        this.renderSingleRow(userId);
    }

    // ES6: Template literals and find method
    renderSingleRow = (userId) => {
        const user = this.users.find(u => u.id === userId);
        const row = document.querySelector(`tr[data-user-id="${userId}"]`);
        
        if (!row || !user) return;

        row.outerHTML = this.createTableRow(user);
    }

    // ES6: Filter method and arrow function
    deleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            this.users = this.users.filter(user => user.id !== userId);
            const row = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (row) {
                row.remove();
            }
        }
    }
}

// ES6: Class instantiation with const
const userManager = new UserManager();

// ES6: Enhanced object methods
const utils = {
    // ES6: Arrow function in object
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // ES6: Default parameters
    formatPhoneNumber: (phone, format = 'us') => {
        // Basic phone formatting logic
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },

    // ES6: Rest parameters
    logActivity: (...activities) => {
        activities.forEach(activity => console.log(`Activity: ${activity}`));
    }
};

// ES6: Destructuring assignment example
const { validateEmail, formatPhoneNumber } = utils;

// ES6: Async/await example for future API integration
const apiService = {
    // ES6: Async function
    fetchUsers: async () => {
        try {
            // This would be an actual API call in real implementation
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(userManager.originalUsers);
                }, 1000);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
};

// ES6: Module pattern with IIFE and let/const
(() => {
    const appConfig = {
        version: '1.0.0',
        author: 'Student Developer',
        features: ['CRUD Operations', 'ES6 Concepts', 'Responsive Design']
    };

    console.log('App initialized with config:', appConfig);
})();
