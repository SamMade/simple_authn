# simple_authn

## Requirements

* sam-cli
* Node 8.10

## Run

Local Development:
```
npm start
```

Running SAM local:
```
sam local start-api --env-vars env.json
```

Debug:
```
sam local start-api --env-vars env.json --debug-port 5858
```

## ENV file

```
{
  "LoginLambda": {
    "JWT_SECRET": "my_secret_here"
  },
  "RefreshLambda": {
    "JWT_SECRET": "my_secret_here"
  }
}
```

## TODO
- [ ] Use storage utility
- [ ] Add verification step
