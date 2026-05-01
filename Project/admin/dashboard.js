const API_URL = 'http://localhost:5000/api';

let products = [];
let inventory = [];
let sales = [];
let currentEditProductId = null;
let currentEditInventoryId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadAllData();
    setInterval(loadAllData, 5000); // Refresh every 5 seconds
});

function setupEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.dataset.tab;
            switchTab(tabName);
        });
    });

    // Product Form
    document.getElementById('addProductBtn').addEventListener('click', showProductForm);
    document.getElementById('cancelProductBtn').addEventListener('click', hideProductForm);
    document.getElementById('productFormElement').addEventListener('submit', handleProductSubmit);

    // Inventory Form
    document.getElementById('addInventoryBtn').addEventListener('click', showInventoryForm);
    document.getElementById('cancelInventoryBtn').addEventListener('click', hideInventoryForm);
    document.getElementById('inventoryFormElement').addEventListener('submit', handleInventorySubmit);

    // Sales Form
    document.getElementById('addSaleBtn').addEventListener('click', showSaleForm);
    document.getElementById('cancelSaleBtn').addEventListener('click', hideSaleForm);
    document.getElementById('saleFormElement').addEventListener('submit', handleSaleSubmit);

    // Set today's date in sale form
    document.getElementById('saleDate').valueAsDate = new Date();
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabName) {
            item.classList.add('active');
        }
    });
}

