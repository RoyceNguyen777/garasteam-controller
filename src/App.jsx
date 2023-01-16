import "./App.css";
import {
  ControllerLeft,
  ControllerRight,
  MenuIcon,
  muteIcon,
  RocketIcon,
  settingIcon,
  SettingIcon,
  speedIcon,
  volumnIcon,
  VolumnIcon,
  workIcon,
} from "./assets/icons";
import Controller from "./components/Controller";
import RangeInput from "./components/RangeInput";
import SwitchButton from "./components/SwitchButton";
import React, { useState } from "react";
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

Toast.fire({
  icon: "success",
  title: "Hello there",
});


const Command = {
  // Reference: __ref.grobot.cpp
  // Port 4
  FrontLightOn: "W",
  FrontLightOff: "w",
  // Port 6
  RelayOn: "U",
  RelayOff: "u",
  MoveForward: "F",
  MoveBackward: "B",
  MoveStop: "S",
  RotateLeft: "L",
  RotateRight: "R",
  TurnLeft: "I",
  TurnRight: "G",
  TurnLeftBack: "H",
  TurnRightBack: "J",
  BuzzerOn: "V",
  BuzzerOff: "v",
  ServoModeOn: "X",
  ServoModeOff: "x",
  ServoDualFlag1: "E", // dont ask
  ServoDualFlag2: "e", // dont ask
  // Bất ngờ chưa đéo có số 10 :))
  ServoAngle: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "q"],

  // T là Thăng, k viết dc dấu thăng :)
  PlayNote: {
    C4: "Y",
    C4T: "......",
    // TODO
  },
};
const ble = {
  isConnected: false,
  uuid: {
    service: "0000FFE0-0000-1000-8000-00805F9B34FB".toLocaleLowerCase(),
    rx: "0000FFE1-0000-1000-8000-00805F9B34FB".toLocaleLowerCase(),
    tx: "0000FFE1-0000-1000-8000-00805F9B34FB".toLocaleLowerCase(),
  },
  device: null,
  server: null,
  service: null,
  handle: {
    onclose: async () => {
      console.warn("device is disconnected");
    },
    onopen: async () => {
      console.warn("devicec is connected");
    },
    onmessage: async (event) => {
      // console.log("Received event", { event });
    },
  },
  charact: {
    tx: null,
    rx: null,
  },
  func: {
    write: async (text) => {
      const encoded = new TextEncoder().encode(text);
      // console.log("ble.func.write", { text, encoded });
      if (ble.isConnected == false) return
      await new Promise((resolve, reject) => {
        ble.charact.tx.writeValue(encoded).then(() => {
          console.log("send resolved lah");
          resolve();
        }).catch((err) => {
          console.warn("send error", err)
          reject()
        });
      })

    },
    setup: async () => {
      // Must support exponential reconnect
      // https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html
      // function exponentialBackoff(max, delay, toTry, success, fail) {
      //   toTry()
      //     .then((result) => success(result))
      //     .catch((_) => {
      //       if (max === 0) {
      //         return fail();
      //       }
      //       time("Retrying in " + delay + "s... (" + max + " tries left)");
      //       setTimeout(function () {
      //         exponentialBackoff(--max, delay * 2, toTry, success, fail);
      //       }, delay * 1000);
      //     });
      // }
      // function connect() {
      // retry = 10, delay = 2
      //   exponentialBackoff(10, 2,
      //     function toTry() {
      //       console.log("Attempt to connect")
      //       ble.device.gatt.connect().then(server => {
      //         return server.getPrimaryService(ble.uuid.service)
      //       }).then(service => {
      //         return service.getCharacteristic(ble.uuid.tx)
      //       }).then(charact => {
      //         ble.charact.tx = charact
      //         ble.charact.tx.addEventListener('characteristicvaluechanged', ble.handle.onmessage)
      //         ble.isConnected = true
      //         console.log("Charact acquired")
      //       }).catch(err => {
      //         console.log(err)
      //       })
      //     },
      //     function success() {
      //       console.log("BLE: Connect sucecss")
      //     },
      //     function fail() {
      //       console.error("BLE: Failed to connect")
      //     }
      //   )
      // }
      // function onDisconnected() {
      //   console.log("Disconnected")
      //   connect()
      // }
      // navigator.bluetooth.requestDevice({
      //   optionalServices: [ble.uuid.service],
      //   filters: [{namePrefix: 'G'}]
      // }).then(device => {
      //   ble.device = device
      //   ble.device.addEventListener("gattserverdisconnected", onDisconnected);
      //   return connect()
      // }).catch(err => {
      //   console.error("Ble: Error", err)
      // })
      // step 1: open the panel of devices for user to select
      // await new Promise((resolve, reject) => {
      //   navigator.bluetooth.requestDevice({
      //     optionalServices: [ble.uuid.service],
      //     filters: [
      //       { namePrefix: 'G' },
      //       { namePrefix: 'ESP32' },
      //       { namePrefix: 'B' }
      //     ]
      //   }).then(device => {
      //     return device.gatt.connect()
      //   }).then(server => {
      //     return server.getPrimaryService(ble.uuid.service);
      //   }).then(service => {
      //     return service.getCharacteristic(ble.uuid.tx)
      //   }).then(charact => {
      //     ble.charact.tx = charact
      //     // ble.charact.tx.startNotifications()
      //     ble.charact.tx.addEventListener(
      //       "characteristicvaluechanged",
      //       ble.handle.onmessage
      //     );
      //     ble.isConnected = true
      //     console.log("BLE: CONNECTED")
      //     resolve()
      //   })
      //     .catch((err) => {
      //     console.error("BLE", err)
      //     reject()
      //   })
      // })
      // navigator.bluetooth.requestDevice({
      //   optionalServices: [ble.uuid.service],
      //   filters: [
      //     { namePrefix: "G" },
      //     { namePrefix: "ESP32" },
      //     { namePrefix: "B" },
      //   ],
      // }).then(device => {
      // });
      // requestDevice will raise exception when user cancel, thus code break header
      // ble.device.addEventListener("gattserverdisconnected", ble.handle.onclose);
      // start the connect sequence to the server, effectively setup the connection, this is step 2
      // ble.device.gatt.connect();
      // console.log("BLE: GATT CONNECTED");
      // ble.server = await ble.device.gatt.connect();
      // console.log("BLE: SERVER CONNECTED");
      // ble.service = await ble.server.getPrimaryService(ble.uuid.service);
      // console.log("BLE: SERVICE CONNECTED");
      // ble.charact.tx = await ble.service.getCharacteristic(ble.uuid.tx);
      // console.log("BLE: CHARACT TX CONNECTED");
      // // ble.charact.rx = await ble.service.getCharacteristic(ble.uuid.rx);
      // // console.log("BLE: CHARACT RX CONNECTED");
      // ble.charact.tx.startNotifications();
      // ble.charact.tx.addEventListener(
      //   "characteristicvaluechanged",
      //   ble.handle.onmessage
      // );
      // ble.isConnected = true;
      // window.setConnectedState(true);
      // ble.device.gatt.connect();
      // console.log("BLE: GATT CONNECTED");
      // ble.server = await ble.device.gatt.connect();
      // console.log("BLE: SERVER CONNECTED");
      // ble.service = await ble.server.getPrimaryService(ble.uuid.service);
      // console.log("BLE: SERVICE CONNECTED");
      // ble.charact.tx = await ble.service.getCharacteristic(ble.uuid.tx);
      // console.log("BLE: CHARACT TX CONNECTED");
      // // ble.charact.rx = await ble.service.getCharacteristic(ble.uuid.rx);
      // // console.log("BLE: CHARACT RX CONNECTED");
      // ble.charact.tx.startNotifications();
      // ble.charact.tx.addEventListener(
      //   "characteristicvaluechanged",
      //   ble.handle.onmessage
      // );
      // ble.isConnected = true;
      // window.setConnectedState(true);
      //

      async function connect() {
        Toast.fire({
          icon: "success",
          title: "Connecting...",
        });
        ble.isConnected = false
        ble.charact.rx = null
        ble.charact.tx = null
        console.log("BLE: GATT CONNECTED");
        ble.server = await ble.device.gatt.connect();
        // await sleep(1000)
        console.log("BLE: SERVER CONNECTED");
        ble.service = await ble.server.getPrimaryService(ble.uuid.service);
        // await sleep(1000)

        console.log("BLE: SERVICE CONNECTED");
        ble.charact.tx = await ble.service.getCharacteristic(ble.uuid.tx);
        ble.charact.rx = await ble.service.getCharacteristic(ble.uuid.rx);
        // await sleep(1000)

        console.log("BLE: CHARACT TX CONNECTED");
        // ble.charact.rx = await ble.service.getCharacteristic(ble.uuid.rx);
        // console.log("BLE: CHARACT RX CONNECTED");
        await ble.charact.rx.startNotifications();
        ble.charact.rx.addEventListener(
          "characteristicvaluechanged",
          ble.handle.onmessage
        );
        ble.isConnected = true;
        window.setConnectedState(true);

        // await send(Command.ServoAngle[4]);
      }

      ble.device = await navigator.bluetooth.requestDevice({
        optionalServices: [ble.uuid.service],
        filters: [
          { namePrefix: 'G' }
        ]
      })
      ble.device.addEventListener("gattserverdisconnected", async () => { await connect() });
      await connect()
    },
  },
};
window.ble = ble;


