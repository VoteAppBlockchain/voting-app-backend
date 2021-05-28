/**
 * Voter login --> Gökhan 
 * --Government start election--
 * Check my vote --> Dilara
 * Get election result --> Burak
*/

function routes(app, candidates, contract, listOfCandidates){
    app.post('/vote', function (req, res) {
       try {
           let candidate = req.body.candidate;
           let from = req.body.from;
           contract.methods.vote(candidate).send({from: from, gas: 120000}).then((result) => {
               // TODO res.json() can be used instead of res.send()
               return res.status(200).send({msg: "Voted successfully."})
           }).catch((err) => {
               var reason = getRevertReason(err.data)
               return res.status(404).send({reason: reason})
           })
       } catch (e) {
           return res.status(404).send({reason: "Undefined"});
        }

    })
    app.post('/get/election-results', (req,res)=>{
        console.log("Election results endpoint")
        let from = req.body.from
        contract.methods.getElectionResult().call({from: from, gas: 120000}).then((result) => {
            return res.status(200).send({candidates: listOfCandidates, voteCounts: result[1]})
        }).catch((err) => {
            let reason = getRevertReason(err.data)
            return res.status(404).send({reason: reason})
        })
    })
    app.post('/get/check-my-vote', (req,res)=>{
        console.log("My Vote")
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
            return res.status(200).send({votedCandidate: candidateName})
        }).catch((err) => {
            let reason = getRevertReason(err.data)
            return res.status(404).send({reason: reason})
        })
    })
    app.get('/candidates', (req, res) => {
        return res.status(200).json({candidates: candidates})
    })
    app.post('/login', (req,res)=>{
        let email = req.body.email
        if(email){
            db.findOne({email}, (err, doc)=>{
                if(doc){
                    res.json({"status":"success","id":doc.id})
                }else{
                    res.status(400).json({"status":"Failed", "reason":"Not recognised"})
                }
            })
        }else{
            res.status(400).json({"status":"Failed", "reason":"wrong input"})
        }
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
