document.addEventListener('DOMContentLoaded', async()=>{
    //checks if token exist before setting exam isTrue
    if(localStorage.getItem('token') == 'undefined' || localStorage.getItem('token') == null){
        let x=0;
    }else{
        localStorage.setItem('isStarted', 'true')
    }
    const questionContainer = document.querySelector('.extra-wrapper')
    const questionBox = document.getElementById('question-box');
    const optA = document.getElementById('OptA');
    const optB = document.getElementById('OptB');
    const optC = document.getElementById('OptC');
    const optD = document.getElementById('OptD');
    const studentName = document.getElementById('dynamic-name');
    const studentReg = document.getElementById('dynamic-reg');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.querySelector('.submitTest');
    let examTime = 20;
    async function getQuestions(){
        try{
            const response = await fetch('https://nuna-cbt-exams.onrender.com/cbt-exam', {
                method: 'get',
                headers:{
                    Authorization: localStorage.getItem('token')
                }
            })
            
            if(response.ok){
                let questions = false
                if(localStorage.getItem("questions") !== "undefined"){
                    questions = JSON.parse(localStorage.getItem("questions"));
                }
                if(questions){
                    return questions
                }
                const data = await response.json()
                return data
            }
            if(response.status == 401){
                window.location.href = 'login.html'
            }
            if(response.status == 403){
                window.location.href = 'login.html'
            }
        }catch(err){
            console.log(err)
        }
    }
    
    let data = await getQuestions()
    localStorage.setItem("questions", JSON.stringify(data));
    let student = data.student
    examTime = parseInt(data.time);
    let questionCount = 1;

    data.questions.forEach((question, index)=>{
        const element = `
        <div class="slider" id="slider">
            <div id="question-box">
            <strong>${index+1}</strong>&nbsp;&nbsp;&nbsp;  ${question.que}
            </div>
            <form>
                <div class="optWrapper">
                    <input id="OptAradio${questionCount}" type="radio" name="option${questionCount}" value="${question.optA}" data-index="${index}">
                    <label class="Opt" id="OptA" for="OptAradio${questionCount}">${question.optA}</label>
                    <input id="OptBradio${questionCount}" type="radio" name="option${questionCount}" value="${question.optB}" data-index="${index}">
                    <label class="Opt" id="OptB" for="OptBradio${questionCount}">${question.optB}</label>
                    <input id="OptCradio${questionCount}" type="radio" name="option${questionCount}" value="${question.optC}" data-index="${index}">
                    <label class="Opt" id="OptC" for="OptCradio${questionCount}">${question.optC}</label>
                    <input id="OptDradio${questionCount}" type="radio" name="option${questionCount}" value="${question.optD}" data-index="${index}">
                    <label class="Opt" id="OptD" for="OptDradio${questionCount}">${question.optD}</label>
                </div>
            <form>
        </div>
        `;
        questionContainer.insertAdjacentHTML('beforeend',element)
        questionCount++;
    })
    // questionBox.innerHTML = data.questions[0].que
    // optA.innerHTML = data.questions[0].optA
    // optB.innerHTML = data.questions[0].optB
    // optC.innerHTML = data.questions[0].optC
    // optD.innerHTML = data.questions[0].optD
    studentName.innerHTML = student.name 
    studentReg.innerHTML = student.reg 

    const persistedData = localStorage.getItem('answers')
    const questionSlide = document.getElementById('slider');
    const nextBtn = document.querySelector('.nextBtn');
    const prevBtn = document.querySelector('.prevBtn');
    let questionIndex = 0;
    let questionHeight = questionContainer.children[questionIndex].offsetWidth;
    

    nextBtn.addEventListener('click',()=>{
        questionHeight = questionContainer.children[questionIndex].offsetWidth;
        // let previousQuestion = questionContainer.children[questionIndex]
        // let visibleQuestion = questionContainer.children[questionIndex + 1]
        // previousQuestion.classList.remove('visible')
        // visibleQuestion.classList.add('visible');
        // console.log(visibleQuestion)
        if(questionIndex >= questionContainer.children.length -1){
            let x = 1
        }else{
            questionIndex++;
        }
        let newPosition = questionIndex * questionHeight;
        questionContainer.scrollTo({left:newPosition, behavior:'auto'})
    })

    prevBtn.addEventListener('click',()=>{
        questionHeight = questionContainer.children[questionIndex].offsetWidth;
        if(questionIndex <= 0){
            let x=0
        }else{
            questionIndex--;
        }
        
        let newPosition = questionIndex * questionHeight;
        questionContainer.scrollTo({left:newPosition, behavior:'auto'})
    })

    //progress boxes
    const progressWrapper = document.getElementById('progress-wrapper')
    data.questions.forEach((question, index)=>{
        const boxElement = `
        <div class="progress-box" data-index="${index}">${index+1}<div>
        `;
        progressWrapper.insertAdjacentHTML('beforeend',boxElement)
    })
    
    //progress box function
    function getIndex(index){
        questionIndex = index;
        questionHeight = questionContainer.children[questionIndex].offsetWidth;
        let newPosition = questionIndex * questionHeight;
        questionContainer.scrollTo({left:newPosition, behavior:'auto'})
    }

    //click progress boxes to travel questions
    const progressBoxes = document.querySelectorAll('.progress-box');
    progressBoxes.forEach(box=>{
        box.addEventListener('click', function(){
            const index = this.getAttribute('data-index');
            getIndex(index)
        })
    })

    //get values of radio
    let answers;
    if(localStorage.getItem("answers") == null || localStorage.getItem("answers") == 'undefined'){
        answers = {};
    }else{
        answers = JSON.parse(localStorage.getItem("answers"));
    }
    
    const allOptions = document.querySelectorAll('input[type=radio]')
    allOptions.forEach(option=>{
        option.addEventListener('change', function(){
            let value = this.getAttribute('value')
            let indexQuestion = this.getAttribute('data-index') 
            let correctAnswer = data.questions[indexQuestion].answer
            let progressBoxWrapper = document.querySelector(`.progress-wrapper`)
            let progressBoxQuestion = progressBoxWrapper.children[indexQuestion]
            progressBoxQuestion.style.background = "#7bd57b";
            let gotIt = false;
            if(value == correctAnswer){
                gotIt = true
            }
            let key = `${indexQuestion}`
            let result = {
                answer: value,
                correctAnswer: correctAnswer,
                gotIt: gotIt
            }
            answers[key] = result;
            localStorage.setItem("answers",JSON.stringify(answers))
        })
    })


    function persist(obj){
        Object.entries(obj).forEach(([key, value])=>{
            let options = document.querySelectorAll(`input[name=option${parseInt(key)+1}]`)
            let progressBoxWrapper = document.querySelector(`.progress-wrapper`)
            let progressBoxQuestion = progressBoxWrapper.children[key]
            progressBoxQuestion.style.background = "#7bd57b";
            options.forEach(option=>{
                if(value.answer == option.value){
                    option.checked = true
                }
            })
        })
    }

    
    if(persistedData == null || persistedData == 'undefined'){
        let x = 1
    }
    else{
        let parsedData = JSON.parse(persistedData);
        persist(parsedData)
    }

    async function submitAnswers(answers){
        try{
            const URL = 'https://nuna-cbt-exams.onrender.com/cbt-exam/submit';
            const response = await fetch(URL, {
                method: 'post',
                headers:{
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({answers: answers, reg: student.reg, course: data.questions[0].course}),
            })

            if(response.ok){
                let messageBox = document.querySelector(".success-dynamic-message");
                messageBox.innerHTML = "finished exam successfully"
                errorMessage.classList.remove('visible')
                successMessage.classList.add('visible')
                submitBtn.innerHTML = "Submit Test"
            }
            setInterval(()=>{
                localStorage.clear()
                window.location.href = 'login.html'
            },3000)
        }catch(err){
            let messageBox = document.querySelector(".error-dynamic-message");
            messageBox.innerHTML = "Check connection"
            errorMessage.classList.add('visible')
            successMessage.classList.remove('visible')
            submitBtn.innerHTML = "Submit Test"
        }
    }

    //Handles exam submission
    submitBtn.addEventListener('click', async()=>{
        const confirmation = window.confirm("Clicking yes will finish the exam, proceed?")
        if(confirmation){
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner" id="spinner"></i>`
            console.log(`persist: ${persistedData}`)
            let answers = JSON.parse(localStorage.getItem("answers"));
            console.log(`answers: ${answers}`)
            await submitAnswers(answers)
        }
    })

    //handles time
    const progressBar = document.getElementById('progress');
    const dynamicTime = document.getElementById('dynamic-time')
    let time = examTime; //Exam time in minutes, will be fetching from backend database
    let startTime  = new Date();
    let stopTime;
    if(localStorage.getItem('stopageTime') == null || localStorage.getItem('stopageTime') == 'undefined'){
        stopTime = new Date(startTime.getTime() + (time * 60000));
        localStorage.setItem('stopageTime', stopTime)
    }else{
        stopTime = new Date(localStorage.getItem('stopageTime'));
    }
    let timeDifference;
    const interval = setInterval(async function(){
        startTime = new Date()
        timeDifference = Math.floor((stopTime - startTime) / 60000);
        dynamicTime.innerHTML = timeDifference+'min'
        let percentage = (timeDifference / time) * 360;
        if(timeDifference == 0){
            clearInterval(interval)
            let answers = JSON.parse(persistedData);
            await submitAnswers(answers)
        }
        progressBar.style.setProperty('--degree', percentage+'deg');
    },1000)

    // //prevents inspect mode
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