# Telemedi - zadanie

### Instalation:

##### 1. Clone repository

##### 2. Install frontend packages:

From root folder

```
cd frontend
npm install
```

##### 3. Start containers:

From root folder run

```
docker-compose up -d
```

##### 4. Install backend packages:

From root folder

```
cd app
composer install
```

##### 4. Run database migrations.

From root folder run

```
docker-compose run --rm php bin/console doctrine:migrations:migrate
```

or from root folder run

```
cd app
docker exec -it  php bash
bin/console doctrine:migrations:migrate
```

##### 5. Open ready project on: http://localhost:3000/

### Tests:

##### Frontend tests:

App tests are in: frontend/src/**tests**/App.test.tsx

To run test:
From root folder run

```
cd frontend
npm run test
```

and press "a" button to run all tests.

##### Backeend tests:

App tests are in: app/tests/api/EndpointsCest.php

To run test:
From root folder run

```
docker exec -it  php bash
bin/console doctrine:database:create --env=test
bin/console doctrine:schema:update --force --env=test
bin/console doctrine:fixtures:load --env=test
php bin/phpunit
```
