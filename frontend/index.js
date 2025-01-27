const list = [2000, 2025, 2025, 3000, 3000, 4000, 5000, 10000, 15000];
const amount = document.getElementById('amount');

const envelope = document.querySelector('.envelope-wrapper');
envelope.addEventListener('click', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const index = Math.floor(Math.random() * list.length);
    const lucky = list[index];
    if (!name){
        alert('Please enter your name');
        return;
    }
    try {
        // Animate the envelope, put amount in it
        amount.textContent = `${lucky}`;
        envelope.classList.toggle('flap');
        // Wait for the animation to finish
        await new Promise(resolve => setTimeout(resolve, 4200));
        // Send data to backend        
        const response = await fetch('http://localhost:5000/api/money', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lucky })
        });
        
        if (response.ok) {
            alert('Sent!');
            // Clear form, reset animation
            document.getElementById('name').value = '';
            envelope.classList.remove('flap');
        } else {
            throw new Error('Failed!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
        envelope.classList.remove('flap');
    }
});