async function connect() {
  await ble.func.setup()
  await send(Command.ServoModeOff)

  await window.setCurrentRange(window.currentRange)
}
async function disconnect() {
  await ble.device.gatt.disconnect()
  ble.isConnected = false
  // update the first led
  window.setConnectedState(false)
}

async function send(command) {
  console.log("send", command)
  if (window.ble.isConnected) {
    await window.ble.func.write(command)
    await sleep(33)
  }
}

// 4 button state
const state = {
  MoveForward: false,
  MoveBackward: false,
  TurnLeft: false,
  TurnRight: false
}
window.state = state
window.isSending = false

async function sleep(ms) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function sendToDevice() {
  if (window.isSending) return
  if (ble.isConnected == false) return
  window.isSending = true
  try {
    let isMoving = false
    let isValid = true

    if (state.MoveBackward && state.MoveForward ||
      (state.TurnLeft && state.TurnRight)
    ) {
      console.log("wtf");
      return
    }

    let count = 0
    if (state.MoveBackward) count += 1
    if (state.MoveForward) count += 1
    if (state.TurnLeft) count += 1
    if (state.TurnRight) count += 1

    if (count == 1) {
      if (state.MoveForward) {
        await send(Command.MoveForward)
      }
      if (state.MoveBackward) {
        await send(Command.MoveBackward)
      }
      if (state.TurnLeft) {
        await send(Command.TurnLeft)
      }
      if (state.TurnRight) {
        await send(Command.TurnRight)
      }
    }
    else if (count == 2) {
      if (state.MoveForward) {
        await send(Command.MoveForward)
        state.TurnLeft && await send(Command.TurnLeft)
        state.TurnRight && await send(Command.TurnRight)
      }
      else if (state.MoveBackward) {
        await send(Command.MoveBackward)
        state.TurnLeft && await send(Command.TurnRightBack)
        state.TurnRight && await send(Command.TurnLeftBack)
      }
    }
    else if (count == 0) {
      await send(Command.MoveStop)
    }


    // if (state.MoveForward){
    //   await send(Command.MoveForward)
    //   isMoving = true
    // }
    // else if (state.MoveBackward){
    //   await send(Command.MoveBackward)
    //   isMoving = true
    // }
    // if (state.TurnLeft){
    //   await send(Command.TurnLeft)
    //   isMoving = true
    // }
    // else if (state.TurnRight){
    //   await send(Command.TurnRight)
    //   isMoving = true
    // }



  }
  finally {
    window.isSending = false
  }
}

