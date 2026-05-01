# Cross County Material Backend

Backend API for managing products, inventory, and contact submissions.

## Setup

1. **Install MongoDB** and ensure it's running
2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

Server runs on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - Get all inventory
- `GET /api/inventory/:productId` - Get inventory for product
- `POST /api/inventory` - Create inventory entry
- `PUT /api/inventory/:productId` - Update inventory
- `DELETE /api/inventory/:productId` - Delete inventory entry

### Contact Submissions
- `GET /api/contacts` - Get all submissions
- `GET /api/contacts/:id` - Get single submission
- `POST /api/contacts` - Submit contact form
- `DELETE /api/contacts/:id` - Delete submission

## Sample Product Creation

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sand",
    "description": "Finest Sand in the delta",
    "price": 8.00,
    "unit": "Yard"
  }'
```
