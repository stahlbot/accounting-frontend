# Requirements
- npm
- [Accounting Backend](https://github.com/stahlbot/accounting-backend)

# Installation
1. Clone repo
2. `cd accounting`
3. `npm install`

# Start
1. backend should be running
2. `npm run dev`
3. navigate to `http://localhost:5173/`
4. Demodata is provided in a sqlite3 database. Login with username: "dennischlaeger", password: "accounting123"

# Features
- Create or edit account charts in the settings and link them to accounts. The account charts in the settings are used as a template
- Link accounts to a category (for balance sheet and profit-loss feature planned)
- Create a client and use an account chart as a template
- Add further individual accounts to a client or edit existing ones from the template
- Create Bookings that uses a credit and debit account
- Calculate the account balance
- Planned: Calculate a balance sheet and profit-loss based on the categories

