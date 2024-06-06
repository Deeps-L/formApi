const socket = io();
let UserSocket_id = '';
socket.on('user-login', (userData) => {
    if (!userData || !userData.loginId) {
        console.error('Login ID not available in userData');
        return;
    }
console.log('users-data',userData);
    fetch('/api/user-data', {      
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId: loginId }) 
    })

    .then(response => {
        console.log('response',response);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
   
    .then(data => {
     
        document.getElementById('emailLink').textContent = data.email;
        document.getElementById('socketIdLink').textContent = data.socketId;
        document.getElementById('name').textContent = data.firstName;

        
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
    });
});


function updateSocketIdLink(socketId) {
    const socketIdLink = document.getElementById('socketIdLink');
    if (socketId) {
        socketIdLink.textContent = socketId;
    }
}

// Update socket ID link on connect
socket.on('connect', () => {
    UserSocket_id = socket.id; // Get the socket ID from the socket connection
    updateSocketIdLink(UserSocket_id); // Update the socket ID link
});

const UserSocket_email = localStorage.getItem('email');

const emailLink = document.getElementById('emailLink');


if (UserSocket_email) {  
    emailLink.textContent = UserSocket_email;
}

const UserSocket_name = localStorage.getItem('name');
const nameSpan = document.getElementById('name');

if (UserSocket_name) {
   
    nameSpan.textContent = UserSocket_name;
}


socket.on('connect', () => {
    // Request active users from the server when connected
    socket.emit('request-active-users');
});

socket.on('active-users', (activeUsers) => {
    updateActiveUsers(activeUsers);
});


const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const allMessage = document.getElementById('customMsg');

socket.on("msg", (message) => {
    const p = document.createElement('p');
    p.innerText = message;
    allMessage.appendChild(p);
});

sendBtn.addEventListener('click', (e) => {
    const message = messageInput.value
    console.log(message);
    socket.emit('user-msg', message);
});


const UserSocket_loginId = localStorage.getItem('loginId');
console.log(UserSocket_loginId);
const UserSocket_address = localStorage.getItem('address');
const UserSocket_mobileNo = localStorage.getItem('mobileNo');

function openPopup(data) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("socketIdLinkPopup").textContent = UserSocket_id;
    document.getElementById("emailLinkPopup").textContent = UserSocket_email;
    document.getElementById("namePopup").textContent = UserSocket_name;
    document.getElementById("loginIdPopup").textContent = UserSocket_loginId;
    document.getElementById("addressPopup").textContent = UserSocket_address;
    document.getElementById("mobileNoPopup").textContent = UserSocket_mobileNo;
}


// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}


document.getElementById("emailLink").addEventListener("click", function(event) {
    event.preventDefault(); 
    openPopup();
    socket.emit('request-user-data');
});


document.getElementById("socketIdLink").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link behavior
    openPopup();
    socket.emit('request-user-data');
});

function gotohome() {
    window.location.href = './index.html';
}




