const firebaseConfig = {
  apiKey: "AIzaSyC-ZtQ4N3d5ZYZcUCETe0quVgn3wD8Gdq4",
  authDomain: "datagram-in.firebaseapp.com",
  projectId: "datagram-in",
  storageBucket: "datagram-in.appspot.com",
  messagingSenderId: "984986151374",
  appId: "1:984986151374:web:8428c23ad9e8bd88ee639f"
};

firebase.initializeApp(firebaseConfig);

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message');
    const button = document.querySelector('button');
    const buttonLoader = document.querySelector('.button-loader');

    // Display loading animation
    buttonLoader.style.display = 'block';
    button.innerText = '';

    // Firebase authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // Fetch user details from Firebase Realtime Database
            fetchUserDetails(user.uid);
        })
        .catch((error) => {
            // Handle errors
            const errorMessage = error.message;
            errorMessageElement.textContent = errorMessage;

            // Hide loading animation and restore button text
            buttonLoader.style.display = 'none';
            button.innerText = 'Login';
        });
}

function fetchUserDetails(userId) {
    // Assuming you have a 'users' node in Realtime Database
    const userRef = firebase.database().ref('users/' + userId);

    userRef.once('value').then((snapshot) => {
        const userData = snapshot.val();
        
        if (userData) {
            // Save user details in local storage for further use
            localStorage.setItem('userDetails', JSON.stringify(userData));
            // Redirect to another page or perform additional actions
            window.location.href = 'dashboard.html';
        } else {
            console.log('User data not found');
        }
    }).catch((error) => {
        console.log('Error getting user data:', error);
    });
}
