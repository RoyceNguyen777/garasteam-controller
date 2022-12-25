import './App.css';
import { ControllerLeft, ControllerRight, MenuIcon, muteIcon, RocketIcon, settingIcon, SettingIcon, speedIcon, volumnIcon, VolumnIcon, workIcon } from './assets/icons';
import Controller from './components/Controller';
import RangeInput from './components/RangeInput';
import SwitchButton from './components/SwitchButton';

const Command = {
  // Reference: __ref.grobot.cpp
  // Port 4
  FrontLightOn: 'W', 
  FrontLightOff: 'w',
  // Port 6
  RelayOn: 'U',
  RelayOff: 'u',
  MoveForward: 'F',
  MoveBackward: 'B',
  MoveStop: 'S',
  RotateLeft: 'L',
  RotateRight: 'R',
  TurnLeft: 'G',
  TurnRight: 'I',
  TurnLeftBack: 'H',
  TurnRightBack: 'J',
  BuzzerOn: 'V',
  BuzzerOff: 'v',
  ServoModeOn: 'X',
  ServoModeOff: 'x',
  ServoDualFlag1: 'E', // dont ask
  ServoDualFlag2: 'e', // dont ask
  // Bất ngờ chưa đéo có số 10 :))
  ServoAngle: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q'], 

  // T là Thăng, k viết dc dấu thăng :)
  PlayNote: {
    C4: 'Y',
    C4T: '......'
    // TODO
  },
}
const ble = {

  isConnected: false,
  uuid: {
    service : '0000FFE0-0000-1000-8000-00805F9B34FB'.toLocaleLowerCase(),
    rx : '0000FFE1-0000-1000-8000-00805F9B34FB'.toLocaleLowerCase(),
    tx : '0000FFE1-0000-1000-8000-00805F9B34FB'.toLocaleLowerCase(),
  },
  device: null,
  server: null,
  service: null,
  handle: {
    onclose: async () => {
      console.log("device is disconnected")
    },
    onopen: async () => {
      console.log("devicec is connected")
    },
    onmessage: async (event) => {
      console.log("Received event", {event})
    }
  },
  charact: {
    tx: null,
    rx: null
  },
  func: {
    write: async (text) => {
      const encoded = new TextEncoder().encode(text)
      console.log('ble.func.write', {text, encoded})
      await ble.charact.tx.writeValue(encoded)
    },
    setup: async () => {
      // step 1: open the panel of devices for user to select
      ble.device = await navigator.bluetooth.requestDevice({
        optionalServices: [ble.uuid.service],
        filters: [
          {namePrefix: 'G'},
          {namePrefix: 'ESP32' },
          {namePrefix: 'B'}
        ],
      })
      // requestDevice will raise exception when user cancel, thus code break header
      ble.device.addEventListener('gattserverdisconnected', ble.handle.onclose)
      // start the connect sequence to the server, effectively setup the connection, this is step 2

      ble.device.gatt.connect()
      console.log('BLE: GATT CONNECTED')
      ble.server = await ble.device.gatt.connect()
      console.log('BLE: SERVER CONNECTED')
      ble.service = await ble.server .getPrimaryService(ble.uuid.service)
      console.log('BLE: SERVICE CONNECTED')
      ble.charact.tx = await ble.service.getCharacteristic(ble.uuid.tx)
      console.log('BLE: CHARACT TX CONNECTED')
      ble.charact.rx = await ble.service.getCharacteristic(ble.uuid.rx)
      console.log('BLE: CHARACT RX CONNECTED')
      ble.charact.rx.startNotifications()
      ble.charact.rx.addEventListener('characteristicvaluechanged', ble.handle.onmessage)
      ble.isConnected = true
    }
  }
}
window.ble = ble

  const click = {
    Connect: async () => {
      await ble.func.setup()
    },
    Disconnect: async ()=> {
      await ble.device.gatt.disconnect()
      ble.isConnected = false
    },
    SendCommand: async (Command) => {
      if (ble.isConnected)
      await ble.func.write(Command)
    },
    Release: async () => {
      console.log("button release")
      await click.SendCommand(Command.MoveStop)
    }
  }



function App() {

  const handleSetting = async() => {
    console.log("Setting")
    if (!ble.isConnected) {
      await ble.func.setup()
    }
    else {
      await click.Disconnect()
    }
  }
  const handleUp = async () => {
    console.log("Button Up")
    await click.SendCommand(Command.MoveForward)

  }
  const handleDown = async () => {
    console.log("Button Down")
    await click.SendCommand(Command.MoveBackward)

  }
  const handleLeft = async () => {
    console.log("Button Left")
        await click.SendCommand(Command.TurnLeft)

  }
  const handleRight = async () => {
    console.log("Button Right")
    await click.SendCommand(Command.TurnRight)

  }
  const handleRelease = async () => {
    console.log("release")
    await click.SendCommand(Command.MoveStop)

  }
  const handleBuzzerOn = async () => {
    console.log("buzzer on")
    await click.SendCommand(Command.BuzzerOn)

  }
  const handleBuzzerOff = async () => {
    console.log("buzzer off")
    await click.SendCommand(Command.BuzzerOff)

  }
  const handleServoMode = async () => {
    console.log("servo mode")
    await click.SendCommand(Command.ServoModeOn)

  }
  const handleMotorMode = async () => {
    console.log("motor mode")
    await click.SendCommand(Command.ServoModeOff)

  }
  const handleRange = async (e) => {
    console.log(e.target.value)
    const value = e.target.value
    console.log('handleRangeChage', {e, value})
    // setRange(value)
    await click.SendCommand(Command.ServoAngle[parseInt(value, 10)])
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
              handleTurnOff={async () => { await handleBuzzerOn()}}
              handleTurnOn={async () => { await handleBuzzerOff() }}
            />
            <SwitchButton
              iconTurnOn={speedIcon}
              iconTurnOff={workIcon}
              handleTurnOff={async () => { await handleServoMode()}}
              handleTurnOn={async () => { await handleMotorMode() }} />
            <SwitchButton
              icon={settingIcon}
              onClick={handleSetting} />
          </li>
          <li className='range'>
            <RangeInput onChange={handleRange} min={0} max={Command.ServoAngle.length} />
          </li>
        </ul>
      </div>
      <div className='controller'>
        <div className='controller-left'>
          <Controller position={"up"} onMouseUp={handleRelease} onClick={handleUp} />
          <Controller position={"down"} onMouseUp={handleRelease} onClick={handleDown} />
        </div>
        <div className='controller-right'>
          <Controller position={"left"} onMouseUp={handleRelease} onClick={handleLeft} />
          <Controller position={"right"} onMouseUp={handleRelease} onClick={handleRight} />
        </div>
      </div>
    </div>
  )
}

export default App
