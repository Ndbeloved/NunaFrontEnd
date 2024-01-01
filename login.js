document.addEventListener('DOMContentLoaded', async()=>{
    if(localStorage.getItem('token') && localStorage.getItem('isStarted') == 'true'){
        window.location.href = 'index.html'
    }
    localStorage.clear();
    const URL = 'https://nuna-cbt-exams.onrender.com/cbt-exam/login';
    const form = document.getElementById('form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message')
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
                let messageBox = document.querySelector(".success-dynamic-message");
                messageBox.innerHTML = "logged in successfully"
                errorMessage.classList.remove('visible')
                successMessage.classList.add('visible')
                localStorage.setItem('token', data.token)
                localStorage.setItem('student',JSON.stringify(data.student))
                localStorage.setItem('course', data.currentCourseName)
                setInterval(()=>{
                    successMessage.classList.remove('visible')
                    window.location.href = 'confirm-login.html'
                    loginBtn.innerHTML = "Login"
                }, 3000)
            }
            else{
                loginBtn.innerHTML = "Login"
                const data = await response.json()
                let messageBox = document.querySelector(".error-dynamic-message");
                messageBox.innerHTML = data.message;
                errorMessage.classList.add('visible')
                // setInterval(()=>{
                //     errorMessage.classList.remove('visible')
                // }, 3000)
            }
        }catch(err){
            loginBtn.innerHTML = "Login";
            let messageBox = document.querySelector(".error-dynamic-message");
            messageBox.innerHTML = 'check connection';
            errorMessage.classList.add('visible')
            // setInterval(()=>{
            //     errorMessage.classList.remove('visible')
            // }, 3000)
        }
    })

    //prevents inspect mode
    document.addEventListener('contextmenu', function(event){
        event.preventDefault()
    })

    document.addEventListener('keydown', function(event){
        if((event.ctrlKey && event.shiftKey && event.key == 'I') || (event.metaKey && event.altKey && event.key === 'I')){
            event.preventDefault();
            alert('inspect mode triggered')
        }
    })
})