const clock = document.querySelector('h2#clock')

function getClock() {
  const date = new Date()
  //padStart -> 문자열의 길이가 2보다 작으면 앞에 0으로 표시
  const hour = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  clock.innerText = `${hour}:${min}:${second}`
}

getClock() // 00:00:00 말고 바로 렌더링
setInterval(getClock, 1000) //(실행하려는 함수, 수행시간ms)
