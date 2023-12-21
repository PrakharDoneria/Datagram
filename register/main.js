// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL", // Realtime Database URL
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function previewProfilePicture() {
    const input = document.getElementById('profile-picture');
    const preview = document.getElementById('profile-picture-preview');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}

function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message');
    const button = document.querySelector('button');
    const buttonLoader = document.querySelector('.button-loader');

    // Display loading animation
    buttonLoader.style.display = 'block';
    button.innerText = '';

    // Firebase authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;

            // Save additional user data to Realtime Database
            saveUserData(user.uid, username);

            // Send email verification
            sendEmailVerification();
        })
        .catch((error) => {
            // Handle errors
            const errorMessage = error.message;
            errorMessageElement.textContent = errorMessage;

            // Hide loading animation and restore button text
            buttonLoader.style.display = 'none';
            button.innerText = 'Register';
        });
}

function saveUserData(userId, username) {
    // Assuming you have a 'users' node in Realtime Database
    const userRef = firebase.database().ref('users/' + userId);

    userRef.set({
        username: username,
        profilePicture: '', // You can store the profile picture URL here once uploaded
    });
}

function sendEmailVerification() {
    const user = firebase.auth().currentUser;

    user.sendEmailVerification()
        .then(() => {
            // Email verification sent successfully
            // Show a modal or perform any other action
            alert('Verification email sent. Please verify your email and login.');
        })
        .catch((error) => {
            console.error('Error sending verification email:', error);
        });
}