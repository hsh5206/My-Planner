'use strict'
import Calender from './calender.js'
const calender = new Calender()

const clock = document.querySelector('#clock')
const overViewBtn = document.querySelector('.overviewBtn')
const allThing = document.querySelector('.container')
const overviews = document.querySelector('.overviews_container')
overViewBtn.addEventListener('click', () => change())
let temp = []
let year = 0
let month = 0
let day = 0
let divider = 8
let thisMonth = 0
let arr_calendar = []

function change() {
  if (allThing.style.display == 'none') {
    allThing.style.display = 'flex'
    overViewBtn.innerHTML = '+ OverView'
    overViewBtn.classList.remove('BtnAfter')
    overviews.style.display = 'none'
    clock.style.right = '28px'
  } else {
    allThing.style.display = 'none'
    overViewBtn.innerHTML = '<< Back'
    overViewBtn.classList.add('BtnAfter')
    overviews.style.display = 'flex'
    clock.style.left = '10%'
  }
  renderOverviews(calender.current_year, calender.current_month)
}

function renderOverviews(cyear, cmonth) {
  year = cyear
  month = cmonth
  console.log(year, month)
  temp = []
  let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (month == 2) {
    if (calender.checkLeapYear(year)) month_day[1] = 29
  }

  thisMonth = month_day[month]
  let first_day_of_week = calender.getFirstDayOfWeek(year, month)
  arr_calendar = []
  for (let i = 0; i < first_day_of_week; i++) {
    arr_calendar.push('')
  }

  for (let i = 1; i < month_day[month - 1]; i++) {
    arr_calendar.push(String(i))
  }

  let remain_day = 7 - (arr_calendar.length % 7)
  if (remain_day < 7) {
    for (let i = 0; i < remain_day; i++) {
      arr_calendar.push('')
    }
  }

  let visit = 1
  temp.push('<tr>')
  for (let i = 0; i < arr_calendar.length; i++) {
    const cday = arr_calendar[i]
    day = cday
    if (day === '') {
      if (visit > 20) {
        reRenderOverviews(i, arr_calendar)
        return
      }
      visit += 1
      temp.push('<td></td>')
      continue
    } else {
      visit += 1
      temp.push(`
          <td class="overview">
            <div class="overview_day">${year}.${month}.${day}</div>
            <div class="overview_todo_list">
              <ul class="overview_items"></ul>
            </div>
          </td>
        `)
      toServer(visit, day)
    }
  }
}

function toServer(index, thisday) {
  //server
  const config = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const param = `${year}_${month}_${thisday}`
  fetch(`/todos/${param}`, config)
    .then((res) => res.json())
    .then((data) => JSON.stringify(data))
    .then((data) => ItemPush(JSON.parse(data), index, param))
    .catch((error) => console.log(error))
}

function ItemPush(data, index, param) {
  const now = param.split('_').join('.')
  let text = ''
  for (let i = 0; i < data.length; i++) {
    text += `<li>${data[i].todo}</li>`
  }
  temp[index] = `
  <td class="overview">
    <div class="overview_day">${now}</div>
    <div class="overview_todo_list">
      <ul class="overview_items">
      ${text}
      </ul>
    </div>
  </td>
`
}

function reRenderOverviews(start, arr) {
  setTimeout(() => {
    for (let i = start; i < arr.length; i++) {
      temp.push('<td></td>')
    }

    for (let i = 0; i < temp.length; i++) {
      if (i != 0 && i % divider == 0) {
        temp.splice(i, 0, '</tr><tr>')
      }
    }
    temp.push(`</tr>`)

    const overviews = document.querySelector('#overviews')
    overviews.innerHTML = temp.join('')
  }, 1000)
}

calender.changeYearMonth(2022, 1)
