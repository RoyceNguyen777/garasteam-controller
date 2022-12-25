import './App.css';
import { ControllerLeft, ControllerRight, MenuIcon, muteIcon, RocketIcon, settingIcon, SettingIcon, speedIcon, volumnIcon, VolumnIcon, workIcon } from './assets/icons';
import Controller from './components/Controller';
import RangeInput from './components/RangeInput';
import SwitchButton from './components/SwitchButton';

function App() {

  const handleSetting = () => {
    console.log("Setting")
  }
  const handleUp = () => {
    console.log("Button Up")
  }
  const handleDown = () => {
    console.log("Button Down")
  }
  const handleLeft = () => {
    console.log("Button Left")
  }
  const handleRight = () => {
    console.log("Button Right")
  }
  const handleRange = (e) => {
    console.log(e.target.value)
  }
  return (
    <div className="App">
      <div className='header'>
        <ul className='nav'>
          <li className='menu-left'>
            <SwitchButton
              handleTurnOff={() => { console.log("Turn Off") }}
              handleTurnOn={() => { console.log("Turn On") }}
            />
            <SwitchButton
              iconTurnOn={volumnIcon}
              iconTurnOff={muteIcon}
              handleTurnOff={() => { console.log("Mute") }}
              handleTurnOn={() => { console.log("Volumn") }}
            />
            <SwitchButton
              iconTurnOn={speedIcon}
              iconTurnOff={workIcon}
              handleTurnOff={() => { console.log("Mute") }}
              handleTurnOn={() => { console.log("Volumn") }} />
            <SwitchButton
              icon={settingIcon}
              onClick={handleSetting} />
          </li>
          <li className='range'>
            <RangeInput onChange={handleRange} />
          </li>
        </ul>
      </div>
      <div className='controller'>
        <div className='controller-left'>
          <Controller position={"up"} onClick={handleUp} />
          <Controller position={"down"} onClick={handleDown} />
        </div>
        <div className='controller-right'>
          <Controller position={"left"} onClick={handleLeft} />
          <Controller position={"right"} onClick={handleRight} />
        </div>
      </div>
    </div>
  )
}

export default App
