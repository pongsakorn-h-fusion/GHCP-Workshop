# Task 9: Prepare Initial Test Data

**Role**: QA (Quality Assurance)
**Estimated Time**: 2-3 hours
**Feature**: General Copilot Usage

---

## Objective

Create comprehensive test data sets and generation tools to support thorough testing across all environments and scenarios.

## Prerequisites

- Understanding of application data model
- Access to development database
- Knowledge of test scenarios
- Node.js and npm installed (for data generation scripts)

---

## Overview

This task creates:
1. **Test Data Requirements** - Documentation of needed test data
2. **Data Generation Scripts** - Automated test data creation
3. **Manual Test Fixtures** - Predefined test data files
4. **Edge Case Data** - Special test scenarios
5. **Test Files** - Files for upload testing
6. **Database Seeder** - Tool to populate test database

---

## Step 1: Analyze Data Requirements

### 1.1 Create Requirements Document

Create `docs/TEST_DATA_REQUIREMENTS.md`:

````markdown
# Test Data Requirements

## Overview

This document outlines the test data needed for comprehensive testing.

## User Data

### Test User Accounts

| Role | Username | Email | Password | Purpose |
|------|----------|-------|----------|---------|
| Admin | admin_test | admin@test.com | Admin123! | Admin functionality testing |
| User | user_test | user@test.com | User123! | Standard user testing |
| Premium | premium_test | premium@test.com | Premium123! | Premium features testing |
| Inactive | inactive_test | inactive@test.com | Inactive123! | Inactive account testing |
| Locked | locked_test | locked@test.com | Locked123! | Account lockout testing |

### User Profiles

- Complete profiles (all fields filled)
- Incomplete profiles (missing optional fields)
- Profiles with special characters
- Profiles with maximum field lengths
- Profiles with minimum field lengths

## Product Data

### Test Products

| ID | Name | Price | Stock | Status | Category |
|----|------|-------|-------|--------|----------|
| PROD-001 | Test Product 1 | $10.00 | 100 | Active | Electronics |
| PROD-002 | Test Product 2 | $20.00 | 0 | Active | Books |
| PROD-003 | Test Product 3 | $30.00 | 50 | Inactive | Clothing |
| PROD-004 | Test Product 4 | $999.99 | 1 | Active | Electronics |
| PROD-005 | Test Product 5 | $0.01 | 1000 | Active | Digital |

### Edge Case Products

- Product with max price (edge case)
- Product with zero stock
- Product with special characters in name
- Product with very long description
- Product with no image
- Product with multiple images

## Transaction Data

### Test Orders

- Successful orders
- Failed orders
- Pending orders
- Cancelled orders
- Refunded orders
- Orders with multiple items
- Orders with single item
- High-value orders
- Low-value orders

## File Upload Data

### Test Files

| File Type | Size | Purpose |
|-----------|------|---------|
| image.jpg | 50KB | Standard image upload |
| large.jpg | 10MB | Large file testing |
| doc.pdf | 1MB | Document upload |
| empty.txt | 0KB | Empty file testing |
| malicious.exe | - | Security testing (blocked) |

## Data Volume Requirements

### Performance Testing Data

- 1,000 users
- 10,000 products
- 50,000 orders
- 100,000 transactions

## Data Refresh Strategy

- **Frequency**: Before each test cycle
- **Method**: Automated script
- **Backup**: Daily backup of test data
- **Cleanup**: After each test run (optional)

## Data Privacy

⚠️ **Important**:
- No real user data in test environment
- All test data is synthetic/anonymized
- No real credit card numbers
- No real personal information

## Data Generation Tools

- **Faker.js** - Generate fake user data
- **mockaroo.com** - Generate CSV data
- **Custom scripts** - Generate domain-specific data
````

### 1.2 Save Documentation

```bash
git add docs/TEST_DATA_REQUIREMENTS.md
git commit -m "docs: Add test data requirements specification"
git push
```

---

## Step 2: Create Test Data Generation Scripts

### 2.1 Create Directory Structure

```bash
mkdir -p tests/data
mkdir -p tests/fixtures
mkdir -p tests/scripts
mkdir -p tests/test-files
```

### 2.2 Install Faker.js

```bash
# Install faker for data generation
npm install --save-dev @faker-js/faker
```

### 2.3 Create User Data Generator

Create `tests/scripts/generate-users.js`:

````javascript
/**
 * Generate test user data using Faker
 */
const { faker } = require('@faker-js/faker');
const fs = require('fs');

