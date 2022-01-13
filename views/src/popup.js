'use strict'

export default class PopUp {
  constructor() {
    this.popup = document.querySelector('.popup')
    this.today = document.querySelector('.today')
    this.button = document.querySelector('.x')
    this.button.addEventListener('click', this.hide)
    this.items = document.querySelector('.items')
    this.input = document.querySelector('.footer__input')
    this.addBtn = document.querySelector('.footer__button')

    this.today_year
    this.today_month
    this.today_day

    this.addBtn.addEventListener('click', () => {
      this.onAdd()
    })

    this.input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.onAdd()
      }
    })
  }

  disablePopup(text) {
    for (let i = 0; i < text.length; i++) {
      this.printToDo(text[i])
    }

    this.popup.style.display = 'flex'
  }

  show = (year, month, day) => {
    this.today.innerHTML = `${year}.${month}.${day}`
    this.today_year = year
    this.today_month = month
    this.today_day = day
  }

  hide = () => {
    const itemRow = document.querySelectorAll('.items > li')
    for (let i = 0; i < itemRow.length; i++) {
      itemRow[i].remove()
    }
    this.popup.style.display = 'none'
    const temp = document.querySelector('.checked')
    if (temp) {
      temp.classList.remove('checked')
    }
  }

  printToDo(data) {
    const text = data.todo
    const item = this.createItem(text, data.isdone)
    this.items.appendChild(item)
    item.scrollIntoView({ block: 'center' })
    this.input.value = ''
    this.input.focus()
  }

  onAdd() {
    const text = this.input.value
    let param = ''
    param = this.today.innerHTML.split('. ').join('_')

    if (text === '') {
      this.input.focus()
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
    /*
    const item = this.createItem(text)
    this.items.appendChild(item)
    item.scrollIntoView({ block: 'center' })
    */
    this.input.value = ''
    this.input.focus()
    this.printToDo({ todo: `${text}` })
  }

  createItem(text, option) {
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
    checkBtn.addEventListener('click', () => {
      let text = itemRow.firstChild.firstChild.innerHTML
      text = String(text)
      let param = ''
      param = this.today.innerHTML.split('.').join('_')
      const config = {
        method: 'post',
        body: JSON.stringify({ todo: text }),
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
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'item__delete')
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteBtn.addEventListener('click', () => {
      let text = itemRow.firstChild.firstChild.innerHTML
      text = String(text)
      let param = ''
      param = this.today.innerHTML.split('. ').join('_')
      const config = {
        method: 'post',
        body: JSON.stringify({ todo: text }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
      fetch(`/todos/${param}/delete`, config)
        .then((res) => res.json())
        .then((response) => console.log('Success: ', response))
        .catch((error) => console.log(error))
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
}
