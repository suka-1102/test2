const settings = {
  timeLimit: 3,
  gridSize: 50,
  correctAnswersNumber: 0,
  gamesFinishedNumber: 0,
  numberRows: 3,
  difficulty: {
    easy: {
      changeRow: 5
    },
    normal: {
      changeRow: 3
    },
    hard: {
      changeRow: 1
    },
  }
}

const numbersList = document.getElementById("numbers");
const startButton = document.getElementById("startButton")

document.getElementById("timeLimit").textContent = `${settings.timeLimit}秒`;

startButton.addEventListener("click",function() {
  this.classList.add("inActive");
  numbersList.classList.add("isPlaying");
  setGame();
  setTimer(settings.timeLimit)
})


function setGame() {
  numbersList.style.gridTemplateColumns = `repeat(${settings.numberRows}, ${settings.gridSize}px)`
  numbersList.style.gridTemplateRows = `repeat(${settings.numberRows}, ${settings.gridSize}px)`
  const randomNumbers = []
  const startRandomNumber = Math.floor(Math.random() * 100)

  for (let i = 0; i <settings.numberRows ** 2; i++) {
    randomNumbers.push(i + startRandomNumber)
  }
  const maxNumber = randomNumbers[randomNumbers.length - 1]
  const randomArray = randomNumbers.slice()
  for (let i =randomArray.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [randomArray[i],randomArray[randomIndex]] = [randomArray[randomIndex],randomArray[i]]
  }
  numbersList.innerHTML = ""

  for (let i = 0; i < settings.numberRows ** 2; i++) {
    const li = document.createElement("li")
    li.textContent = randomArray[i]
    if (randomArray[i] === maxNumber) {
      li.classList.add("isMaxNumber")
    } 

    li.addEventListener("click", () => {
      settings.gamesFinishedNumber++;
      document.querySelector("#numbers .isMaxNumber").classList.add("isAnswer")
      const iscorrect = randomArray[i] === maxNumber
      if (iscorrect) {
        settings.correctAnswersNumber++
      }
      li.setAttribute("class", iscorrect ? 'correct fa-regular fa-circle': 'inCorrect fa-solid fa-xmark')
    })
    numbersList.appendChild(li)
  }
}
setGame();

// タイマーの処理
function setTimer(time) { 
  const now = new Date()
  const target = new Date(now.setSeconds(now.getSeconds() + time))
  const countdownGaugeInner = document.getElementById('countdownGaugeInner')
  const countdownText = document.getElementById('countdownText');

  (function animation() {
    const remainTime = target - new Date()
    let remainSeconds = Math.floor(remainTime / 1000)
    countdownGaugeInner.style.width = `${(remainTime / 1000 / time) * 100}%`
    if (remainSeconds < 0) {
      remainSeconds = 0
    }
    countdownText.textContent = `残り時間${remainSeconds + 1}秒`
    const id = requestAnimationFrame(animation)

    // タイマーが終わった時の処理
    if (remainTime <= 0) {
      cancelAnimationFrame(id)
      countdownText.textContent = '残り０秒'
      countdownGaugeInner.style.width = '0'
      startButton.classList.remove("inActive");
      numbersList.classList.remove("isPlaying");
    }
  }())
}

