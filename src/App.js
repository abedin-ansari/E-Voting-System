import { ethers } from "ethers";
import * as ReactBootStrap from "react-bootstrap";
import { useState, useEffect } from "react";
import ABIFILE from "./artifacts/contracts/BlockchainVoting.sol/BlockchainVoting.json";
import FatcVoter from "./comp/FatcVoter";
import Propsal from "./comp/Propsal";
import Set from "./comp/FatchCandi";
import Vote from "./comp/Vote";
const ABI = ABIFILE.abi;
const ContractAddress = "0xE984f31e44273844F9B313d66eBED6Eb8e73376D";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isoff, setOff] = useState(false);
  const [loading, setLoading] = useState(false);

  const Dicconnect = async () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        window.localStorage.removeItem("Connected");
        setOff(false);
        window.location.reload();
      } else {
      }
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        Connect();
      }
    }
  }, []);

  const Connect = async (e) => {
    // e.preventDefault();
    setLoading(true);
    if (typeof window.ethereum !== "undefined") {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setOff(true);
      window.localStorage.setItem("Connected", "injected");
      console.log(account);
      setAccount(account);
      document.getElementById("connectbtn").innerHTML = account;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(ContractAddress, ABI, signer);
      setContract(contract);
      console.log(contract);
    }
  };
  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#f5f5f5" }}>
      <div
        className="container mx-auto p-4 rounded-lg shadow-lg"
        style={{
          maxWidth: 1000,
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-3">
            Blockchain Voting System
          </h1>
          <p className="text-muted">
            Please connect to the Sepolia network to continue
          </p>
        </div>

        {/* Connection Controls */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            onClick={Connect}
            id="connectbtn"
            className="btn btn-primary px-4 py-2"
            style={{ minWidth: "150px" }}
          >
            {!loading ? (
              "Connect Wallet"
            ) : (
              <ReactBootStrap.Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>

          <button
            onClick={Dicconnect}
            id="Dissconnectbtn"
            className="btn btn-outline-danger px-4 py-2"
            disabled={!isoff}
            style={{ minWidth: "150px" }}
          >
            Disconnect
          </button>
        </div>

        {/* Main Content */}
        <div className="row g-4">
          {/* Candidates Section */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <Set
                  contract={contract}
                  account={account}
                  provider={provider}
                />
              </div>
            </div>
          </div>

          {/* Voting Section */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <Vote
                  contract={contract}
                  account={account}
                  provider={provider}
                />
              </div>
            </div>
          </div>

          {/* Voters Information */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <FatcVoter
                  contract={contract}
                  account={account}
                  provider={provider}
                />
              </div>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <Propsal
                  contract={contract}
                  account={account}
                  provider={provider}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 pt-4 border-top">
          <p className="text-muted">
            © 2024 Blockchain Voting System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
