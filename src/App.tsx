import React from 'react';
import logo from './home.png';
import './App.css';

import { useState, useEffect } from 'react';
import { createCaptcha } from "freecaptcha";
import axios from "axios";
import { Wallet } from 'fuels';
import { Fuel, FuelWalletConnector, FueletWalletConnector } from '@fuel-wallet/sdk';
import { createGuildClient, createSigner } from "@guildxyz/sdk";


function App() {
  const [addr, setAddr] = useState('');
  const [hexAddr, setHexAddr] = useState('');
  const [capKey, setCapKey] = useState('');
  const [lastGen, setLastGen] = useState('');
  const [accessVal, setAccessVal] = useState('');

  useEffect(() => {
    async function checkDiscord() {
      var url = window.location.toString();
      var queryString = "";
      var access_token = "";
      if (url.length > 25){
        queryString = url.substring(url.indexOf('#') + 1);
        access_token = queryString.substring(31,61);
        setAccessVal(access_token);
      }
      console.log("access token: ".concat(access_token));
      console.log(access_token);
      if (access_token.length > 2){
        const url2 = 'https://discord.com/api/v10/oauth2/@me';
        const response = await fetch(url2, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.user.id);
          console.log(data.user.username);

        } else {
          throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
        }
      }
    }

    checkDiscord()
  }, [])





  
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
    const now = Date.now();
    var gen_time = lastGen;
    var el = document.getElementById("captchaTextBox")! as HTMLInputElement;
    var input_val = el.value;

    if (gen_time == ''){
      console.log('no captcha generated');
      GenerateCaptcha();
      el.value = '';
      return;
    }

    const last_gen = Number(gen_time);
    console.log(now - last_gen);
    if (now - last_gen > 30000){
      console.log('timed out captcha');
      document.getElementById('cap_resp')!.textContent = 'Timed Out!';
      GenerateCaptcha();
      el.value = '';
    }
    var captcha_val = capKey;

    console.log(captcha_val);
    console.log(input_val);
    if (input_val == captcha_val){
      console.log('true');
      document.getElementById('cap_resp')!.textContent = 'Success!';
      document.getElementById('cap_area')!.innerHTML = '';
    }
    else {
      console.log('false');
      document.getElementById('cap_resp')!.textContent = 'Captcha Mismatch!';
      GenerateCaptcha();
      el.value = '';
    }
  }

  const DiscordAuth = async () => {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1252218334699585536&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=identify';
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
          <div id="cap_resp" style={{"fontSize": ".6em"}}></div>
          <a>--------------------------------------------</a>
          <a onClick={DiscordAuth} style={{"cursor":'pointer'}}> Discord Verification </a>
          <a>--------------------------------------------</a>

          <a onClick={GuildAuth} style={{"cursor":'pointer'}}> Guild XYZ Verification </a>
        </header>
    </div>
  );
}

export default App;
