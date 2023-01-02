// Reliable bluetooth connection implementation
// Copy paste directly to browser

async function sleep(ms) {
  await new Promise((rs,rj)=>{setTimeout(rs,ms)})
}

class BluetoothDevice {
  constructor({ onmessage }) {
    this.device = null;
    // On message is newlined, it will not be pass if without new line
    this.onmessage = onmessage;
    this.buffer = '';
    this.messageId = 0;
    this.debug = false
    // Utilized by Unity API
    this.mailbox = {
      ack: {},
      done: {},
      value: {}
    }

    this.unityMessageCount = 0
    setInterval(() => {
      console.log(`unity/ reach ${this.unityMessageCount / 5} msg/s`)
      this.unityMessageCount = 0
    }, 5000)
  }
  requestDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"],
        filters: [{ namePrefix: "G" }],
      });
      if (!device) {
        console.log("Device not selected");
        return;
      }
      this.device = device;
      // Attach events handler if user have selected
      device.addEventListener("gattserverdisconnected", async () => {
        console.warn("ble/ device disconnected");
        await this.connectDevice(device);
      });
      // await connectDevice(device);

      return device;
    } catch (DOMException) {
      this.device = null;
      return null;
    }
  };
  connectDevice = async () => {
    this.device.isConnected = false;
    try {
      console.log("ble/ connect");
      this.device.server = await this.device.gatt.connect();
      console.log("ble/ get service");
      this.device.service = await this.device.server.getPrimaryService(
        "0000ffe0-0000-1000-8000-00805f9b34fb"
      );
      console.log("ble/ get characteristic");
      this.device.charact = await this.device.service.getCharacteristic(
        "0000ffe1-0000-1000-8000-00805f9b34fb"
      );
      console.log("ble/ start noti");
      await this.device.charact.startNotifications();
      this.device.charact.addEventListener(
        "characteristicvaluechanged",
        async (event) => {
          // await this.onmessage(event);
          const text = new TextDecoder().decode(event.target.value)
          this.buffer += text
          this.buffer = this.buffer.replace('\r', '')

          this.debug && console.log(this.buffer)

          // segment to right newline and then splitlines
          const segment = this.buffer.substring(0,this.buffer.lastIndexOf('\n') + 1)
          this.buffer = this.buffer.substring(
            this.buffer.lastIndexOf('\n') + 1,
            this.buffer.length
          )
          const lines = segment.split('\n')
          lines.forEach(async (line) => {
            await this.onmessage(line)
            // internal process of line for unity
            if (line.startsWith('#')) {
              await this._processUnityResponse(line)
            }
          })
        }
      );
      this.device.isConnected = true;
    } catch (err) {
      console.error("connectDevice", err);
    }
  };
  _processUnityResponse = async (line) => {
    if (line.startsWith('#A')) {
      let numstring = line.substring(2, line.length)
      let num = parseInt(numstring, 10)
    
      this.mailbox.ack[num] = true
    }
    if (line.startsWith('#D')) {
      let numstring = line.substring(2, line.indexOf('\t'))
      let num = parseInt(numstring, 10)
    
      this.mailbox.done[num] = true
      let valuestring = line.substring(line.indexOf('\t'), line.length)
      this.mailbox.value[num] = valuestring
    }

  };
  writeDevice = async (text) => {
    const encoded = new TextEncoder().encode(text);
    // console.log("ble.func.write", { text, encoded });
    if (this.device.isConnected != true) {
      console.warn("device not connected")
      while (this.device.isConnected != true) {
        await new Promise((rs,rj)=>{setTimeout(rs,10)})
      }
    }
    try {
      await new Promise((resolve, reject) => {
        this.device.charact
          .writeValue(encoded)
          .then(() => {
            // console.log("ble/ send ok");
            resolve(true);
            
          })
          .catch((err) => {
            // console.warn("ble/ send error", err);
            resolve(false)
          });
      });

    }
    catch (err) {
      
    }
  };

  //! This is Unity API V0
  _msgid = function () {
    this.messageId += 1
    if (this.messageId == 10) this.messageId = 0
    return this.messageId
  }
  writeCommand = async (command, params, options) => {
    options = options || {}
    const starTime = new Date().getTime()
    const VERSION = 0
    var attempts = 0
    
    
    const id = this._msgid()
    const parameters = [
      '#', id, VERSION, command, ...params
    ]
    var sendString = parameters.join('`') + '\n'
    this.debug && console.log('sendString', sendString)
    // place ack signal wait
    this.mailbox.ack[id] = false
    this.mailbox.done[id] = false
    this.mailbox.value[id] = null
    // place done signal wait
    
    
    await this.writeDevice(sendString)
    this.unityMessageCount += 1;
    // wait for ack command

    if (options.waitResponse == true) {
      while (this.mailbox.ack[id] == false || this.mailbox.done[id] == false) {
        await sleep(1);
      }
      // console.log("acked and done", this.mailbox.value[id])
      return this.mailbox.value[id];

    }
  }
}


async function handleIncomingText(line) {
  // let data = new TextDecoder().decode(event.target.value);
  // data = data.replace('\r', '')

  // console.log("event", JSON.stringify(data))
  // console.log("Line", JSON.stringify(line))
}


setTimeout(async () => {
  const ble = new BluetoothDevice({ onmessage: handleIncomingText});
  await ble.requestDevice()
  await ble.connectDevice()


  window.ble = ble
  while (true) {
    // await ble.writeDevice("#1`10`12`0\n")
    // await ble.writeDevice("#1`10`12`1\n")
    await ble.writeCommand(12, [0])
    await ble.writeCommand(12, [1])
    // await sleep(300)
  }
});

