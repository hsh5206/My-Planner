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

    this.addBtn.addEventListener('click', () => {
      this.onAdd()
    })

    this.input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.onAdd()
      }
    })
  }

  disablePopup() {
    this.popup.style.display = 'flex'
  }

  show = (year, month, day) => {
    this.today.innerHTML = `${year}.${month}.${day}`
  }

  hide = () => {
    this.popup.style.display = 'none'
    const temp = document.querySelector('.checked')
    if (temp) {
      temp.classList.remove('checked')
    }
  }

  onAdd() {
    const text = this.input.value
    if (text === '') {
      this.input.focus()
      return
    }

    const item = this.createItem(text)
    this.items.appendChild(item)
    item.scrollIntoView({ block: 'center' })
    this.input.value = ''
    this.input.focus()
  }

  createItem(text) {
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
    checkBtn.addEventListener('click', () => {
      console.log(itemRow)
      itemRow.classList.add('line')
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'item__delete')
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteBtn.addEventListener('click', () => {
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
