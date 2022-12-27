import './App.css';
import React from 'react'
/*

*/
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
      
    }
  }
}

window.ble = ble

function App() {
  const [range, setRange] = React.useState(Command.ServoAngle.length)

  const handleRangeChange = async (event) => {
    const value = event.target.value
    console.log('handleRangeChage', {event, value})

    setRange(value)
    await click.SendCommand(Command.ServoAngle[parseInt(value, 10)])
  }
  

  const click = {
    Connect: async () => {
      await ble.func.setup()
    },
    Disconnect: async ()=> {
      await ble.device.gatt.disconnect()
    },
    SendCommand: async (Command) => {
      await ble.func.write(Command)
    },
    Release: async () => {
      console.log("button release")
      await click.SendCommand(Command.MoveStop)
    }
  }

  const CommonButtonStyle = {
    width: '200px',
    height: '100px',
    background: '#fff',
    margin: '5px'
  }
  return (
    <div className="App">
      <header className="App-header">
        <input type='range' min={0} max={Command.ServoAngle.length} value={range} onChange={handleRangeChange}></input>

        <button style={CommonButtonStyle} onMouseDown={click.Connect}>Connect</button>
        <button style={CommonButtonStyle} onMouseDown={click.Disconnect}>Disconnect</button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.BuzzerOn)}}
        >
          Buzzer On
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.BuzzerOff)}}
          // onMouseUp={() => {click.Release()}}
        >
          Buzzer Off
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.MoveForward)}}
          onMouseUp={() => {click.Release()}}
        >
          Forwarwd
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.MoveBackward)}}
          onMouseUp={() => {click.Release()}}
        >
          Backward
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.TurnLeft)}}
          onMouseUp={() => {click.Release()}}
        >
          Turn LEFT
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.TurnRight)}}
          onMouseUp={() => {click.Release()}}
        >
          Turn RIGHT
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.MoveStop)}}
          onMouseUp={() => {click.Release()}}
        >
          STOPPPPPPPP
        </button>
        <button style={CommonButtonStyle} 
          onMouseDown={() => {click.SendCommand(Command.ServoModeOn)}}
          onMouseUp={() => {click.Release()}}
        >
          ServoMode
        </button>
      </header>
    </div>
  );
}

export default App;
