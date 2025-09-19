import { NestFactory } from '@nestjs/core'
import { SeedModule } from './seed/seed.module'
import { SeedService } from './seed/seed.service'

async function bootstrap() {
    const app = await NestFactory.create(SeedModule)
    const seed = app.get(SeedService)
    await seed.seed()
    await app.close()
}

bootstrap()