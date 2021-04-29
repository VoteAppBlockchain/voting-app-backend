# voting-app-backend

Voting application's backend source code.

## Run

Firstly, you need to install some packages. To install all packages, you can run the following command.

```bash
$ npm install
```

Also, you should install `ganache-cli` to your environment. You can type the following command.

```bash
$ npm install -g ganache-cli
```

After installing packages, you can start the server with the following command.

```bash
$ ganache-cli
```

Firstly, you need to run `ganache-cli` to create avaliable accounts. Then, you can start server.

```bash
$ npm run start
```

You need to see contract address. If you see address, server is running successfully. 

## Endpoints

### Vote

```
Endpoint: http://localhost:8082/vote
JSON Body: 
{
    "candidate": 1,
    "from": "0xB03e6539b5f8D523772925bE5C2eF1e6106c3540"
}
```

You need to give voter account address into `from` in JSON.
