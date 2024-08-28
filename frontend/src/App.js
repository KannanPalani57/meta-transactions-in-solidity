import React, { useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import Toastr CSS
import './App.css'; // Import your custom CSS
import axios from "axios";

function App() {

  const apiurl = "http://localhost:5000";
  const [provider, setProvider] = useState(null);
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [userActive, setUserActive] = useState(false);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); // Track if the user is signing up

  const [signedMsg, setSignedMsg] = useState("")

  const connectWallet = async () => {
    if (window.ethereum || window.web3) {
      try {
        setLoading(true);
        toastr.options = {
          positionClass: 'toast-top-full-width',
          hideDuration: 200,
          timeOut: 6000,
        };
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        setAccount(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);

        if (isSignUp) {
          // Handle Sign-Up Process
          if (username !== "" && gender !== "") {
            const obj = {
              name: username,
              gender: gender,
              address: accounts[0]
            };
            // const response = await fetch(apiurl + '/api/register', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(obj),
            // });
            // if (response.ok) {
            //   toastr.success('Registration successful! Wallet connected.');
            //   setUserActive(true);
            // } else {
            //   toastr.error('Failed to register');
            // }
          } else {
            toastr.error('All fields are required');
          }
        } else {
          // Handle Sign-In Process
          // await signMessage(accounts[0]);
        }

      } catch (error) {
        console.log(error);
        toastr.error('Failed to connect wallet');
      } finally {
        setLoading(false);
      }
    } else {
      toastr.error('Please install a web3 wallet like MetaMask.');
    }
  };

  const signMessage = async (address) => {
    try {
      const message = `Sign this message to log in to the application. Address: ${address}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      console.log(signature, "===signature")
      const response = await fetch(apiurl + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, signature }),
      });

      if (response.ok) {
        toastr.success('Logged in successfully!');
        setUserActive(true);
      } else {
        toastr.error('Failed to log in');
      }
    } catch (error) {
      console.log(error);
      toastr.error('Failed to sign message');
    }
  };



  const sign = () => {

    console.log(account, "addd");
    window.web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'eth_signTypedData_v4',
      params: [account, signedMsg],
      id: new Date().getTime()
    }, (error, result) => {
      if (error) {
        console.error('Error:', error);
      } else {


        axios.post("http://localhost:8001/maketx", {
          "fromAddress": account,
          "storingName": username,
        "sig": result.result,
         
        }).then(res => {
          console.log(res, "make tx");
        })
        console.log('Signature:', result);
      }
    });

  }


  const getMetaData = () => {
    console.log({
      "fromAddress": account,
      "storingName": username
    })
    axios.post("http://localhost:8001/metadata", {
      "fromAddress": account,
      "storingName": username
    }).then(res => {
      setSignedMsg(JSON.stringify(res.data.data.metatx));
      console.log(res);
    })
  }


  return (
    <div className="app-container">
      <>
        <h1 className="app-title">{isSignUp ? 'User Registration' : 'User Login'}</h1>
        <button onClick={sign}>click</button>
        {isSignUp && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="form-control"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        )}

        <button
          onClick={getMetaData}
          className="btn btn-primary"
          disabled={loading || (!username && isSignUp)}
        >
          Get Metadata
        </button>
        <button
          onClick={sign}
          className="btn btn-primary"
          disabled={loading || (!username && isSignUp)}
        >
          Sign and send transaction
        </button>
        <button
          onClick={connectWallet}
          className="btn btn-primary"
          disabled={loading || (!username && isSignUp)}
        >
          {loading ? 'Connecting...' : isSignUp ? 'Connect wallet' : 'Sign In with Wallet'}
        </button>
        <div className="toggle-signin-signup">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <a href="#" onClick={() => setIsSignUp(false)}>
                Sign In
              </a>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={() => setIsSignUp(true)}>
                Sign Up
              </a>
            </p>
          )}
        </div>
      </>
    </div>
  );
}

export default App;
