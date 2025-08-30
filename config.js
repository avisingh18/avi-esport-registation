// Google Sheets Configuration
const CONFIG = {
    // Replace with your Google Apps Script Web App URL
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
    
    // Sheet names for different data
    SHEETS: {
        USERS: 'Users',
        MATCHES: 'Matches'
    }
};

// Google Sheets API functions
async function saveToGoogleSheets(data) {
    try {
        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save to Google Sheets');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Google Sheets Error:', error);
        throw error;
    }
}

async function getFromGoogleSheets(action, params = {}) {
    try {
        const url = new URL(CONFIG.GOOGLE_SCRIPT_URL);
        url.searchParams.append('action', action);
        
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch from Google Sheets');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Google Sheets Error:', error);
        throw error;
    }
}