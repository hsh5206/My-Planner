'use strict'
import PopUp from './popup.js'
import Calender from './calender.js'
const calender = new Calender()
const popup = new PopUp()

export default class OverView {
  constructor() {
    this.popup_window = document.querySelector('.popup')
    this.background_cover = document.querySelector('.background_cover')
    this.clock = document.querySelector('#clock')
    this.weather = document.querySelector('#weather')
    this.overViewBtn = document.querySelector('.overviewBtn')
    this.allThing = document.querySelector('.container')
    this.overviews = document.querySelector('.overviews_container')
    this.overViewTable = document.querySelector('.overviews_table')
    this.temp = []
    this.year = 0
    this.month = 0
    this.day = 0
    this.divider = 8
    this.arr_calendar = []
    this.rendering = []

    this.overViewBtn.addEventListener('click', () => this.change())
    this.overViewTable.addEventListener('click', (e) =>
      this.overViewTableClick(e)
    )
    this.background_cover.addEventListener('click', () => {
      this.popup_window.classList.remove('overview_popup')
      this.background_cover.style.display = 'none'
      popup.hide('overview')
      this.overViewServer(`${this.year}.${this.month}.${this.day}`)
    })
  }

  change() {
    popup.hide()
    if (this.allThing.style.display == 'none') {
      this.allThing.style.display = 'flex'
      this.overViewBtn.innerHTML = '+ OverView'
      this.overViewBtn.classList.remove('BtnAfter')
      this.overviews.style.display = 'none'
      this.clock.classList.remove('overview_clock')
      this.weather.classList.remove('overview_weather')
    } else {
      this.allThing.style.display = 'none'
      this.overViewBtn.innerHTML = '<< Back'
      this.overViewBtn.classList.add('BtnAfter')
      this.overviews.style.display = 'flex'
      this.clock.classList.add('overview_clock')
      this.weather.classList.add('overview_weather')
    }
    this.renderOverviews(calender.current_year, calender.current_month)
  }

  renderOverviews(cyear, cmonth) {
    this.year = cyear
    this.month = cmonth

    this.rendering = []
    this.temp = []
    let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (this.month == 2) {
      if (calender.checkLeapYear(this.year)) month_day[1] = 29
    }

    let first_day_of_week = calender.getFirstDayOfWeek(this.year, this.month)
    this.arr_calendar = []
    for (let i = 0; i < first_day_of_week; i++) {
      this.arr_calendar.push('')
    }

    for (let i = 1; i < month_day[this.month - 1]; i++) {
      this.arr_calendar.push(String(i))
    }

    let remain_day = 7 - (this.arr_calendar.length % 7)
    if (remain_day < 7) {
      for (let i = 0; i < remain_day; i++) {
        this.arr_calendar.push('')
      }
    }

    this.temp.push('<tr>')
    for (let i = 0; i < this.arr_calendar.length; i++) {
      const cday = this.arr_calendar[i]
      this.day = cday
      if (this.day === '') {
        this.temp.push('<td></td>')
        continue
      } else {
        this.rendering.push(`${this.year}.${this.month}.${this.day}`)
        this.temp.push(`
            <td class="overview">
              <div class="overview_day">${this.year}. ${this.month}. ${this.day}</div>
              <div class="overview_todo_list">
                <ul class="overview_items"></ul>
              </div>
            </td>
          `)
      }
    }

    for (let i = 0; i < this.temp.length; i++) {
      if (i != 0 && i % this.divider == 0) {
        this.temp.splice(i, 0, '</tr><tr>')
      }
    }
    this.temp.push(`</tr>`)

    const overviews = document.querySelector('#overviews')
    overviews.innerHTML = this.temp.join('')
    this.renderList()
  }

  renderList() {
    for (let i = 0; i < this.rendering.length; i++) {
      this.overViewServer(this.rendering[i])
    }
  }

  overViewTableClick(e) {
    popup.hide()
    let param = ''
    if (e.target.nodeName == 'LI') {
      param =
        e.target.parentNode.parentNode.parentNode.childNodes[1].innerText.split(
          '. '
        )
      this.day = param[2]
      popup.changenow(param[0], param[1], param[2])
      param = param.join('_')
      this.renderToServer(param)
    } else if (e.target.nodeName == 'UL') {
      param = e.target.parentNode.parentNode.childNodes[1].innerText.split('. ')
      this.day = param[2]
      popup.changenow(param[0], param[1], param[2])
      param = param.join('_')
      this.renderToServer(param)
    } else if (e.target.nodeName == 'DIV') {
      param = e.target.parentNode.childNodes[1].innerText.split('. ')
      this.day = param[2]
      popup.changenow(param[0], param[1], param[2])
      param = param.join('_')
      this.renderToServer(param)
    }
  }

  renderToServer(param) {
    //server
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/todos/${param}`, config)
      .then((res) => res.json())
      .then((data) => {
        return JSON.stringify(data)
      })
      .then((data) => popup.disablePopup(JSON.parse(data), 'overview'))
      .catch((error) => console.log(error))
    this.popup_window.classList.add('overview_popup')
    this.background_cover.style.display = 'flex'
  }

  overViewPrint(data, param) {
    if (param !== undefined) {
      setTimeout(() => {
        let text = ''
        param = param.split('_').join('. ')
        for (let i = 0; i < data.length; i++) {
          if (data[i].isdone) {
            text += `<li class="line">${data[i].todo}</li>`
          } else {
            text += `<li>${data[i].todo}</li>`
          }
        }
        const overview = document.querySelectorAll('.overview')
        for (let i = 0; i < overview.length; i++) {
          if (overview[i].childNodes[1].innerText === param) {
            overview[i].childNodes[3].childNodes[1].innerHTML = text
          }
        }
      }, 0)
    }
  }

  overViewServer(param) {
    param = param.split('.').join('_')
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/todos/${param}`, config)
      .then((res) => res.json())
      .then((data) => {
        return JSON.stringify(data)
      })
      .then((data) => this.overViewPrint(JSON.parse(data), param))
      .catch((error) => console.log(error))
  }

  init() {
    calender.changeYearMonth(2022, 1)
  }
}
