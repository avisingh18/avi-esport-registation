let selectedMatch = null;

function selectMatch(matchType) {
    // Remove previous selection
    document.querySelectorAll('.match-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.match-card').classList.add('selected');
    
    // Store selected match type
    selectedMatch = matchType;
    
    // Enable apply button
    document.getElementById('applyBtn').disabled = false;
    
    console.log('Selected match type:', matchType);
}

// Apply button click handler
document.getElementById('applyBtn').addEventListener('click', async function() {
    if (selectedMatch) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please login first!');
            window.location.href = 'login.html';
            return;
        }
        
        const matchData = {
            action: 'match',
            username: currentUser.username,
            gamertag: currentUser.gamertag,
            matchType: selectedMatch,
            appliedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('matchApplication', JSON.stringify(matchData));
        
        // Try to save to Google Sheets
        try {
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxs5yO6ZYX-hCDN3F8n3DnKN2z7V6S7IYiw5m0-2PQcpyJJ-sF-nNdMDW9Yzbs-CM9G/exec';
            
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(matchData)
            });
            
            console.log('Match data sent to Google Sheets');
        } catch (error) {
            console.log('Google Sheets error:', error);
        }
        
        alert(`Applied for ${selectedMatch.toUpperCase()} match successfully!\nPlayer: ${currentUser.gamertag}`);
        console.log('Match application saved:', matchData);
    }
});

// Display user info on page load
window.addEventListener('load', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Please login first!');
        window.location.href = 'login.html';
        return;
    }
    
    // You can display user info if needed
    console.log('Welcome:', currentUser.username);
});