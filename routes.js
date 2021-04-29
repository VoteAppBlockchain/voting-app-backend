/**
 * Voter login --> Gökhan 
 * --Government start election--
 * Check my vote --> Dilara
 * Get election result --> Burak
*/
function routes(app, contract){
    app.post('/vote', (req, res) => {
        let candidate = req.body.candidate
        let from = req.body.from
        contract.methods.vote(candidate).send({from: from, gas: 120000}).then((result) => {
            console.log("The result: ", result)
            return res.status(200).send({msg: "Voted successfully."})
        }).catch((err) => {
            var reason = getRevertReason(err.data)
            return res.status(404).send({reason: reason})
        })
    })
    app.post('/register', (req,res)=>{
        console.log("Register endpoint")
        let email = req.body.email
        let idd = "dasdasdasd"
        if(email){
            db.findOne({email}, (err, doc)=>{
                if(doc){
                    res.status(400).json({"status":"Failed", "reason":"Already registered"})
                }else{
                    db.insertOne({email})
                    res.json({"status":"success","id":idd})
                }
            })
        }else{
            res.status(400).json({"status":"Failed", "reason":"wrong input"})
        }
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
    app.post('/upload', (req,res)=>{
        let buffer = req.body.buffer
        let name = req.body.name
        let title = req.body.title
        if(buffer && title){

        }else{
            res.status(400).json({"status":"Failed", "reason":"wrong input"})
        }
    })
    app.get('/access/:email/:id', (req,res)=>{
        if(req.params.id && req.params.email){


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
