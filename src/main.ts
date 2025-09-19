import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
    }
  ))
  app.useStaticAssets(join(__dirname, '../public')) // para uso de imagenes en la carpeta /public - localhost:3001/img/1.jpg
  await app.listen(process.env.PORT ?? 3001)
}

bootstrap()
