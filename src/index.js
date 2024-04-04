import { createCaptcha } from "freecaptcha";
import { Fuel, FuelWalletConnector, FueletWalletConnector } from '@fuel-wallet/sdk';

async function connect_fuel(code) {
    const fuel = new Fuel({
        connectors: [
          new FueletWalletConnector(),
          new FuelWalletConnector(),
        ],
      });
      console.log(code);
    const connectors = await fuel.connectors();
    console.log("available connectors", connectors);
    const connectorName = code;
    const isSelected = await fuel.selectConnector(connectorName);
    console.log("isSelected", isSelected);
    const connectionState = await fuel.connect();
    console.log("connectionState", connectionState);
    //const hasConnector = await fuel.hasConnector();
    //console.log("hasConnector", hasConnector);
    
    const accounts = await fuel.accounts();
    console.log("Accounts", accounts);
   
}
window.connect_fuel = connect_fuel;







async function generateCaptcha() {
    var el = document.getElementById('captcha');
    var captcha_val = createCaptcha(el);
    console.log(captcha_val);
    localStorage.setItem("cap_key", captcha_val);
   }
  window.generateCaptcha = generateCaptcha;


  async function validateCaptcha() {
    var captcha_val = localStorage.getItem("cap_key");
    console.log(captcha_val);
    var input_val = document.getElementById("captchaTextBox").value;
    console.log(input_val);
    if (input_val == captcha_val){
        console.log("true");
        document.getElementById("cap_area").innerHTML = `<br/><br/>
        <div style="color: navy; font-size: 2em;">Congratulations. Your captcha based authentication is 
        successfully completed. Captcha authentication is one of the steps Authentix App requires
        to generate your successful Proof of Humanity (PoH) authorization.</div>
        <br/><br/>`;
        return 1;
    }
    else {
        console.log("false");
        return 0;
    }
   }
  window.validateCaptcha = validateCaptcha;


  async function resetCaptcha(){
    localStorage.setItem("cap_key", "");
  }
  window.resetCaptcha = resetCaptcha;


  async function validateByMouse(){
    console.log("true");
  }
  window.validateByMouse = validateByMouse;
