burger = document.querySelector('.burger')
navbar = document.querySelector('.navbar')
navlist = document.querySelector('.nav-list')

burger.addEventListener('click', ()=>{
    navlist.classList.toggle('vis-res')
    navbar.classList.toggle('navh-res')
})


