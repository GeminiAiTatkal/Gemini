document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginContainer = document.getElementById('loginContainer');
    const mainPanelContainer = document.getElementById('mainPanelContainer');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const logoutButton = document.getElementById('logoutButton');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- Configuration (IMPORTANT: Replace with your actual GitHub details) ---
    // !!! IMPORTANT: NEVER expose your GitHub PAT directly in client-side code in a production environment.
    // This is for demonstration purposes ONLY.
    const GITHUB_TOKEN = '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'; // Replace with your token
    const REPO_OWNER = 'Gemini'; // Replace with your GitHub username
    const REPO_NAME = 'accest';       // Replace with your repository name
    const FILE_PATH = 'other.json';           // Path to the file for Key User data

    // --- Simulated Login Credentials ---
    // In a real application, these would be securely stored and validated on a backend server.
    const DEVELOPER_USERNAME = 'developer';
    const DEVELOPER_PASSWORD = 'password';

    // --- Functions for UI Messages ---
    function showMessage(element, msg, type) {
        element.textContent = msg;
        element.className = `message ${type}`;
        // Reset animation for re-triggering
        element.style.animation = 'none';
        void element.offsetWidth; // Trigger reflow
        element.style.animation = null;
    }

    function clearMessage(element) {
        element.textContent = '';
        element.className = 'message';
    }

    // --- Login / Logout Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (username === DEVELOPER_USERNAME && password === DEVELOPER_PASSWORD) {
            loginContainer.style.display = 'none';
            mainPanelContainer.style.display = 'block';
            showMessage(loginMessage, 'Login successful!', 'success');
            clearMessage(loginMessage); // Clear login message after successful login
        } else {
            showMessage(loginMessage, 'Invalid username or password.', 'error');
        }
    });

    logoutButton.addEventListener('click', () => {
        mainPanelContainer.style.display = 'none';
        loginContainer.style.display = 'flex'; // Show login container again
        document.getElementById('loginForm').reset(); // Clear login form
        clearMessage(loginMessage); // Clear any previous login messages
        // Reset to default tab
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('.tab-button[data-tab="developer"]').classList.add('active');
        document.getElementById('developerTab').classList.add('active');
    });

    // --- Tab Switching Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate clicked tab and its content
            button.classList.add('active');
            const targetTabId = button.dataset.tab + 'Tab';
            document.getElementById(targetTabId).classList.add('active');
        });
    });

    // --- Form Submission Handlers for Different Roles (Simulated) ---

    // Create Developer Form
    document.getElementById('createDeveloperForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const devUsername = document.getElementById('devUsername').value;
        const devPassword = document.getElementById('devPassword').value;
        // In a real app, this would send data to a backend to create a developer account.
        console.log(`Simulating creation of Developer: ${devUsername} with password: ${devPassword}`);
        showMessage(document.getElementById('devMessage'), `Developer '${devUsername}' created successfully (simulated)!`, 'success');
        e.target.reset(); // Clear form
    });

    // Create Master Form
    document.getElementById('createMasterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const masterUsername = document.getElementById('masterUsername').value;
        const masterPassword = document.getElementById('masterPassword').value;
        // In a real app, this would send data to a backend to create a master account.
        console.log(`Simulating creation of Master: ${masterUsername} with password: ${masterPassword}`);
        showMessage(document.getElementById('masterMessage'), `Master '${masterUsername}' created successfully (simulated)!`, 'success');
        e.target.reset(); // Clear form
    });

    // Create Admin Form
    document.getElementById('createAdminForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const adminUsername = document.getElementById('adminUsername').value;
        const adminPassword = document.getElementById('adminPassword').value;
        // In a real app, this would send data to a backend to create an admin account.
        console.log(`Simulating creation of Admin: ${adminUsername} with password: ${adminPassword}`);
        showMessage(document.getElementById('adminMessage'), `Admin '${adminUsername}' created successfully (simulated)!`, 'success');
        e.target.reset(); // Clear form
    });

    // Create Seller Form
    document.getElementById('createSellerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const sellerUsername = document.getElementById('sellerUsername').value;
        const sellerPassword = document.getElementById('sellerPassword').value;
        // In a real app, this would send data to a backend to create a seller account.
        console.log(`Simulating creation of Seller: ${sellerUsername} with password: ${sellerPassword}`);
        showMessage(document.getElementById('sellerMessage'), `Seller '${sellerUsername}' created successfully (simulated)!`, 'success');
        e.target.reset(); // Clear form
    });

    // --- Key User Data Form (Saves to GitHub) ---
    document.getElementById('userDataForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const userName = document.getElementById('userName').value;
        const password = document.getElementById('password').value;
        const deviceId = document.getElementById('deviceId').value;
        const expiryDateInput = document.getElementById('expiryDate').value;
        const keyUserMessageDiv = document.getElementById('keyUserMessage');

        // Format expiry date to "YYYY-MM-DD HH:MM:SS"
        const formattedExpiryDate = new Date(expiryDateInput).toISOString().slice(0, 19).replace('T', ' ');

        const userData = {
            user_name: userName,
            password: password,
            expiry_date: formattedExpiryDate,
            fingerprint_id: deviceId // Using deviceId as fingerprint_id as per your request
        };

        try {
            // First, try to get the existing file content and SHA
            const getFileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            let fileContent = [];
            let sha = null;

            if (getFileResponse.status === 200) {
                const fileData = await getFileResponse.json();
                sha = fileData.sha;
                const decodedContent = atob(fileData.content);
                try {
                    fileContent = JSON.parse(decodedContent);
                    // Ensure fileContent is an array
                    if (!Array.isArray(fileContent)) {
                        console.warn("Existing file content is not a valid JSON array, initializing as an empty array.");
                        fileContent = [];
                    }
                } catch (jsonError) {
                    console.warn("Existing file content is not valid JSON, initializing as empty array.", jsonError);
                    fileContent = [];
                }
            } else if (getFileResponse.status === 404) {
                console.log("File not found, creating new file.");
                // File does not exist, so no SHA and fileContent remains an empty array
            } else {
                const errorData = await getFileResponse.json();
                throw new Error(`Failed to get file content: ${errorData.message || getFileResponse.statusText}`);
            }

            // Check if user already exists and update, or add new
            const existingUserIndex = fileContent.findIndex(user => user.user_name === userName);

            if (existingUserIndex > -1) {
                fileContent[existingUserIndex] = userData; // Update existing user
            } else {
                fileContent.push(userData); // Add new user
            }

            const updatedContentBase64 = btoa(JSON.stringify(fileContent, null, 4)); // Pretty print JSON

            const commitData = {
                message: `Add/update key user data for ${userName}`,
                content: updatedContentBase64,
                sha: sha // Include SHA for updating existing file
            };

            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(commitData)
            });

            if (response.ok) {
                showMessage(keyUserMessageDiv, 'Key User data saved successfully to GitHub!', 'success');
                e.target.reset(); // Clear form
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to save Key User data to GitHub: ${errorData.message || response.statusText}`);
            }

        } catch (error) {
            console.error('Error saving Key User data:', error);
            showMessage(keyUserMessageDiv, `Error saving Key User data: ${error.message}`, 'error');
        }
    });
});
