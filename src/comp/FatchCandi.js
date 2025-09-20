import React from "react";
import { useEffect, useState } from "react";

function FatchCandi({ contract, account, provider }) {
  const [candidates, setCandidate] = useState([]);
  const [winner, setWinner] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        const info = await contract.getCandidate();
        setCandidate(info);

        // Calculate total votes and find winner
        let total = 0;
        let maxVotes = 0;
        let currentWinner = null;

        info.forEach((candidate) => {
          const votes = parseInt(candidate.vote.toString());
          total += votes;
          if (votes > maxVotes) {
            maxVotes = votes;
            currentWinner = candidate;
          }
        });

        setTotalVotes(total);
        setWinner(currentWinner);
      }
    };
    fetchData();
  }, [contract]);

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  // Create a sorted copy of candidates array
  const sortedCandidates = [...candidates].sort(
    (a, b) => parseInt(b.vote.toString()) - parseInt(a.vote.toString())
  );

  return (
    <div className="candidates-section">
      <h3 className="mb-4">Election Results</h3>

      {!account ? (
        <div className="alert alert-warning">
          Please connect your wallet to view results
        </div>
      ) : candidates.length === 0 ? (
        <div className="alert alert-info">No candidates registered yet.</div>
      ) : (
        <>
          {winner && totalVotes > 0 && (
            <div className="winner-section mb-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="card-title text-success mb-3">
                    Current Leading Candidate
                  </h4>
                  <h5 className="mb-2">{winner.name}</h5>
                  <p className="text-muted mb-2">
                    <small>{shortenAddress(winner._CandidateAddress)}</small>
                  </p>
                  <div className="badge bg-success fs-6">
                    {winner.vote.toString()} votes (
                    {calculatePercentage(winner.vote.toString())}%)
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Candidate Name</th>
                  <th>Votes</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {sortedCandidates.map((candidate, index) => (
                  <tr
                    key={index}
                    className={
                      candidate._CandidateAddress === winner?._CandidateAddress
                        ? "table-success"
                        : ""
                    }
                  >
                    <td>
                      <div>{candidate.name}</div>
                      <small className="text-muted">
                        {shortenAddress(candidate._CandidateAddress)}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {candidate.vote.toString()} votes
                      </span>
                    </td>
                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${calculatePercentage(
                              candidate.vote.toString()
                            )}%`,
                          }}
                          aria-valuenow={calculatePercentage(
                            candidate.vote.toString()
                          )}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {calculatePercentage(candidate.vote.toString())}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td>
                    <strong>Total Votes</strong>
                  </td>
                  <td colSpan="2">
                    <strong>{totalVotes} votes cast</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
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

export default FatchCandi;
