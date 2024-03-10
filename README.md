# mirrorl2-coordinator

## API

### address

```
curl -i -XPOST http://localhost:5000/address/multisig -H "Content-Type: application/json" -d '{
  "m": 3,
  "pubkeys": [
    "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
    "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
    "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9",
    "02c34eb264260da82e20fc72a38b7866b23e33b0b46f88656cb186a819adfd54ab",
    "03d832ed3abd2c350581c8dfbe8a55958fa2fcf00bd38bfc86008b19e8c9bdbb31"
  ]
}'
```

### node

```
curl -i -XGET http://localhost:5000/nodes
curl -i -XGET http://localhost:5000/nodes/active
curl -i -XGET http://localhost:5000/nodes/pending

curl -i -XPOST http://localhost:5000/node/online-proof -H "Content-Type: application/json" -d '{
  "id": "0x347ba66e4d8Bb18601ba03e2b32cEb22c8A8cBD8 ", "endTime": 0, "interval": 3600}'
```

### group

```
curl -i -XGET http://localhost:5000/groups
curl -i -XGET http://localhost:5000/group/1
```

### deposit

```
curl -i -XGET http://localhost:5000/deposit/status/0x48bb0493db752c325164a51197e43e7733797496cbab9db20ffd36e0a030af61
curl -i -XPOST http://localhost:5000/deposit/send -H "Content-Type: application/json" -d '{
  "receipt": "0x48bb0493db752c325164a51197e43e7733797496cbab9db20ffd36e0a030af61"}'
```

### withdraw

```
curl -i -XGET http://localhost:5000/withdraw/status/0x48bb0493db752c325164a51197e43e7733797496cbab9db20ffd36e0a030af61
curl -i -XPOST http://localhost:5000/withdraw/send -H "Content-Type: application/json" -d '{
  "receipt": "0x48bb0493db752c325164a51197e43e7733797496cbab9db20ffd36e0a030af61"}'
```
