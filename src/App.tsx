import React from 'react';
import logo from './home.png';
import './App.css';
import { useState, useEffect } from 'react';
import { createCaptcha } from "freecaptcha";
import axios from "axios";
import { Wallet } from 'fuels';
import { Fuel, FuelWalletConnector, FueletWalletConnector } from '@fuel-wallet/sdk';
import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Octokit } from 'octokit';
import { TwitterApi } from 'twitter-api-v2';
import { HyperfuelClient, Query } from "@envio-dev/hyperfuel-client";


function App() {
  const [addr, setAddr] = useState('');
  const [hexAddr, setHexAddr] = useState('');
  const [capKey, setCapKey] = useState('');
  const [lastGen, setLastGen] = useState('');
  const [accessVal, setAccessVal] = useState('');
  const [codeVal, setCodeVal] = useState('');
  const [tTokenVal, setTTokenVal] = useState('');
  const [tSecretVal, setTSecretVal] = useState('');
  const [tCodeVal, setTCodeVal] = useState('');

  useEffect(() => {
    async function checkDiscord() {
      var url = window.location.toString();
      var queryString = "";
      var access_token = "";
      if (url.length > 25 && url.indexOf('#') != -1){
        queryString = url.substring(url.indexOf('#') + 1);
        access_token = queryString.substring(31,61);
        setAccessVal(access_token);
      }
      else {
        console.log('not a discord check flow');
        return;
      }
      console.log("access token: ".concat(access_token));
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
    async function checkGithub() {
      var url = window.location.toString();

      var code = "";
      if (url.length > 40 && url.indexOf('code') != -1){
        code = url.substring(url.indexOf('code') + 5);
        setCodeVal(code);
        console.log("github code: ".concat(code));

      }
      else {
        console.log('not a github check flow');
        return;
      }
      if (code.length > 2){
        try{
          const data = {
            code: code,
          }
          console.log(data);
          const response = await axios.post("https://gm-serve3.onrender.com/api/authentix/github", {
            data: data,
        });
        console.log(response.data);
        var toke = response.data.token;
        const octokit = new Octokit({ auth: toke });
        const usr = await octokit.request("GET /user");
        console.log(usr);


        }
        catch (err){
          console.log(err);
        }
      }
      console.log('Successful Fetch');

    }

    checkDiscord();
    checkGithub();
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

  const GithubAuth = async () => {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23liA4WFBMaBVe56Gq&redirect_uri=https://authentix-fuel.netlify.app/&scope=read:user';
  }



  const TwitterAuth = async () => {
    try{

          const response = await axios.post("https://gm-serve3.onrender.com/api/authentix/twitter", {
            data: null,
        });
        console.log(response.data);
        setTTokenVal(response.data.token);
        setTSecretVal(response.data.secret);



        }
        catch (err){
          console.log(err);
        }

  }

  const TwitterComp = async () => {
    const t = tTokenVal;
    const s = tSecretVal;
    const c = tCodeVal;
    try{
          const data = {
            code: c,
            token: t,
            secret: s,
          }
          const response = await axios.post("https://gm-serve3.onrender.com/api/authentix/twitter2", {
            data: data,
        });
        console.log(response.data.tauth.userId);



        }
        catch (err){
          console.log(err);
        }

  }

  const DiscordAuth = async () => {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1252218334699585536&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=identify';
  }

  const QuestAuth = async () => {
    /*const client = HyperfuelClient.new({
    url: "https://fuel-testnet.hypersync.xyz",
  });
    const query= {
    // start query from block 0
    fromBlock: 0,
    // if to_block is not set, query runs to the end of the chain

    inputs: [
      {
        assetId: [
          "0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea",
        ],
      },
    ],
    // fields we want returned from loaded inputs
    fieldSelection: {
      input: [
        "tx_id",
        "block_height",
        "input_type",
        "utxo_id",
        "owner",
        "amount",
        "asset_id",
      ],
    },
  };

  const res = await client.getSelectedData(query);

  console.log(`inputs: ${JSON.stringify(res.data.inputs)}`);*/
    console.log('under maintenance');
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
            <div>Fill in the Order: White - Navy Blue - Red</div>
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
          <a onClick={GithubAuth} style={{"cursor":'pointer'}}> GitHub Verification </a>
          <a>--------------------------------------------</a>

          <a onClick={TwitterAuth} style={{"cursor":'pointer'}}> Twitter Verification Start </a>
          <a>--------------------------------------------</a>
          <a onClick={TwitterComp} style={{"cursor":'pointer'}}> Twitter Verification End </a>
          <label>
            Your Twitter Confirmation Code::
            <input value = {tCodeVal} onChange = {e => setTCodeVal(e.target.value)} />
          </label>
          <a>--------------------------------------------</a>


          <a onClick={GuildAuth} style={{"cursor":'pointer'}}> Guild XYZ Verification </a>
          <a>--------------------------------------------</a>
          <a onClick={QuestAuth} style={{"cursor":'pointer'}}> Onchain Verification </a>
          <a>--------------------------------------------</a>
        </header>
    </div>
  );
}

export default App;
