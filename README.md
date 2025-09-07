# Blockchain Credentials

A simple application for issuing and verifying academic credentials using a blockchain.

## First-Time Setup

1.  **Install Backend Dependencies:**

    ```bash
    npm install
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

## Running the Project

Each time you want to run the project, you will need to open four separate terminals.

1.  **Terminal 1: Start Local Blockchain**
    In the project root directory, run:

    ```bash
    npx hardhat node
    ```

2.  **Terminal 2: Deploy Smart Contracts**
    In the project root directory, run:

    ```bash
    npm run deploy
    ```

3.  **Terminal 3: Start Backend Server**
    In the project root directory, run:

    ```bash
    npm run dev
    ```

4.  **Terminal 4: Start Frontend Server**
    In the `frontend` directory, run:
    ```bash
    npm run dev
    ```
