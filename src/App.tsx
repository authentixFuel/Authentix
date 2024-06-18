import React from 'react';
import logo from './home.png';
import './App.css';

import { useState } from 'react';
import { createCaptcha } from "freecaptcha";
import axios from "axios";
import { Wallet } from 'fuels';
import { Fuel, FuelWalletConnector, FueletWalletConnector } from '@fuel-wallet/sdk';
import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Client } from "discord.js";


function App() {
  const [addr, setAddr] = useState<string | ''>();
  const [hexAddr, setHexAddr] = useState('');
  const [capKey, setCapKey] = useState<string | ''>();
  const [lastGen, setLastGen] = useState('');
  const [codeVal, setCodeVal] = useState('');


  
  const GenerateCaptcha = async () => {
    console.log('hi');
    var el = document.getElementById('captcha')! as HTMLCanvasElement;
    var captcha_val = createCaptcha(el);
    console.log(captcha_val);
    setCapKey(captcha_val);
    localStorage.setItem("cap_key", captcha_val);
    const now = Date.now();
    setLastGen(now.toString());
  }
 


  const MouseAuth = async () => {
    try{
      const response = await axios.post("https://gm-serve3.onrender.com/api/authentix/mouse", {
        data: null,
    });
    console.log(response.data.mouseHuman);
    if (response.data.mouseHuman){
      document.getElementById("mouse_area")!.innerHTML = `<br/><br/>
        <div style="color: pink; font-size: .6em;">Congratulations. Your mouse movement based authentication is
        successfully completed. Captcha authentication is one of the steps Authentix App requires
        to generate your successful Proof of Humanity (PoH) authorization.</div>
        <br/><br/>`;
        document.getElementById('mv')!.style.display = 'none';
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

  const CaptchaAuth = async () => {
    console.log('hii');
  }

  const DiscordAuth = async () => {
    console.log(lastGen);
  }

  const GuildAuth = async () => {
    const gid = '30930';
    const wallet = hexAddr || '';

    if (wallet == ''){
      console.log('Please connect a wallet');
      return;
    }
    const guildClient = createGuildClient("Authentix");

    const userGuilds = await guildClient.user
      .getMemberships(wallet);
    console.log(userGuilds);
    var roles = [0];
    var joined = '';
    var i = 0;
    while (i < userGuilds.length){
      if (userGuilds[i].guildId == 30930){
        roles = userGuilds[i].roleIds;
        joined = userGuilds[i].joinedAt.toString();
        joined = joined.substring(0, 10);
      }
      i++;
    }
    console.log(roles);
    const joined_ts = new Date(joined).getTime() / 1000;
    console.log(joined_ts);
  }


  



  const Login = async (code: string) => {
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
    const wallet = Wallet.fromAddress(accounts[0].toString());
    const evmWallet = wallet.address.toB256();
    console.log(evmWallet);
    setAddr(accounts[0].toString());
    setHexAddr(evmWallet);


  }
  
  

  return (
    <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          <a
            className="App-link"
            href="https://authentix.medium.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Authentix Demo
          </a>
          <br/>

          <a onClick={()=>Login('fuel')} style={{"cursor":'pointer'}}> Fuel Login </a>
          <a>--------------------------------------------</a>
          <a onClick={()=>Login('fuelet')} style={{"cursor":'pointer'}}> Fuelet Login </a>
          <a>--------------------------------------------</a>
          <a id="mv" onClick={MouseAuth} style={{"cursor":'pointer'}}> Mouse Based Verification </a>
          <div id="mouse_area"></div>
          <a>--------------------------------------------</a>
          <a onClick={GenerateCaptcha} style={{"cursor":'pointer'}}> Captcha Based Verification </a>
           <div id="cap_area">
        <div>Fill in the Order: White - Blue - Red</div>
        <div>Ignore All Other Colors</div>



            <br/>

            <br/> <br/>
            <canvas id="captcha" width="200" height="100"></canvas>
            <form id="cap_form">

              <input type="text" placeholder="Captcha" id="captchaTextBox" height="120"/>
              <button type="button"  onClick={CaptchaAuth}>Submit</button>
            </form>
      </div>
      <a>--------------------------------------------</a>
          <a onClick={DiscordAuth} style={{"cursor":'pointer'}}> Discord Verification </a>
          <a>--------------------------------------------</a>

          <a onClick={GuildAuth} style={{"cursor":'pointer'}}> Guild XYZ Verification </a>
        </header>
    </div>
  );
}

export default App;
