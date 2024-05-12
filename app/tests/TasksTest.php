<?php

// api/tests/BooksTest.php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Book;
use App\Entity\Task;
use App\Factory\BookFactory;
use App\Factory\TaskFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class TaskTest extends ApiTestCase
{
    use ResetDatabase;
    use Factories;

    private $client;

    protected function setUp(): void
    {
        $this->client  = static::createClient([], [
            'base_uri' => 'http://localhost:8080/',
            'headers' => ['accept' => ['application/ld+json'], 'content-type' => ['application/ld+json']],
        ]);

    }

    public function testGetCollection(): void
    {
        TaskFactory::createMany(10);


        $response = $this->client->request('GET', '/api/tasks', );

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Task',
            '@id' => '/api/tasks',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 10,
        ]);

        $this->assertCount(10, $response->toArray()['hydra:member']);
        $this->assertMatchesResourceCollectionJsonSchema(Task::class);
    }

    public function testCreateTask(): void
    {

        $response = $this->client->request('POST', '/api/tasks', ['json' => [
            'name' => 'test'
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@type' => 'Task',
            'name' => 'test',
        ]);
        $this->assertMatchesRegularExpression('~^/api/tasks/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Task::class);
    }


    public function testCreateInvalidTask(): void
    {
        $response = $this->client->request('POST', '/api/tasks', ['json' => [
            'name' => ''
        ]]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/problem+json; charset=utf-8');

        $this->assertJsonContains([
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    public function testUpdateBook(): void
    {
        TaskFactory::createOne(['name' => 'testName']);

        $iri = $this->findIriBy(Task::class, ['name' => 'testName']);

        $this->client->request('PATCH', $iri, [
            'json' => [
                'name' => 'updated name',
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => 'updated name',
        ]);
    }

    public function testDeleteBook(): void
    {
        TaskFactory::createOne(['name' => 'testName']);

        $iri = $this->findIriBy(Task::class, ['name' => 'testName']);

        $this->client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            static::getContainer()->get('doctrine')->getRepository(Task::class)->findOneBy(['name' => 'testName'])
        );
    }
}
