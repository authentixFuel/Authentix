import { createCaptcha } from "freecaptcha";
import axios from "axios";
import converter from "bech32-converting"
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

async function check_guild(){
  const gid = '30930';
  const wallet = '0xcada9c112a91443587adda134644987df5b21028c48afea3cb3b2b137a5b7384';

 const url = 'https://api.guild.xyz/v1/guild/member/'.concat(gid).concat('/').concat(wallet);
  
  try{
    const response = await axios.get(url, {
      data: null,
  });
  
  var i = 0;
  var access_count = 0;
  while (i < response.data.length){
    if (response.data[i].access){
      access_count++;
    }
    i += 1;
  }

  console.log(access_count);
  
 } catch(err){
  console.log("user not found");
 }
}
window.check_guild = check_guild;







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

    try{
      const response = await axios.post("https://worrisome-lion-sneakers.cyclic.app/api/authentix/mouse", {
        data: null,
    });
    console.log(response.data.mouseHuman);
    if (response.data.mouseHuman){
      document.getElementById("mouse_area").innerHTML = `<br/><br/>
        <div style="color: navy; font-size: 2em;">Congratulations. Your mouse movement based authentication is 
        successfully completed. Captcha authentication is one of the steps Authentix App requires
        to generate your successful Proof of Humanity (PoH) authorization.</div>
        <br/><br/>`;
      return 1;
    }
    else {
      return 0;
    }
  }
    
    catch (err){
      console.log(err);
      return 0;
    }
  }
  window.validateByMouse = validateByMouse;
