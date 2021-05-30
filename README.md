# voting-app-backend

This repo contains the voting application's backend source code. The backend was written in Node.Js. To see mobile code, you can look [here](https://github.com/VoteAppBlockchain/voting_app_mobile).

## Run

Firstly, you need to install some packages. To install all packages, you can run the following command.

```bash
$ npm install
```

To store the voter's information in database, you need to create a new database in PostgreSQL which named as **voting_app_db**. When you run the server, the table and columns are created.

Also, you should install `ganache-cli` to your environment. You can type the following command.

```bash
$ npm install -g ganache-cli
```

After installing packages, you can start the server with the following command.
Firstly, you need to run `ganache-cli` to create avaliable accounts. Then, you can start server.

```bash
$ ganache-cli
```

Important point is that you need to run those commands in different terminals.

```bash
$ npm run start
```

You need to see contract address. If you see address, server is running successfully. 

## Endpoints

### Vote

```json
Endpoint: POST http://localhost:8082/vote
JSON Body: 
{
    "candidate": 1,
    "from": "0xB03e6539b5f8D523772925bE5C2eF1e6106c3540"
}
```

You need to give voter account address into `from` in JSON.

### Get Election Results

```json
Endpoint: POST http://localhost:8082/get/election-results
JSON Body:
{
  "from": "0x2537b143CFC60A8D3ccfC9e6D924C08Baa357899"
}
```

It returns the JSON object which includes the candidates and vote counts for each of them.

### Check My Vote

```json
Endpoint: POST http://localhost:8082/get/check-my-vote
JSON Body:
{
"from": "0x76936384eabE3d811dEFf2af5f63c0A5F116ceDC"
}
```

It checks the vote which is casted by the voter and returns the result to client. 

### Get Candidate List

```json
Endpoint: GET http://localhost:8082/candidates
```

It returns the list of candidate list with hex values

### Login

```json
Endpoint: POST http://localhost:8082/login
{
"id_number": "12345678902",
"password": "12345678"
}
```

Checks the identity number and password and verifies the voter.

## Tech Stack

* Mobile - [Flutter](https://github.com/flutter/flutter)
* Backend - [Node.Js](https://github.com/nodejs/node)
* Database - [PostgreSQL](https://github.com/postgres/postgres)
* Ethereum JavaScript API - [Web3.Js](https://github.com/ChainSafe/web3.js/)
* Smart Contract - [Solidity](https://github.com/ethereum/solidity)


## Team Members

* Gökhan Özeloğlu - [GitHub](https://github.com/gozeloglu)
* Burak Yılmaz - [GitHub](https://github.com/SBurakYlmaz)
* Dilara İşeri - [GitHub](https://github.com/iseridilara)
