<?php

namespace App\DataFixtures;

use App\Story\DefaultTasksStory;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        DefaultTasksStory::load();
    }
}
