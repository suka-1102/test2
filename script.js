const settings = {
  timeLimit: 10,
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

const initSettings = JSON.parse(JSON.stringify(settings))
const numbersList = document.getElementById("numbers");
const startButton = document.getElementById("startButton")
const correctAnswers = document.getElementById("correctAnswers")

document.getElementById("timeLimit").textContent = `${settings.timeLimit}秒`;

startButton.addEventListener("click",function() {
  this.classList.add("inActive");
  numbersList.classList.add("isPlaying");

  settings.numberRows = initSettings.numberRows
  settings.correctAnswersNumber = initSettings.correctAnswersNumber
  settings.gamesFinishedNumber = initSettings.gamesFinishedNumber

  correctAnswers.textContent = ''
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

      const currentDifficulty = document.querySelector('form[name="selectDifficultyLevel"]')
      if (settings.gamesFinishedNumber % settings.difficulty[currentDifficulty.difficultyLevel.value].changeRow === 0) {
        settings.numberRows++;
      }
      
      document.querySelector("#numbers .isMaxNumber").classList.add("isAnswer")
      const iscorrect = randomArray[i] === maxNumber
      if (iscorrect) {
        settings.correctAnswersNumber++
      }
      li.setAttribute("class", iscorrect ? 'correct fa-regular fa-circle': 'inCorrect fa-solid fa-xmark')
      setTimeout(() => {
        setGame()
      }, 500)
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
    
    let remainSecondsNotFloor = remainTime / 1000
    // ゲージの色の処理
    if (remainSecondsNotFloor <= (settings.timeLimit / 5)) {
      countdownText.style.color = "red"
      countdownGaugeInner.style.backgroundColor = "red";
      numbersList.style.backgroundColor = "red"
      numbersList.style.color = "red"
    }
    else if (remainSecondsNotFloor <= (settings.timeLimit / 2)) {
      countdownText.style.color = "orange"
      countdownGaugeInner.style.backgroundColor = "orange";
      numbersList.style.backgroundColor = "orange";
      numbersList.style.color = "orange";
    }
    if (remainSeconds < 0) {
      remainSeconds = 0
      countdownText.style.color = "#333"
      countdownGaugeInner.style.backgroundColor = "#666";
      numbersList.style.backgroundColor = "#333";
      numbersList.style.color = "#333";

    }
    countdownText.textContent = `残り時間${remainSeconds + 1}秒`
    const id = requestAnimationFrame(animation)

    // タイマーが終わった時の処理
    if (remainTime <= 0) {
      cancelAnimationFrame(id)
      correctAnswers.textContent = `正答数:${settings.correctAnswersNumber} / ${settings.gamesFinishedNumber}回中`
      countdownText.textContent = '残り０秒'
      countdownGaugeInner.style.width = '0'
      startButton.classList.remove("inActive");
      numbersList.classList.remove("isPlaying");
    }
  }())
}

