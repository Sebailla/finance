import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  async create(createProductsDto: CreateProductsDto) {

    const category = await this.categoryRepository.findOne(
      {
        where: { id: createProductsDto.categoryId },
        select: { id: true, cat_name: true }
      }
    )

    if (!category) {
      throw new NotFoundException(`Category with id ${createProductsDto.categoryId} not found`)
    }

    const product = this.productRepository.create({
      ...createProductsDto,
      category,
    });

    return await this.productRepository.save(product);

  }

  async findAll(category: string | null, take: number, skip: number) {

    const options: FindManyOptions<Product> = {
      relations: { category: true },
      order: { id: 'ASC' },
      take: take,
      skip: skip,
    }

    if (category) {
      options.where = {
        category: {
          id: category
        }
      }
    }

    const [products, total] = await this.productRepository.findAndCount(options)

    return { products, total }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne(
      {
        where: { id },
        relations: { category: true },
        select: { category: { cat_name: true } }
      }
    )

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return product
  }

  async update(id: string, updateProductsDto: UpdateProductsDto) {

    const product = await this.findOne(id)

    Object.assign(product, updateProductsDto)

    if (updateProductsDto.categoryId) {

      const category = await this.categoryRepository.findOne(
        {
          where: { id: updateProductsDto.categoryId },
          select: { id: true, cat_name: true }
        }
      )

      if (!category) {
        throw new NotFoundException(`Category with id ${updateProductsDto.categoryId} not found`)
      }

      product.category = category

    }

    await this.productRepository.save(product)

    return product

  }

  async remove(id: string) {

    const product = await this.findOne(id)

    await this.productRepository.remove(product)

    return {
      message: `Product with id ${id} has been removed`
    }
  }
}