// Load all data
async function loadAllData() {
    try {
        const [productsRes, inventoryRes, salesRes] = await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/inventory`),
            fetch(`${API_URL}/sales`)
        ]);

        if (productsRes.ok) products = await productsRes.json();
        if (inventoryRes.ok) inventory = await inventoryRes.json();
        if (salesRes.ok) sales = await salesRes.json();

        updateDashboard();
        renderProductsTable();
        renderInventoryTable();
        renderSalesTable();
        populateProductSelects();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Dashboard
function updateDashboard() {
    document.getElementById('totalProducts').textContent = products.length;
    
    const totalQty = inventory.reduce((sum, inv) => sum + inv.quantity, 0);
    document.getElementById('totalInventory').textContent = totalQty;

    const totalSalesPrice = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    document.getElementById('totalSales').textContent = '$' + totalSalesPrice.toFixed(2);

    const lowStockCount = inventory.filter(inv => inv.quantity <= inv.minimumStock).length;
    document.getElementById('lowStockCount').textContent = lowStockCount;

    renderRecentSales();
}

function renderRecentSales() {
    const recentList = document.getElementById('recentSalesList');
    const recentSales = sales.slice(0, 5);

    if (recentSales.length === 0) {
        recentList.innerHTML = '<p class="no-data">No sales yet</p>';
        return;
    }

    recentList.innerHTML = recentSales.map(sale => {
        const product = products.find(p => p._id === sale.productId._id);
        const productName = product ? product.name : 'Unknown';
        const date = new Date(sale.saleDate).toLocaleDateString();

        return `
            <div class="sales-item">
                <div class="sales-item-header">
                    <span class="sales-item-product">${productName}</span>
                    <span class="sales-item-price">$${sale.totalPrice.toFixed(2)}</span>
                </div>
                <div class="sales-item-meta">
                    ${sale.quantity} units • ${sale.customerName || 'N/A'} • ${date}
                </div>
            </div>
        `;
    }).join('');
}

// Products
function showProductForm() {
    currentEditProductId = null;
    document.getElementById('productFormElement').reset();
    document.getElementById('productForm').style.display = 'block';
}

function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value
    };

    try {
        if (currentEditProductId) {
            // Update
            await fetch(`${API_URL}/products/${currentEditProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Create
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        hideProductForm();
        loadAllData();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product');
    }
}

function renderProductsTable() {
    const tbody = document.querySelector('#productsTable tbody');

    if (products.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="5">No products yet</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.unit}</td>
            <td>${product.description || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editProduct('${product._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    currentEditProductId = id;
    const product = products.find(p => p._id === id);

    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productUnit').value = product.unit;

    document.getElementById('productForm').style.display = 'block';
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;

    try {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        loadAllData();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Inventory
function showInventoryForm() {
    document.getElementById('inventoryFormElement').reset();
    document.getElementById('inventoryForm').style.display = 'block';
}

function hideInventoryForm() {
    document.getElementById('inventoryForm').style.display = 'none';
}

async function handleInventorySubmit(e) {
    e.preventDefault();

    const inventoryData = {
        productId: document.getElementById('inventoryProduct').value,
        quantity: parseInt(document.getElementById('inventoryQuantity').value),
        minimumStock: parseInt(document.getElementById('inventoryMinimum').value),
        location: document.getElementById('inventoryLocation').value
    };

    try {
        if (currentEditInventoryId) {
            // Update
            await fetch(`${API_URL}/inventory/${currentEditInventoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inventoryData)
            });
        } else {
            // Create
            await fetch(`${API_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inventoryData)
            });
        }

        hideInventoryForm();
        currentEditInventoryId = null;
        loadAllData();
    } catch (error) {
        console.error('Error saving inventory:', error);
        alert('Error saving inventory');
    }
}

function renderInventoryTable() {
    const tbody = document.querySelector('#inventoryTable tbody');

    if (inventory.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="6">No inventory yet</td></tr>';
        return;
    }

    tbody.innerHTML = inventory.map(inv => {
        const product = inv.productId;
        const status = inv.quantity > inv.minimumStock ? 'status-ok' : inv.quantity > 0 ? 'status-low' : 'status-critical';
        const statusText = inv.quantity > inv.minimumStock ? 'OK' : inv.quantity > 0 ? 'Low' : 'Critical';

        return `
            <tr>
                <td>${product.name}</td>
                <td>${inv.quantity}</td>
                <td>${inv.minimumStock}</td>
                <td>${inv.location || '-'}</td>
                <td><span class="status-badge ${status}">${statusText}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="editInventory('${inv._id}', '${product._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteInventory('${product._id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function editInventory(id, productId) {
    currentEditInventoryId = productId;
    const inv = inventory.find(i => i._id === id);

    document.getElementById('inventoryProduct').value = productId;
    document.getElementById('inventoryQuantity').value = inv.quantity;
    document.getElementById('inventoryMinimum').value = inv.minimumStock;
    document.getElementById('inventoryLocation').value = inv.location || '';

    document.getElementById('inventoryForm').style.display = 'block';
}

async function deleteInventory(productId) {
    if (!confirm('Delete this inventory entry?')) return;

    try {
        await fetch(`${API_URL}/inventory/${productId}`, { method: 'DELETE' });
        loadAllData();
    } catch (error) {
        console.error('Error deleting inventory:', error);
    }
}

// Sales
function showSaleForm() {
    document.getElementById('saleFormElement').reset();
    document.getElementById('saleDate').valueAsDate = new Date();
    document.getElementById('saleForm').style.display = 'block';
}

function hideSaleForm() {
    document.getElementById('saleForm').style.display = 'none';
}

async function handleSaleSubmit(e) {
    e.preventDefault();

    const saleData = {
        productId: document.getElementById('saleProduct').value,
        quantity: parseInt(document.getElementById('saleQuantity').value),
        totalPrice: parseFloat(document.getElementById('saleTotalPrice').value),
        customerName: document.getElementById('saleCustomerName').value,
        notes: document.getElementById('saleNotes').value
    };

    try {
        await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        hideSaleForm();
        loadAllData();
    } catch (error) {
        console.error('Error recording sale:', error);
        alert('Error recording sale');
    }
}

function renderSalesTable() {
    const tbody = document.querySelector('#salesTable tbody');

    if (sales.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="6">No sales yet</td></tr>';
        return;
    }

    tbody.innerHTML = sales.map(sale => {
        const product = products.find(p => p._id === sale.productId._id);
        const productName = product ? product.name : 'Unknown';
        const date = new Date(sale.saleDate).toLocaleDateString();

        return `
            <tr>
                <td>${productName}</td>
                <td>${sale.quantity}</td>
                <td>$${sale.totalPrice.toFixed(2)}</td>
                <td>${sale.customerName || '-'}</td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteSale('${sale._id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function deleteSale(id) {
    if (!confirm('Delete this sale?')) return;

    try {
        await fetch(`${API_URL}/sales/${id}`, { method: 'DELETE' });
        loadAllData();
    } catch (error) {
        console.error('Error deleting sale:', error);
    }
}

// Populate Product Selects
function populateProductSelects() {
    const productSelects = ['inventoryProduct', 'saleProduct'];

    productSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">Select a product</option>';
        select.innerHTML += products.map(p => 
            `<option value="${p._id}">${p.name}</option>`
        ).join('');

        select.value = currentValue;
    });
}
