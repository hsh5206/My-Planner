'use strict'
export default class PopUp {
  constructor() {
    this.popup = document.querySelectorAll('.popup')
    this.work = document.querySelector('.work')
    this.today = document.querySelectorAll('.today')
    this.button = document.querySelector('.x')
    this.button.addEventListener('click', this.hide)
    this.items = document.querySelectorAll('.items')
    this.input = document.querySelectorAll('.footer__input')
    this.addBtn = document.querySelectorAll('.footer__button')

    this.today_year
    this.today_month
    this.today_day

    this.num = 0

    this.addBtn[0].addEventListener('click', () => {
      this.onAdd('overview')
    })
    this.addBtn[1].addEventListener('click', () => {
      this.onAdd()
    })

    this.input[0].addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.onAdd('overview')
      }
    })
    this.input[1].addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.onAdd()
      }
    })
  }

  //pass
  disablePopup(text, who) {
    for (let i = 0; i < text.length; i++) {
      this.printToDo(text[i], who)
    }

    if (who === 'overview') {
      this.popup[0].style.display = 'flex'
    } else {
      this.popup[1].style.display = 'flex'
    }
  }

  //pass
  changenow = (year, month, day) => {
    this.today[0].innerHTML = `${year}.${month}.${day}`
    this.today[1].innerHTML = `${year}.${month}.${day}`
    this.today_year = year
    this.today_month = month
    this.today_day = day
  }

  //pass
  hide = (who) => {
    const itemRow = document.querySelectorAll('.items > li')
    itemRow.forEach((node) => {
      node.remove()
    })
    if (who === 'overview') {
      this.popup[0].style.display = 'none'
    } else {
      this.popup[1].style.display = 'none'
      const temp = document.querySelector('.checked')
      if (temp) {
        temp.classList.remove('checked')
      }
    }
  }

  //pass
  printToDo(data, who, param) {
    const text = data.todo
    const item = this.createItem(text, data.isdone, who, param)
    if (who === 'overview') {
      this.items[0].appendChild(item)
    } else {
      this.items[1].appendChild(item)
    }

    item.scrollIntoView({ block: 'center' })
    if (who === 'overview') {
      this.input[0].value = ''
      this.input[0].focus()
    } else {
      this.input[1].value = ''
      this.input[1].focus()
    }
  }

  onAdd(who) {
    let text = ''
    if (who === 'overview') {
      text = this.input[0].value
    } else {
      text = this.input[1].value
    }

    let param = ''
    if (who === 'overview') {
      param = this.today[0].innerHTML.split('.').join('_')
    } else {
      param = this.today[1].innerHTML.split('. ').join('_')
    }

    if (text === '') {
      if (who === 'overview') {
        this.input[0].focus()
      } else {
        this.input[1].focus()
      }
      return
    }

    //server
    const config = {
      method: 'post',
      body: JSON.stringify({ todo: text }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/todos/${param}/add`, config)
      .then((res) => res.json())
      .then((response) => console.log('Success: ', JSON.stringify(response)))
      .catch((error) => console.log(error))
    if (who === 'overview') {
      this.input[0].value = ''
      this.input[0].focus()
      this.printToDo({ todo: `${text}` }, 'overview', param)
    } else {
      this.input[1].value = ''
      this.input[1].focus()
      this.printToDo({ todo: `${text}` })
    }
  }

  createItem(text, option, who) {
    const itemRow = document.createElement('li')
    itemRow.setAttribute('class', 'item__row')

    const item = document.createElement('div')
    item.setAttribute('class', 'item')

    const name = document.createElement('span')
    name.setAttribute('class', 'item__name')
    name.innerText = text

    const buttons = document.createElement('div')
    buttons.classList.add('buttons')

    const checkBtn = document.createElement('button')
    checkBtn.setAttribute('class', 'item__delete')
    checkBtn.innerHTML = '<i class="fas fa-check"></i>'

    if (option === 1) {
      itemRow.classList.add('line')
    } else {
      itemRow.classList.remove('line')
    }
    checkBtn.addEventListener('click', (who) => {
      let text = itemRow.firstChild.firstChild.innerHTML
      text = String(text)
      let param = ''
      if (who === 'overview') {
        param = this.today[0].innerHTML.split('. ').join('_')
      } else {
        param = this.today[1].innerHTML.split('. ').join('_')
      }
      this.checkNumFromServer(param, text, itemRow)
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'item__delete')
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteBtn.addEventListener('click', (who) => {
      let text = itemRow.firstChild.firstChild.innerHTML
      text = String(text)

      let param = ''
      if (who === 'overview') {
        param = this.today[0].innerHTML.split('. ').join('_')
      } else {
        param = this.today[1].innerHTML.split('. ').join('_')
      }
      this.deleteNumFromServer(param, text)
      itemRow.remove()
    })

    const itemDivider = document.createElement('div')
    itemDivider.setAttribute('class', 'item__divider')

    buttons.appendChild(checkBtn)
    buttons.appendChild(deleteBtn)
    item.appendChild(name)
    item.appendChild(buttons)

    itemRow.appendChild(item)
    itemRow.appendChild(itemDivider)
    return itemRow
  }

  deleteNumFromServer(param, text) {
    param = param.split('.').join('_')
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/todos/${param}`, config)
      .then((res) => res.json())
      .then((data) => JSON.stringify(data))
      .then((data) => this.delete(JSON.parse(data), param, text))
      .catch((error) => console.log(error))
  }

  delete(data, param, text) {
    const config = {
      method: 'post',
      body: JSON.stringify({ num: data[0].num, todo: text }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/todos/${param}/delete`, config)
      .then((res) => res.json())
      .then((response) => console.log('Success: ', response))
      .catch((error) => console.log(error))
  }

  checkNumFromServer(param, text, itemRow) {
    param = param.split('.').join('_')
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`/todos/${param}`, config)
      .then((res) => res.json())
      .then((data) => JSON.stringify(data))
      .then((data) => this.check(JSON.parse(data), param, text, itemRow))
      .catch((error) => console.log(error))
  }

  check(data, param, text, itemRow) {
    const config = {
      method: 'post',
      body: JSON.stringify({ num: data[0].num, todo: text }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (itemRow.classList.contains('line')) {
      itemRow.classList.remove('line')
      fetch(`/todos/${param}/undone`, config)
        .then((res) => res.json())
        .then((response) => console.log('Success: ', response))
        .catch((error) => console.log(error))
    } else {
      itemRow.classList.add('line')
      fetch(`/todos/${param}/done`, config)
        .then((res) => res.json())
        .then((response) => console.log('Success: ', response))
        .catch((error) => console.log(error))
    }
  }
}
