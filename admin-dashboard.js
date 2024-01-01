document.addEventListener('DOMContentLoaded', async()=>{
    //containers
    const coursesContainer = document.querySelector('.courses-list-wrapper');
    const openCoursesContainer = document.querySelector('.open-course-wrapper');
    const registerStudentContainer = document.querySelector('.register-student-wrapper');
    const scanStudentContainer = document.querySelector('.scan-student-wrapper');
    const setQuestionContainer = document.querySelector('.set-course-wrapper')
    let previousElementClass = '.courses-list-wrapper';
    let previousActiveClass = '.courses-list';

    //links and buttons
    const coursesListBtn = document.querySelector('.courses-list');
    const openCoursesBtn = document.querySelector('.open-course');
    const registerStudentBtn = document.querySelector('.register-student');
    const scanStudentBtn = document.querySelector('.scan-student');
    const logOutLink = document.querySelector('.logout-menu');
    const setQuestionBtn = document.querySelector('.register-course');


    //Forms
    const form = document.querySelector('#form');
    const registerStudentForm = document.querySelector('#register-student-form');
    const scanStudentForm = document.querySelector('#scan-student-form');
    

    //urls
    const urlGetCoursesRegistered = 'http://localhost:3000/official/registered-courses';
    const urlOpenCourse = 'http://localhost:3000/official/open-course';
    const urlCloseCourse = 'http://localhost:3000/official/close-course';
    const urlSetQuestion = 'http://localhost:3000/official/create';
    const urlRegisterStudent = 'http://localhost:3000/official/register/student';
    const urlScanStudent = 'http://localhost:3000/official/scan/student';

    //open course section variables
    const openCoursesList = document.querySelector('.open-course-list-wrapper');
    const closedCoursesList = document.querySelector('.open-new-wrapper');

    //btns eventListener
    coursesListBtn.addEventListener('click', ()=>{
        document.querySelector(previousElementClass).classList.remove('visible');
        document.querySelector(previousActiveClass).classList.remove('active');
        coursesContainer.classList.add('visible');
        coursesListBtn.classList.add('active');
        previousElementClass = `.${coursesContainer.classList[0]}`;
        previousActiveClass = `.${coursesListBtn.classList[0]}`;
    });

    openCoursesBtn.addEventListener('click', ()=>{
        document.querySelector(previousElementClass).classList.remove('visible');
        document.querySelector(previousActiveClass).classList.remove('active');
        openCoursesContainer.classList.add('visible');
        openCoursesBtn.classList.add('active');
        previousElementClass = `.${openCoursesContainer.classList[0]}`;
        previousActiveClass = `.${openCoursesBtn.classList[0]}`;
    });

    registerStudentBtn.addEventListener('click', ()=>{
        document.querySelector(previousElementClass).classList.remove('visible');
        document.querySelector(previousActiveClass).classList.remove('active')
        registerStudentContainer.classList.add('visible');
        registerStudentBtn.classList.add('active');
        previousElementClass = `.${registerStudentContainer.classList[0]}`;
        previousActiveClass = `.${registerStudentBtn.classList[0]}`;
    })

    scanStudentBtn.addEventListener('click', ()=>{
        document.querySelector(previousActiveClass).classList.remove('active');
        document.querySelector(previousElementClass).classList.remove('visible');
        scanStudentContainer.classList.add('visible');
        scanStudentBtn.classList.add('active')
        previousElementClass = `.${scanStudentContainer.classList[0]}`;
        previousActiveClass = `.${scanStudentBtn.classList[0]}`;
    })

    setQuestionBtn.addEventListener('click', ()=>{
        document.querySelector(previousActiveClass).classList.remove('active');
        document.querySelector(previousElementClass).classList.remove('visible');
        setQuestionContainer.classList.add('visible');
        setQuestionBtn.classList.add('active')
        previousElementClass = `.${setQuestionContainer.classList[0]}`;
        previousActiveClass = `.${setQuestionBtn.classList[0]}`;
    })

    //open Courses Section handling

    //handles fetching all registered course
    

    async function getCourses(url){
        try{
            const response = await fetch(url,{
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
    
            if(response.ok){
                const data = await response.json()
                return data
            }
        }
        catch(err){
            console.log('check connection')
        }
    }

    async function reRender(){
        const data = await getCourses(urlGetCoursesRegistered)
        //removes all inorder to reRender and avoid duplicates
        let allOpen = openCoursesList.querySelectorAll('.open-course');
        let allClosed = closedCoursesList.querySelectorAll('.close-course')
        allOpen.forEach(courseOpen=>{
            courseOpen.remove()
        });
        allClosed.forEach(courseClosed=>{
            courseClosed.remove();
        })

        //renders again
        data.courses.forEach(course=>{
            if(course.inProgress){
                const element = `<div class="open-course">
                    ${course.name}
                    <button data-id= "${course._id}" data-name= "${course.name}" class="stopCourse">stop</button>
                </div>`;
                openCoursesList.insertAdjacentHTML('beforeend',element)
            }
            else{
                const element = `<div class="close-course">
                    ${course.name}
                    <button data-id= "${course._id}" data-name= "${course.name}" class="startCourse">start</button>
                </div>`;
                closedCoursesList.insertAdjacentHTML('beforeend',element)
            }
        })

        //after reRendering, we need to add eventListeners to the new buttons
        const stopCoursesBtns = document.querySelectorAll('.stopCourse');
        const startCoursesBtns = document.querySelectorAll('.startCourse');
        startCoursesBtns.forEach(async(startBtn)=>{
            const name = startBtn.getAttribute('data-name')
            startBtn.addEventListener('click', async()=>{
                await startCourse(name);
            })
        });

        stopCoursesBtns.forEach(async(stopBtn)=>{
            const name = stopBtn.getAttribute('data-name')
            stopBtn.addEventListener('click', async()=>{
                await stopCourse(name);
            })
        });
        return
    }
    //call reRender function
    await reRender()

    async function startCourse(name){
        try{
            const response = await fetch(urlOpenCourse, {
                method: 'post',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    course: name
                }),
            })

            if(response.ok){
                const info = await response.json();
                await reRender();
                return
            }
        }catch(err){
            console.log('check connection')
        }
    }

    async function stopCourse(name){
        try{
            const response = await fetch(urlCloseCourse, {
                method: 'post',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    course: name
                }),
            })
            if(response.ok){
                await reRender();
                return
            }
        }catch(err){
            console.log('check connection')
        }
    }

    //handles opening and closing of a course
    const stopCoursesBtns = document.querySelectorAll('.stopCourse');
    const startCoursesBtns = document.querySelectorAll('.startCourse');
    startCoursesBtns.forEach(async(startBtn)=>{
        const name = startBtn.getAttribute('data-name')
        startBtn.addEventListener('click', async()=>{
            await startCourse(name);
        })
    });

    stopCoursesBtns.forEach(async(stopBtn)=>{
        const name = stopBtn.getAttribute('data-name')
        stopBtn.addEventListener('click', async()=>{
            await stopCourse(name);
        })
    });


    //Handles Setting of questions
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();
        try{
            const formInfo = new FormData(e.target);
            const data = {
                course: formInfo.get('course'),
                que: formInfo.get('que'),
                optA: formInfo.get('optA'),
                optB: formInfo.get('optB'),
                optC: formInfo.get('optC'),
                optD: formInfo.get('optD'),
                answer: formInfo.get('answer')
            }

            const response = await fetch(urlSetQuestion, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if(response.ok){
                const data = await response.json();
                const message = data.message;
                console.log(message)
            }

        }catch(err){
            const message = "Check server connection";
            console.log(message)
        }
    })

    //handles registration of new student
    registerStudentForm.addEventListener('submit', async(e)=>{
        try{
            e.preventDefault();
            const formInfo = new FormData(e.target);
            const data = {
                name: formInfo.get('name'),
                academicSection: formInfo.get('academicSection')
            }

            const response = await fetch(urlRegisterStudent, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if(response.ok){
                const data = await response.json();
                const message = data.message;
                console.log(message)
            }

        }catch(err){
            message = "Check connection";
            console.log(message)
        }
    })

    //handles scan Student
    scanStudentForm.addEventListener('submit', async(e)=>{
        try{
            e.preventDefault();
            const formInfo = new FormData(e.target);
            const data = {
                reg: formInfo.get('reg'),
                course: formInfo.get('course')
            }

            const response = await fetch(urlScanStudent, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.ok){
                const data = await response.json();
                const message = data.message;
                console.log(message)
            }

            if(response.status == 404){
                const data = await response.json();
                const message = data.message;
                console.log(message)
            }
        }catch(err){
            const message = 'Check internet connection';
            console.log(message)
        }
    })
})