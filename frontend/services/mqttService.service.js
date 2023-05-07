import { EventEmitter } from "./EventEmitter";
import Paho from "paho-mqtt";
import Toast from "react-native-toast-message";

class MQTTConnection {
    topics = []
    client = null
    _host = 'io.adafruit.com'
    _port = 80
    _id = 'mqtt_' + parseInt(Math.random() * 100000)
    _userName = null
    _password = null   
    emitter = null
    connected = false

    constructor(topics, userName, password) {
      this.topics = topics
      this._userName = userName
      this._password = password
      this.client = new Paho.Client(this._host, this._port, this._id);
      this.emitter = new EventEmitter()
      this.client.onMessageArrived = (this.onMessageArrived).bind(this);
    }
    async connect() {
      if (!this.connected) {
        await this.client.connect({
          onSuccess: (this.onConnect).bind(this),
          onFailure: (this.onFailure).bind(this),
          cleanSession: true,
          timeout: 4,
          userName: this._userName,
          password: this._password,
          keepAliveInterval: 5
        })
      }      
      return this.client
    }
    onMessageArrived({topic, payloadString}) {
      console.log("onMessageArrived:", topic, payloadString);  
      this.emitter.emit(topic,payloadString)       
    }

    async onConnect() {     
      await  Promise.all(this.topics.map((topic)=>{
        this.client.subscribe(topic, { qos: 0 })
        console.log("subscribe");
      }))
      /* for (let topic of this.topics) {
        console.log("Subcribe Topic:", topic);
        this.client.subscribe(topic, { qos: 0 })
      } */
      this.connected = true
      return 
    }
    onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
      this.connected = false;
    }
    onFailure(err) {
      console.log('Connect failed!');
      Toast.show({
        type: "error",
        text1: "Procedure Incomplete",
        text2: err.response.data.reason,
      });
      console.log("Reconnecting");
      //this.connect();
    }

    subcribeTopic(topic,callback) {
      if (!this.topics.includes(topic)) {
        this.emitter.addListener(topic,callback)
        this.topics.push(topic)
        try {
          this.client.subscribe(topic, { qos: 0 });
        } catch (error) {
        }
      }
    }  

    publish(topic, payload) {
      console.log(topic, payload
        );
      this.client.send(topic,payload);
    }  
}

export default MQTTConnection ;