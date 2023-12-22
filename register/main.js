// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-ZtQ4N3d5ZYZcUCETe0quVgn3wD8Gdq4",
  authDomain: "datagram-in.firebaseapp.com",
  projectId: "datagram-in",
  storageBucket: "datagram-in.appspot.com",
  messagingSenderId: "984986151374",
  appId: "1:984986151374:web:8428c23ad9e8bd88ee639f"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase connected successfully!');
} catch (error) {
  console.error('Firebase connection error:', error);
  alert('Unable to connect to Firebase. Please try again later.');
}

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
        preview.src = 'https://raw.githubusercontent.com/PrakharDoneria/Datagram/main/assets/avatar.png';
        preview.style.display = 'block'; // Show default image if no file selected
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
            console.error('Registration error:', error);

            const errorMessage = error.message;
            errorMessageElement.textContent = errorMessage;

            // Hide loading animation and restore button text
            buttonLoader.style.display = 'none';
            button.innerText = 'Register';

            // Show an alert with the error message
            alert(errorMessage);
        });
}

function saveUserData(userId, username) {
    // Assuming you have a 'users' node in Realtime Database
    const userRef = firebase.database().ref('users/' + userId);

    userRef.set({
        username: username,
        profilePicture: '', // You can store the profile picture URL here once uploaded
        verified: false,
        banned: false
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
