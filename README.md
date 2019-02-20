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

## Deploy

```
./deploy.sh <projectname> <environment> <email_domain>
```

## ENV file

To be able to debug locally, create an `env.json` file at the root with:

```json
{
  "LoginLambda": {
    "JWT_SECRET": "my_secret_here",
    "DbTableName": "table-name-here"
  },
  "RefreshLambda": {
    "JWT_SECRET": "my_secret_here"
  },
  "RegisterLambda": {
    "DbTableName": "table-name-here",
    "ValidateSendEmailLambda": "ValidateSendEmailLambda"
  },
  "VerifyLambda": {
    "DbTableName": "table-name-here",
  },
  "ValidateSendEmailLambda": {
    "FromSupportEmail": "email-here",
    "SiteName": "Example Site"
  }
}
```

## TODO
- [ ] Use storage utility
- [x] Add verification step
- [ ] Lock account after number of failed attempts
