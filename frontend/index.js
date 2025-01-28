const list1 = [5000, 2025, 3000, 5000, 2025, 5000, 20000, 5000, 5000, 5000, 5000, 2000, 5000, 3000, 10000, 5000, 3000, 5000, 5000, 3000, 5000, 2000, 20000, 5000, 5000, 20000, 2025, 2025, 5000, 2000, 3000, 10000, 5000, 3000, 5000, 20000, 10000, 5000, 5000, 5000, 3000, 5000, 20000, 5000, 10000, 5000, 2000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 20000, 5000, 5000, 5000, 2025, 5000, 2025, 2025, 5000, 5000, 10000, 5000, 5000, 2025, 5000, 20000, 50000, 20000, 5000, 5000, 3000, 5000, 5000, 5000, 10000, 5000, 20000, 10000, 5000, 2025, 2025, 5000, 10000, 5000, 20000, 5000, 3000, 2000, 5000, 5000, 5000, 5000, 5000, 10000, 10000, 3000];

const list2 = ['Tết Âm lịch 2025, chúc bạn bình an, vui vẻ và gặp nhiều may mắn trong mọi việc!', 'Chúc bạn năm mới 2025 thật nhiều sức khỏe, niềm vui tràn ngập, và thành công như ý!', 'Chúc bạn năm 2025 thật nhiều tài lộc, sức khỏe dồi dào và mãi giữ được sự lạc quan, yêu đời!', 'Năm mới 2025, chúc tình bạn của chúng ta thêm bền chặt và bạn luôn đạt được những điều tốt đẹp nhất!', 'Chúc bạn năm mới vạn sự như ý, an khang thịnh vượng', 'Chúc năm mới 2025: An khang, Thịnh vượng, Hạnh phúc tràn đầy.', 'Chúc bạn năm mới sức khỏe dồi dào, công việc thăng tiến, cuộc sống hạnh phúc.', 'Chúc bạn một năm mới an lành, thịnh vượng và tràn ngập niềm vui.']

const amount = document.getElementById('amount');
const greeting = document.getElementById('greeting');

const envelope = document.querySelector('.envelope-wrapper');
envelope.addEventListener('click', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const index1 = Math.floor(Math.random() * list1.length);
    const index2 = Math.floor(Math.random() * list2.length);
    const lucky = list1[index1];
    if (!name){
        alert('Điền tên cái đã !!!');
        return;
    }
    try {
        // Animate the envelope, put amount and greeting in it
        greeting.textContent = `${list2[index2]}`;
        amount.textContent = `Mức lì xì: ${lucky}VNĐ`;
        envelope.classList.toggle('flap');
        // Wait for the animation to finish
        confetti({
            particleCount: 200,
            startVelocity: 30,
            spread: 360,
            ticks: 5000
        });
        await new Promise(resolve => setTimeout(resolve, 4200));
        // Send data to backend        
        const response = await fetch('https://lixi2025.onrender.com/api/money', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lucky })
        });
        
        if (response.ok) {
            alert('Thành công!');
            // Clear form, reset animation
            document.getElementById('name').value = '';
            envelope.classList.remove('flap');
        } else {
            throw new Error('Error, try again');
        }
    } catch (error) {
        alert('Error: ' + error.message);
        envelope.classList.remove('flap');
        document.getElementById('name').value = '';
    }
});