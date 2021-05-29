function routes(app, candidates, contract, listOfCandidates, client){
    app.post('/vote', function (req, res) {
       try {
           let candidate = req.body.candidate;
           let from = req.body.from;
           contract.methods.vote(candidate).send({from: from, gas: 120000}).then((result) => {
               // TODO res.json() can be used instead of res.send()
               return res.status(200).send({status: "OK", msg: "Voted successfully."})
           }).catch((err) => {
               let reason = getRevertReason(err.data)
               return res.status(404).send({status: "Error", reason: reason})
           })
       } catch (e) {
           return res.status(404).send({status: "Error", reason: "Undefined"});
        }

    })
    app.post('/get/election-results', (req,res)=>{
        let from = req.body.from
        contract.methods.getElectionResult().call({from: from, gas: 120000}).then((result) => {
            return res.status(200).send({"status": "OK", candidates: listOfCandidates, voteCounts: result[1]})
        }).catch((err) => {
            let reason = getRevertReason(err.data)
            return res.status(404).send({"status": "Error", reason: reason})
        })
    })
    app.post('/get/check-my-vote', (req,res)=>{
        let from = req.body.from
        contract.methods.checkMyVote().call({from: from, gas: 120000}).then((result) => {
            let candidateHexValue = result;
            candidateHexValue = candidateHexValue.toString()
            let candidateName = "";
            const keys = Object.keys(candidates)
            for (let i = 0; i < keys.length; i++) {
                if (candidateHexValue.substr(0, keys[i].length) === keys[i]) {
                    candidateName += candidates[keys[i]].toString();
                }
            }
            return res.status(200).send({"status": "OK", votedCandidate: candidateName})
        }).catch((err) => {
            let reason = getRevertReason(err.data)
            return res.status(404).send({"status": "Error", reason: reason})
        })
    })
    app.get('/candidates', (req, res) => {
        return res.status(200).json({candidates: candidates})
    })
    app.post('/login', (req,res)=>{
        let idNumber = req.body.id_number
        let password = req.body.password

        let loginQuery = "SELECT name, surname, hexvalue FROM voters WHERE password = " + "'" + password
                            + "'" + "AND id_number = " + "'" + idNumber + "';"
        client
            .query(loginQuery, function (err, result) {
                let json = JSON.stringify(result.rows);
                res.writeHead(200, {'content-type':'application/json', 'content-length':Buffer.byteLength(json)});
                res.end(json);
            })
    })

}

/**
 *
 * @param {JSON} err - Error message which has reason
 * @returns String - Reason message
 */
function getRevertReason(err) {

    for (var x in err) {
        if (x.startsWith("0x")) {
            return err[x]["reason"]
        }
    }
    return "Unknown reason";    // sender account not recognized
}

module.exports = routes
