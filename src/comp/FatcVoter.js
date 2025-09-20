import React from "react";
import { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";

function FatcVoter({ contract, account, provider }) {
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        try {
          setLoading(true);
          // Fetch both voters and candidates
          const [votersList, candidatesList] = await Promise.all([
            contract.getVoter(),
            contract.getCandidate(),
          ]);
          setVoters(votersList);
          setCandidates(candidatesList);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [contract, account]);

  // Helper function to get candidate name from address
  const getCandidateName = (address) => {
    const candidate = candidates.find((c) => c._CandidateAddress === address);
    return candidate ? candidate.name : "Unknown Candidate";
  };

  return (
    <div className="voters-section">
      <h3 className="mb-4">Voting Results</h3>

      {!account ? (
        <div className="alert alert-warning">
          Please connect your wallet to view voting results
        </div>
      ) : loading ? (
        <div className="text-center">
          <ReactBootStrap.Spinner animation="border" variant="primary" />
        </div>
      ) : voters.length === 0 ? (
        <div className="alert alert-info">No votes have been cast yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Voter Name</th>
                <th>Voter ID</th>
                <th>Voted For</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, index) => (
                <tr key={index}>
                  <td>
                    <div>{voter.name}</div>
                    <small className="text-muted">
                      {shortenAddress(voter.voterAddress)}
                    </small>
                  </td>
                  <td>{voter.Id.toString()}</td>
                  <td>
                    <div>{getCandidateName(voter._CandidateAddress)}</div>
                    <small className="text-muted">
                      {shortenAddress(voter._CandidateAddress)}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export default FatcVoter;
