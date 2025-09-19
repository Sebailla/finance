import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from '../config/typeORM.config';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/products.entity';



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            useFactory: typeORMConfig,
        }),
        TypeOrmModule.forFeature([Category, Product])
    ],
    providers: [SeedService]
})
export class SeedModule { }