function generateUsers(count = 100) {
  const users = [];

  // Add predefined test users
  const testUsers = [
    {
      id: 1,
      username: 'admin_test',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2025-01-01').toISOString()
    },
    {
      id: 2,
      username: 'user_test',
      email: 'user@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      status: 'active',
      createdAt: new Date('2025-01-01').toISOString()
    },
    {
      id: 3,
      username: 'inactive_test',
      email: 'inactive@test.com',
      firstName: 'Inactive',
      lastName: 'User',
      role: 'user',
      status: 'inactive',
      createdAt: new Date('2025-01-01').toISOString()
    }
  ];

  users.push(...testUsers);

  // Generate random users
  for (let i = 4; i <= count; i++) {
    const user = {
      id: i,
      username: faker.internet.userName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(['user', 'user', 'user', 'premium']),
      status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      },
      bio: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent().toISOString()
    };
    users.push(user);
  }

  return users;
}

function saveToFile(users, filename = 'users.json') {
  const filePath = `./tests/fixtures/${filename}`;
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  console.log(`✅ Generated ${users.length} users`);
  console.log(`📝 Saved to: ${filePath}`);
}

function saveToSQL(users, filename = 'users.sql') {
  const filePath = `./tests/fixtures/${filename}`;
  let sql = '-- Test Users Data\n\n';
  sql += 'INSERT INTO users (id, username, email, first_name, last_name, role, status, created_at) VALUES\n';

  const values = users.map((user, index) => {
    const isLast = index === users.length - 1;
    return `  (${user.id}, '${user.username}', '${user.email}', '${user.firstName}', '${user.lastName}', '${user.role}', '${user.status}', '${user.createdAt}')${isLast ? ';' : ','}`;
  });

  sql += values.join('\n');
  fs.writeFileSync(filePath, sql);
  console.log(`📝 Saved SQL to: ${filePath}`);
}

// Generate users
const users = generateUsers(100);

// Save in different formats
saveToFile(users, 'users.json');
saveToSQL(users, 'users.sql');

// Save CSV format
const csv = [
  'id,username,email,firstName,lastName,role,status',
  ...users.map(u => `${u.id},${u.username},${u.email},${u.firstName},${u.lastName},${u.role},${u.status}`)
].join('\n');
fs.writeFileSync('./tests/fixtures/users.csv', csv);
console.log('📝 Saved CSV to: ./tests/fixtures/users.csv');

module.exports = { generateUsers };
````

### 2.4 Create Product Data Generator

Create `tests/scripts/generate-products.js`:

````javascript
/**
 * Generate test product data
 */
const { faker } = require('@faker-js/faker');
const fs = require('fs');

function generateProducts(count = 50) {
  const products = [];
  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports', 'Toys'];

  for (let i = 1; i <= count; i++) {
    const product = {
      id: i,
      sku: `PROD-${String(i).padStart(5, '0')}`,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
      cost: parseFloat(faker.commerce.price({ min: 0.5, max: 500 })),
      stock: faker.number.int({ min: 0, max: 1000 }),
      category: faker.helpers.arrayElement(categories),
      brand: faker.company.name(),
      weight: faker.number.float({ min: 0.1, max: 50, precision: 0.1 }),
      dimensions: {
        length: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
        width: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
        height: faker.number.float({ min: 1, max: 100, precision: 0.1 })
      },
      images: [
        faker.image.url(),
        faker.image.url()
      ],
      status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
      featured: faker.datatype.boolean({ probability: 0.2 }),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      reviewCount: faker.number.int({ min: 0, max: 500 }),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent().toISOString()
    };
    products.push(product);
  }

  return products;
}

function saveProducts(products) {
  // JSON format
  fs.writeFileSync(
    './tests/fixtures/products.json',
    JSON.stringify(products, null, 2)
  );
  console.log(`✅ Generated ${products.length} products`);
  console.log('📝 Saved to: ./tests/fixtures/products.json');

  // CSV format
  const csv = [
    'id,sku,name,price,stock,category,status',
    ...products.map(p => `${p.id},${p.sku},"${p.name}",${p.price},${p.stock},${p.category},${p.status}`)
  ].join('\n');
  fs.writeFileSync('./tests/fixtures/products.csv', csv);
  console.log('📝 Saved CSV to: ./tests/fixtures/products.csv');
}

const products = generateProducts(50);
saveProducts(products);

module.exports = { generateProducts };
````

### 2.5 Create Database Seeder

Create `tests/scripts/seed-database.js`:

````javascript
/**
 * Seed test database with test data
 */
const { generateUsers } = require('./generate-users');
const { generateProducts } = require('./generate-products');

