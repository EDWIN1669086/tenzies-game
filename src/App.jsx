import Die from './components/Die'
import {useState, useEffect} from 'react'
import {nanoid} from 'nanoid'
import Confetti from "react-confetti"

function App() {
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("bestTime")))
  const [gameOver, setGameOver] = useState(false)
  const [dice, setDice] = useState(() => allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollNum, setRollNum] = useState(1)


  useEffect(() => {
    const firstValue = dice[0].value;
    for(const die of dice){
      if(!die.isHeld || die.value != firstValue){
        return
      }
    }
    setTenzies(true)
    setEndTime(new Date())
    setGameOver(prevBool => !prevBool)
    }, [dice])

function initiateSetup(){
  setTenzies(false)
  setDice(allNewDice())
  setStartTime(new Date())
  setRollNum(1)
}

useEffect( () => {
  let timeDiff = endTime - startTime;
  timeDiff /= 1000;
  timeDiff = Math.round(timeDiff)
  let storageTime = !endTime ? 0 : JSON.parse(localStorage.getItem("bestTime"))
  console.log(storageTime)
  console.log(timeDiff)
  if(timeDiff < 0 || storageTime==0 || timeDiff < storageTime){
    setBestTime(timeDiff)
    localStorage.setItem("bestTime", JSON.stringify(timeDiff))
  }
}, [gameOver])

function generateNewDie(){
  return {
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
    id: nanoid()
  }
}

  function allNewDice(){
    const resultArray = []
    for(let i = 0; i < 10; i++){
      resultArray.push(generateNewDie())
    }
    return resultArray
  }

  function rollDice(){
    if(tenzies){
      setTenzies(false)
      setDice(allNewDice())
      setRollNum(1)
    }
    else {
      setDice(prevDice => prevDice.map(
        die => (
          die.isHeld ? 
          die : 
          generateNewDie()
        )
      ))
      setRollNum(num => num+1)
    }
  }

  function holdDice(id){
    setDice(prevDice => prevDice.map(die => die.id === id ? {...die, isHeld: !die.isHeld}: die))
  }

  const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>)

  const bestTimeParagraph = `Best: ${bestTime} s`

  return (
    <main>
      {tenzies && <Confetti/>}
      <div className="title-container">
        <h1 className="title">Tenzies</h1>
        {bestTime !== 0 && <span className="time">{bestTimeParagraph}</span>}
      </div>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <div className="dice-container">
        {diceElements}
      </div>
      {(startTime==0 || tenzies) && <button className="roll-dice" onClick={initiateSetup}>{tenzies ? "Restart" : "Start Game"}</button> }
      {!(startTime==0 || tenzies) && <button className="roll-dice" onClick={rollDice}>
        {`Roll ${rollNum}`}
      </button>}
    </main>
  )
}

export default App
