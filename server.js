// require('dotenv').config();
const fs = require("fs")
const express = require('express')
const app = express()
const routes = require('./routes')
const Web3 = require('web3');
const {Client} = require("pg")
const client = new Client({
    user: process.env.PG_USERNAME,
    host: 'localhost',
    database: 'voting_app_db',
    password: process.env.PG_PASSWORD,
    port: 5432,
})
// const mongodb = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const votersJson = require("./voters.json")
app.use(bodyParser.json());

client.connect()
client.query('SELECT NOW()')

client
    .query("SELECT * FROM voters")
    .then(res => console.log(res.rows[0]))
    .catch(e => console.error(e.stack))


let web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

var bytecode = fs.readFileSync('./Voting_sol_Ballot.bin').toString()
var abi = JSON.parse(fs.readFileSync('./Voting_sol_Ballot.abi').toString())
const listOfCandidates = ['Ahmet', 'Mehmet', 'Ramazan']
const votingContract = new web3.eth.Contract(abi);

function readAndSaveJson(voterHexValues) {

    for (let i = 0; i < votersJson.length; i++) {
        console.log(votersJson[i].name)
        console.log(voterHexValues[i+1])
        let insertQuery = "INSERT INTO voters (name, surname, id_number, password, hexvalue) VALUES(" + "'" + votersJson[i].name + "'" + "," + "'" +  votersJson[i].surname + "'" + "," + "'" + votersJson[i].id_number + "'" + "," + "'" + votersJson[i].password +"'" + "," + "'" + voterHexValues[i+1] + "'" + ")"
        console.log(insertQuery)
        client
            .query(insertQuery)
            .then(() => console.log("Voter saved"))
            .catch(e => console.log(e.toString().substr(0, 100)))
    }
}

(async function () {
    const accounts = await web3.eth.getAccounts();
    let candidates = new Map();
    for (let i = 0; i < listOfCandidates.length; i++) {
        candidates[web3.utils.asciiToHex(listOfCandidates[i])] = listOfCandidates[i]
    }
    readAndSaveJson(accounts)
    votingContract.deploy({
        data: bytecode,
        arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name)),
            [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[7]],
            "1629222140", "1629222140"]
    }).send({
        from: accounts[0],
        gas: 5500000,
        gasPrice: web3.utils.toWei('0.00000000000001', 'ether')
    }).then((newContractInstance) => {
        votingContract.options.address = newContractInstance.options.address
        console.log("Contract address: " + newContractInstance.options.address)
    })

    routes(app, candidates, votingContract, listOfCandidates, client)
    app.listen(process.env.PORT || 8082, () => {
        console.log('listening on port ' + (process.env.PORT || 8082));
    })
})();
