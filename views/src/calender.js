'use strict'
import PopUp from './popup.js'

const popup = new PopUp()

export default class Calender {
  constructor() {
    this.calender = document.querySelector('#calendar')
    this.year = document.querySelector('.year')
    this.month = document.querySelector('.month')
    this.table = document.querySelector('.table')
    this.table.addEventListener('click', this.tableClick)
    this.current_year = new Date().getFullYear()
    this.current_month = new Date().getMonth() + 1
    this.current_day = new Date().getDate()

    this.now = document.querySelector('.now')
    this.now.addEventListener('click', this.nowClick)

    this.chooseMonth = document.querySelector('#month_container')
    this.chooseMonth.addEventListener('click', this.monthClick)

    this.left_button = document.querySelector('.before')
    this.right_button = document.querySelector('.after')
    this.left_button.addEventListener('click', () => {
      this.yearChange(-1)
    })
    this.right_button.addEventListener('click', () => {
      this.yearChange(+1)
    })
  }

  yearChange = (diff) => {
    this.current_year = this.current_year + diff
    const header = document.querySelector('.month_container_year sapn')
    header.innerText = this.current_year
  }

  monthClick = (e) => {
    const arr = [
      '01월',
      '02월',
      '03월',
      '04월',
      '05월',
      '06월',
      '07월',
      '08월',
      '09월',
      '10월',
      '11월',
      '12월',
    ]
    const target = e.target
    for (let i = 0; i < arr.length; i++) {
      if (target.innerHTML == arr[i]) {
        this.current_month = i + 1
        break
      }
    }

    const calendar = document.querySelector('.calendar_container')
    calendar.style.display = 'flex'
    const month_container = document.querySelector('.month_container')
    month_container.style.display = 'none'
    this.now.style.visibility = 'visible'
    this.changeYearMonth(this.current_year, this.current_month)
  }

  nowClick = (e) => {
    const calendar = document.querySelector('.calendar_container')
    calendar.style.display = 'none'
    const month_container = document.querySelector('.month_container')
    month_container.style.display = 'flex'
    this.now.style.visibility = 'hidden'
    popup.hide()
  }

  tableClick = (e) => {
    const temp = document.querySelector('.checked')
    if (temp) {
      temp.classList.remove('checked')
    }

    const target = e.target
    target.classList.add('checked')

    this.current_day = target.innerHTML

    const year = String(this.current_year)
    const month = String(this.current_month)
    const day = String(this.current_day)

    popup.disablePopup()

    const popup_today = document.querySelector('.today')
    popup_today.innerHTML = `${year}.${month}.${day}`
  }

  checkLeapYear(year) {
    if (year % 400 == 0) {
      return true
    } else if (year % 100 == 0) {
      return false
    } else if (year % 4 == 0) {
      return true
    } else {
      return false
    }
  }

  getFirstDayOfWeek(year, month) {
    this.change()

    if (month < 10) month = '0' + month

    return new Date(year + '-' + month + '-01').getDay()
  }

  changeYearMonth(year, month) {
    let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (month == 2) {
      if (this.checkLeapYear(year)) month_day[1] = 29
    }

    let first_day_of_week = this.getFirstDayOfWeek(year, month)
    let arr_calendar = []
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

    this.renderCalendar(arr_calendar)
  }

  renderCalendar(data) {
    let h = []
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        h.push('<tr>')
      } else if (i % 7 == 0) {
        h.push('</tr>')
        h.push('<tr>')
      }

      h.push(`<td> ${data[i]} </td>`)
    }
    h.push('</tr>')

    this.calender.innerHTML = h.join('')

    popup.show(this.current_year, this.current_month, this.current_day)
  }

  change() {
    const year = String(this.current_year) + '년'
    const month = String(this.current_month) + '월'

    this.year.innerHTML = year
    this.month.innerHTML = month
  }
}