async function seedDatabase() {
  console.log('🌱 Seeding database...\n');

  try {
    // Generate data
    console.log('📊 Generating data...');
    const users = generateUsers(100);
    const products = generateProducts(50);

    console.log('\n✅ Data generation complete!');
    console.log(`   - ${users.length} users`);
    console.log(`   - ${products.length} products`);

    // Here you would insert into your actual database
    // Example with PostgreSQL:
    /*
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await client.connect();

    // Insert users
    for (const user of users) {
      await client.query(
        'INSERT INTO users (id, username, email, first_name, last_name, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.id, user.username, user.email, user.firstName, user.lastName, user.role, user.status]
      );
    }

    await client.end();
    */

    console.log('\n🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
````

### 2.6 Add NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:data:generate": "node tests/scripts/generate-users.js && node tests/scripts/generate-products.js",
    "test:data:seed": "node tests/scripts/seed-database.js",
    "test:data:clean": "rm -rf tests/fixtures/*.json tests/fixtures/*.csv tests/fixtures/*.sql"
  },
  "devDependencies": {
    "@faker-js/faker": "^8.0.0"
  }
}
```

---

## Step 3: Create Manual Test Fixtures

### 3.1 Create Predefined Test Users

Create `tests/fixtures/test-users-manual.json`:

```json
[
  {
    "id": 1,
    "username": "admin_test",
    "email": "admin@test.com",
    "password": "Admin123!",
    "role": "admin",
    "status": "active"
  },
  {
    "id": 2,
    "username": "user_test",
    "email": "user@test.com",
    "password": "User123!",
    "role": "user",
    "status": "active"
  },
  {
    "id": 3,
    "username": "premium_test",
    "email": "premium@test.com",
    "password": "Premium123!",
    "role": "premium",
    "status": "active"
  }
]
```

### 3.2 Create Edge Case Data

Create `tests/fixtures/edge-cases.json`:

```json
{
  "users": {
    "emptyUsername": {
      "username": "",
      "email": "test@test.com"
    },
    "longUsername": {
      "username": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "email": "long@test.com"
    },
    "specialChars": {
      "username": "user<>\"'&",
      "email": "special@test.com"
    },
    "sqlInjection": {
      "username": "admin' OR '1'='1",
      "email": "sql@test.com"
    }
  },
  "products": {
    "zeroPriceProduct": {
      "name": "Free Product",
      "price": 0,
      "stock": 100
    },
    "negativeStock": {
      "name": "Negative Stock",
      "price": 10.00,
      "stock": -5
    },
    "maxPrice": {
      "name": "Expensive Product",
      "price": 999999.99,
      "stock": 1
    }
  }
}
```

---

## Step 4: Create Test Files

### 4.1 Create Test Files for Upload

```bash
# Navigate to test-files directory
cd tests/test-files

# Create standard text file
echo "This is a test file for upload testing" > test-file.txt

# Create empty file
touch empty-file.txt

# Create large file (10MB)
dd if=/dev/zero of=large-file.bin bs=1M count=10

# Create sample CSV
echo "id,name,value\n1,Test1,100\n2,Test2,200" > sample.csv

# Return to project root
cd ../..
```

---

## Step 5: Create Test Data Documentation

### 5.1 Create Usage Guide

Create `tests/README.md`:

````markdown
# Test Data Documentation

## Overview

This directory contains all test data, fixtures, and data generation scripts.

## Directory Structure

```
tests/
├── data/              # Raw test data files
├── fixtures/          # Generated test fixtures
├── test-files/        # Test files for upload testing
└── scripts/           # Data generation scripts
```

## Test Users

### Predefined Test Accounts

| Username | Email | Password | Role | Purpose |
|----------|-------|----------|------|---------|
| admin_test | admin@test.com | Admin123! | admin | Admin testing |
| user_test | user@test.com | User123! | user | User testing |
| premium_test | premium@test.com | Premium123! | premium | Premium features |

**Note**: These passwords are for testing only. Never use in production!

## Generating Test Data

### Generate New Test Data

```bash
# Generate users and products
npm run test:data:generate

# Seed database
npm run test:data:seed

# Clean up generated files
npm run test:data:clean
```

### Using Generated Data

```javascript
// In your tests
const users = require('./tests/fixtures/users.json');
const products = require('./tests/fixtures/products.json');

describe('User Tests', () => {
  it('should use test data', () => {
    const testUser = users[0];
    // Use testUser in your test
  });
});
```

## Manual Test Data

### Loading Fixtures in Tests

```javascript
const testUsers = require('./tests/fixtures/test-users-manual.json');

beforeEach(async () => {
  // Load test users into test database
  await database.users.insertMany(testUsers);
});

afterEach(async () => {
  // Clean up
  await database.users.deleteMany({});
});
```

## Edge Cases

Edge case data is available in `fixtures/edge-cases.json`:

```javascript
const edgeCases = require('./tests/fixtures/edge-cases.json');

it('should handle empty username', () => {
  const result = validateUser(edgeCases.users.emptyUsername);
  expect(result.valid).toBe(false);
});
```

## Test Files

Test files for upload testing are in `test-files/`:

- `test-file.txt` - Standard text file
- `empty-file.txt` - Empty file (0 bytes)
- `large-file.bin` - Large file (10MB)
- `sample.csv` - Sample CSV file

## Data Privacy

⚠️ **Important**:
- ALL test data is synthetic/fake
- NEVER use real user data
- NEVER commit real credentials
- Test data is for testing environments only

## Refreshing Test Data

Test data should be refreshed:
- Before each test cycle
- After major schema changes
- Weekly (automated)

## Contributing

When adding new test data:
1. Document the purpose
2. Use faker.js for generation
3. Provide examples
4. Update this README
````

---

## Step 6: Generate Initial Test Data

### 6.1 Run Data Generation

```bash
# Install dependencies
npm install --save-dev @faker-js/faker

# Generate test data
npm run test:data:generate

# Verify files created
ls -la tests/fixtures/
```

**Expected Output**:
```
✅ Generated 100 users
📝 Saved to: ./tests/fixtures/users.json
📝 Saved SQL to: ./tests/fixtures/users.sql
📝 Saved CSV to: ./tests/fixtures/users.csv
✅ Generated 50 products
📝 Saved to: ./tests/fixtures/products.json
📝 Saved CSV to: ./tests/fixtures/products.csv
```

---

## Step 7: Commit Test Data Infrastructure

### 7.1 Commit All Files

```bash
# Add test data infrastructure
git add tests/
git add docs/TEST_DATA_REQUIREMENTS.md

# Commit
git commit -m "test: Add test data generation infrastructure with faker.js"

# Push
git push
```

---

## Step 8: Validation

### 8.1 Validation Checklist

**Documentation**:
- [ ] Test data requirements documented
- [ ] Usage guide created (tests/README.md)
- [ ] NPM scripts added to package.json

**Generation Scripts**:
- [ ] User data generator created
- [ ] Product data generator created
- [ ] Database seeder created
- [ ] All scripts run without errors

**Test Data**:
- [ ] 100+ test users generated
- [ ] 50+ test products generated
- [ ] Edge case data created
- [ ] Manual test fixtures created
- [ ] Test files created

**Quality**:
- [ ] Data is realistic and varied
- [ ] Edge cases covered
- [ ] Team can generate data easily
- [ ] Data follows privacy guidelines

### 8.2 Test Data Generation

```bash
# Test generation
npm run test:data:generate

# Verify files exist
ls tests/fixtures/users.json
ls tests/fixtures/products.json

# Check file contents
head -20 tests/fixtures/users.json
```

### 8.3 Test in Application

1. Load test data into test database
2. Verify application works with test data
3. Test edge cases
4. Confirm no issues with special characters or boundary values

---

## Deliverables

✅ **Completed Items**:
1. Test data requirements document
2. User data generator script
3. Product data generator script
4. Database seeder script
5. Manual test fixtures (users, edge cases)
6. Test files for upload testing
7. Comprehensive usage documentation
8. Generated test data (100 users, 50 products)

---

## Success Metrics

- **Automation**: Test data generation fully automated
- **Coverage**: Edge cases and boundary values covered
- **Availability**: 100+ test users, 50+ test products available
- **Ease of Use**: Team can generate fresh data on demand
- **Quality**: Data is realistic and useful for testing

---

## Next Steps

1. ✅ Test data infrastructure complete
2. → Train team on data generation
3. → Integrate with test suites
4. → Set up automated data refresh
5. → Begin comprehensive testing with new data
6. → Phase 1 Complete! Proceed to Phase 2

---

## Best Practices

### DO ✅

- Refresh test data regularly
- Use faker.js for realistic data
- Document test user credentials
- Keep test data separate from production
- Version control generation scripts
- Test edge cases thoroughly

### DON'T ❌

- Use real user data
- Commit actual passwords
- Mix test and production data
- Forget to clean up after tests
- Use production database for testing
- Share test credentials publicly

---

**Related Tasks**:
- Previous: [Task 8: Define Bug Severity Levels](Task-08-QA-Bug-Severity.md)
- All Phase 1 Tasks Complete!
- Next Phase: [Phase 2: CI/CD and Environments](../../Phase2/)

---

**Prepared by**: QA Team
**Last Updated**: November 2025
**Version**: 1.0
