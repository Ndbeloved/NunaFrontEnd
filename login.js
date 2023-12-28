document.addEventListener('DOMContentLoaded', async()=>{
    if(localStorage.getItem('token') && localStorage.getItem('isStarted') == 'true'){
        window.location.href = 'index.html'
    }
    localStorage.clear();
    const URL = 'http://localhost:3000/cbt-exam/login';
    const form = document.getElementById('form');
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const loginBtn = document.getElementById('login-btn')
        loginBtn.innerHTML = `<i class="fa-solid fa-spinner" id="spinner"></i>`
        const formData = new FormData(e.target);
        const reg = formData.get('reg')
        const data = {
            reg: reg,
        }
        try{
            const response = await fetch(URL, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if(response.ok){
                const data = await response.json()
                console.log(data)
                localStorage.setItem('token', data.token)
                localStorage.setItem('student',JSON.stringify(data.student))
                localStorage.setItem('course', data.currentCourseName)
                setInterval(()=>{
                    window.location.href = 'confirm-login.html'
                }, 3000)
            }
            else{
                const data = await response.json()
                console.log(data)
                console.log("couldn't login")
            }
        }catch(err){
            console.log('check internet connection')
        }
    })
})