setInterval(async () => {
  await sendToDevice()
}, 200)


async function handleTouchStart(event, command) {
  state[command] = true
  console.log({ event, command, state })
  await sendToDevice()
}
async function handleTouchMove(event, command) {
  await sendToDevice()
}
async function handleTouchEnd(event, command) {
  console.log({ event, command, state });
  state[command] = false
  await sendToDevice()
}

function App() {
  const [connectedState, setConnectedState] = React.useState(false)
  const [currentRange, setCurrentRange] = React.useState(7)
  const [colorTurnOn, setColorTurnOn] = useState("green")
  const [colorTurnOff, setColorTurnOff] = useState("#CA1617")

  window.setConnectedState = setConnectedState
  window.setCurrentRange = setCurrentRange
  window.currentRange = currentRange

  const handleChangeColorButton = (turnOn, turnOff) => {
    if (turnOn && turnOff) {
      setColorTurnOff(turnOff)
      setColorTurnOn(turnOn)
    }
    return
  }
  const handleSetting = async () => {
    console.log("Setting");
    if (!ble.isConnected) {
      await ble.func.setup();
    } else {
      await disconnect();
    }
  };
  const handleBuzzerOn = async () => {
    console.log("buzzer on");
    await send(Command.BuzzerOn);
  };
  const handleBuzzerOff = async () => {
    console.log("buzzer off");
    await send(Command.BuzzerOff);
  };
  const handleServoMode = async () => {
    console.log("servo mode");
    await send(Command.ServoModeOn);
  };
  const handleMotorMode = async () => {
    console.log("motor mode");
    await send(Command.ServoModeOff);
  };
  const handleRange = async (e) => {

    console.log(e.target.value);
    const value = e.target.value;
    window.setCurrentRange(value)
    console.log("handleRangeChage", { e, value });
    // setRange(value)
    await send(Command.ServoAngle[parseInt(value, 10)]);
  };


  return (
    <div className="App">
      <div className="header">
        <ul className="nav">
          <li className="menu-left">
            <SwitchButton
              backgroundColorTurnOff={colorTurnOff}
              backgroundColorTurnOn={colorTurnOn}
              handleTurnOff={() => {
                console.log("Turn Off");
              }}
              handleTurnOn={() => {
                console.log("Turn On");
              }}
              value={connectedState}
            />
            <SwitchButton
              iconTurnOn={volumnIcon}
              iconTurnOff={muteIcon}
              handleTurnOff={async () => {
                await handleBuzzerOn();
              }}
              handleTurnOn={async () => {
                await handleBuzzerOff();
              }}
            />
            <SwitchButton
              iconTurnOn={speedIcon}
              iconTurnOff={workIcon}
              handleTurnOff={async () => {
                await handleServoMode();
              }}
              handleTurnOn={async () => {
                await handleMotorMode();
              }}
            />
            <SwitchButton icon={settingIcon} onClick={handleSetting} />
          </li>
          <li className="range">
            <RangeInput
              onChange={handleRange}
              min={0}
              max={Command.ServoAngle.length}
              value={currentRange}
            />
          </li>
        </ul>
      </div>
      <div className="controller">
        <div className="controller-left">
          <Controller
            position={"up"}
            onClick={event => event.preventDefault()}
            onTouchStart={async (e) =>
              await handleTouchStart(e, 'MoveForward')
            }
            onTouchMove={async (e) =>
              await handleTouchMove(e, 'MoveForward')
            }
            onTouchEnd={async (e) =>
              await handleTouchEnd(e, 'MoveForward')
            }
          />
          <Controller
            position={"down"}
            onClick={event => event.preventDefault()}
            onTouchStart={async (e) =>
              await handleTouchStart(e, 'MoveBackward')
            }
            onTouchMove={async (e) =>
              await handleTouchMove(e, 'MoveBackward')
            }
            onTouchEnd={async (e) =>
              await handleTouchEnd(e, 'MoveBackward')
            }
          />
        </div>
        <div className="controller-right">
          <Controller
            position={"left"}
            onClick={event => event.preventDefault()}
            onTouchStart={async (e) =>
              await handleTouchStart(e, 'TurnLeft')
            }
            onTouchMove={async (e) =>
              await handleTouchMove(e, 'TurnLeft')
            }
            onTouchEnd={async (e) =>
              await handleTouchEnd(e, 'TurnLeft')
            }
          />
          <Controller
            position={"right"}
            onClick={event => event.preventDefault()}
            onTouchStart={async (e) =>
              await handleTouchStart(e, 'TurnRight')
            }
            onTouchMove={async (e) =>
              await handleTouchMove(e, 'TurnRight')
            }
            onTouchEnd={async (e) =>
              await handleTouchEnd(e, 'TurnRight')
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
