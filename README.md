# technical_test-shiftrx

## Dependencies

- Docker
- docker-compose

## Instalation

```
docker-compose up
docker-compose run app npm run db:seed # to seed database
```

## Usage

To access application use the followin URL.

```
http://localhost:3000
```

After running the db seed an admin user will be created with the follow credentials.

```
email: admin@test.com
password: 1234
```

This admin user will be the creator of the auctions.

## Test

Due to time constrains I wrote a few test as a demostration.

### Run test

#### Backend

```
docker-compose run app npm run test
```

#### Frontend

```
docker-compose run next npm run test
```

## TO-DO

- Validate token after user action
- Refresh token after expiration
- Logout user when token expired
