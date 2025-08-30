function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'register') {
      return handleRegistration(e.parameter);
    } else if (action === 'login') {
      return handleLogin(e.parameter);
    } else if (action === 'getUsers') {
      return getAllUsers();
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRegistration(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 6).setValues([['Timestamp', 'Name', 'Email', 'Phone', 'Game ID', 'Password']]);
  }
  
  const timestamp = new Date();
  const newRow = [
    timestamp,
    params.name || params.gamertag || '',
    params.email || '',
    params.phone || '',
    params.gamertag || '',
    params.password || ''
  ];
  
  sheet.appendRow(newRow);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true, 
      message: 'Registration successful!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleLogin(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[2] === params.email && row[5] === params.password) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          user: { name: row[1], email: row[2], phone: row[3], gameId: row[4] }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: false}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllUsers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const users = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    users.push({
      timestamp: row[0], name: row[1], email: row[2], 
      phone: row[3], gameId: row[4], password: row[5]
    });
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, users: users}))
    .setMimeType(ContentService.MimeType.JSON);
}
