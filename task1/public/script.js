
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const userData = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                mobileNo: document.getElementById("mobile").value,
                email: document.getElementById("email").value,
                address: {
                    street: document.getElementById("street").value,
                    city: document.getElementById("city").value,
                    state: document.getElementById("state").value,
                    country: document.getElementById("country").value
                },
                loginId: document.getElementById("loginId").value,
                password: document.getElementById("password").value
            };
      
        console.log(userData);

        fetch('http://localhost:4000/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        })
        // .then(response => {
        //     if (response.ok) {
        //         return response.json();
        //     }
        //     throw new Error('Network response was not ok.');
        // })
        .then(response => response.json())
        .then(data => {
           
            // console.log('Form submission successful:', data);
            localStorage.setItem('userData' , data)
            alert('Form submission successful!');
          
            window.location.href = './login.html';
        })
        .catch(error => {
           
            console.error('Form submission error:', error);
            alert('Form submission failed. Please try again.');
        });
    });
});
