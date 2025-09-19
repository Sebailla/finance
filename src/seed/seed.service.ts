import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/products.entity';
import { DataSource, Repository } from 'typeorm';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeedService {

    constructor (
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private datasourse: DataSource
    ){}

    // Database clear
    async onModuleInit(){
        const connections =  this.datasourse
        await connections.dropDatabase()
        await connections.synchronize()
    }

    async seed(){
        await this.categoryRepository.save(categories)

        for await (const seedProduct of products){
            const category = await this.categoryRepository.findOneBy({id: seedProduct.categoryId})
            const product = new Product()
            product.name = seedProduct.name
            product.price = seedProduct.price
            product.stock = seedProduct.inventory
            product.image = seedProduct.image
            product.category = category!

            await this.productRepository.save(product)
        }
    }
}
