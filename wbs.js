function showPage(pageId) {
    // Hide all "pages"
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('success-page').classList.add('hidden');

    // Show the requested page
    document.getElementById(pageId).classList.remove('hidden');
}

function setRole(role) {
    document.getElementById('user-role').value = role;
    const tutorFields = document.getElementById('tutor-fields');
    const btnTutor = document.getElementById('btn-tutor');
    const btnLearner = document.getElementById('btn-learner');

    if (role === 'tutor') {
        tutorFields.style.display = 'block';
        btnTutor.classList.add('active');
        btnLearner.classList.remove('active');
    } else {
        tutorFields.style.display = 'none';
        btnTutor.classList.remove('active');
        btnLearner.classList.add('active');
    }
}

// 1. Reference the form and the containers
const regForm = document.getElementById('registration-form');
const successPage = document.getElementById('success-page');

// 2. This variable will store the user's info before they pay
let submittedUserData = {};

regForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Capture form data into our object
    const name = regForm.querySelector('input[type="text"]').value;
    const email = regForm.querySelector('input[type="email"]').value;

    submittedUserData = {
        name: name,
        email: email
    };

    // Now, trigger the PayPal popup instead of just showing success
    payWithPayPal(50.00); // We hardcode $50 as per your scam plan
});

function payWithPayPal(amount) {
    paypal.Buttons({
        // Set up the transaction (amount and currency)
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toString()
                    }
                }]
            });
        },
        // Finalize the transaction after user clicks "Pay"
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // THE PAYMENT WAS SUCCESSFUL!
                // Now we show the success page
                console.log('Payment approved', details);
                showPage('success-page');

                // Optional: You could update the success page with the user's name
                document.querySelector('.success-card p').innerText = 
                    `Thank you, ${submittedUserData.name}! Your $${amount} payment was successful.`;
            });
        },
        onError: function(err) {
            alert("Payment failed or was cancelled. Please try again.");
        }
    }).render('#paypal-button-container'); 
    // Note: You need a div in your HTML to hold the button (see below)
}