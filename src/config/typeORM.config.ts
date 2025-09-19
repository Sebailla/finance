import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeORMConfig= (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    /* host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, */
    entities: [__dirname + '../../**/*.entity.{js,ts}'],
    synchronize: true,
    ssl: true,
    logging: false,
})