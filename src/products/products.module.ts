import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category])
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
