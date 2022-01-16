'use strict'

const overViewBtn = document.querySelector('.overviewBtn')
const allThing = document.querySelector('.container')
const overviews = document.querySelectorAll('.overviews')
overViewBtn.addEventListener('click', () => change())

function change() {
  if (allThing.style.display == 'none') {
    allThing.style.display = 'flex'
    overViewBtn.innerHTML = '+ OverView'
    overViewBtn.classList.remove('BtnAfter')

    overviews.forEach((node) => {
      node.style.display = 'none'
    })
  } else {
    allThing.style.display = 'none'
    overViewBtn.innerHTML = '<< Back'
    overViewBtn.classList.add('BtnAfter')
    overviews.forEach((node) => {
      node.style.display = 'flex'
    })
  }
}
