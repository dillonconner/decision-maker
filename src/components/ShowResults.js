import React from "react";

const ShowResults = ({result, hideResults}) => {

    console.log(result);
    return (
        <div className="show-results popup">
            <h2 className="popup-header">Results</h2>
            <div className="results-container scrollable">
                <h2>{result.subject} at {result.time}</h2>
                <div className="item-section">
                        <div className="item-section-header">
                            <h3>Winner</h3>
                            <h3>{result.winner.place.name}</h3>
                        </div>
                    <p>People: {result.recipients.length}</p>
                </div>
            </div>
            <button className="submit-btn" onClick={hideResults}>Done</button>
        </div>
    )
}
export default ShowResults