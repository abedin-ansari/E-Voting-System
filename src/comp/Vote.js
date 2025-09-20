import React from "react";
import * as ReactBootStrap from "react-bootstrap";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function Vote({ contract, account, provider }) {
  const [showvote, setshowVote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (contract) {
        try {
          const candidateList = await contract.getCandidate();
          setCandidates(candidateList);
        } catch (err) {
          console.error("Error fetching candidates:", err);
        }
      }
    };
    fetchCandidates();
  }, [contract]);

  const ToVote = () => {
    setshowVote(!showvote);
    setError("");
    setSuccess("");
  };

  const SetVoteFc = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const voterIdInput = document.getElementById("voterId").value;
      const VoterName = document.getElementById("voterName").value;
      const CandidateAddress =
        document.getElementById("CandidateAddress").value;

      // Input validation
      if (!voterIdInput || !VoterName || !CandidateAddress) {
        setError("Please fill all input fields");
        return;
      }

      // Validate VoterId is a valid number
      if (isNaN(voterIdInput) || voterIdInput.includes(".")) {
        setError("Voter ID must be a whole number");
        return;
      }

      // Convert VoterId to BigNumber
      const VoterID = ethers.BigNumber.from(voterIdInput);

      // Validate Ethereum address
      if (!ethers.utils.isAddress(CandidateAddress)) {
        setError("Invalid candidate address");
        return;
      }

      setLoading(true);

      try {
        const signer = await provider.getSigner();
        const contractWithSigner = contract.connect(signer);

        // Get selected candidate name
        const selectedCandidate = candidates.find(
          (c) => c._CandidateAddress === CandidateAddress
        );

        const tx = await contractWithSigner.SetVote(
          VoterID,
          VoterName,
          account.toString(),
          CandidateAddress
        );

        // Wait for transaction confirmation
        await tx.wait();

        setSuccess(
          `Vote submitted successfully for ${
            selectedCandidate?.name || "candidate"
          }!`
        );

        // Show alert with candidate name
        alert(
          `Your vote has been recorded successfully for ${
            selectedCandidate?.name || "the candidate"
          }!`
        );

        setTimeout(() => {
          setshowVote(false);
          window.location.reload();
        }, 2000);
      } catch (err) {
        console.error("Contract Error:", err);
        if (err.reason === "_AlreadyVoted()") {
          setError("You have already voted!");
        } else if (err.reason === "_CandidateNotVoteItSlef()") {
          setError("Candidates cannot vote for themselves!");
        } else {
          setError(err.reason || "Transaction failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (e) => {
    document.getElementById("CandidateAddress").value = e.target.value;
  };

  return (
    <div className="voting-section">
      <h3 className="mb-4">Cast Your Vote</h3>

      <button
        onClick={ToVote}
        disabled={!account}
        className="btn btn-primary mb-4"
      >
        {showvote ? "Cancel" : "Vote Now"}
      </button>

      {showvote && (
        <div className="card mt-3">
          <div className="card-body">
            <form onSubmit={SetVoteFc}>
              <div className="mb-4">
                <div className="alert alert-info">
                  <strong>Connected Address:</strong> {account}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <div className="form-group mb-3">
                <label className="form-label">Voter ID</label>
                <input
                  type="number"
                  id="voterId"
                  className="form-control"
                  placeholder="Enter your voter ID (numbers only)"
                  disabled={loading}
                  min="0"
                  step="1"
                />
                <small className="text-muted">
                  Please enter a whole number
                </small>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  id="voterName"
                  className="form-control"
                  placeholder="Enter your name"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Select Candidate</label>
                <select
                  className="form-select mb-3"
                  onChange={handleCandidateSelect}
                  disabled={loading}
                  required
                >
                  <option value="">Choose a candidate...</option>
                  {candidates.map((candidate, index) => (
                    <option key={index} value={candidate._CandidateAddress}>
                      {candidate.name}
                    </option>
                  ))}
                </select>

                <label className="form-label">Selected Candidate Address</label>
                <input
                  type="text"
                  id="CandidateAddress"
                  className="form-control"
                  placeholder="Candidate's address will appear here"
                  disabled={true}
                  readOnly
                />
                <small className="text-muted">
                  This is the blockchain address of your selected candidate
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <ReactBootStrap.Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Submitting Vote...
                  </div>
                ) : (
                  "Submit Vote"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vote;
