import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  create(createCategoryDto: CreateCategoryDto) {

    const category = new Category()
    category.cat_name = createCategoryDto.cat_name

    return this.categoryRepository.save(category)
  }

  findAll() {
    return this.categoryRepository.find()
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    const category = await this.findOne(id)

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    category.cat_name = updateCategoryDto.cat_name

    await this.categoryRepository.save(category)

    return { message: `Category ${category.cat_name} updated` }

  }

  async remove(id: string) {
    const category = await this.findOne(id)

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    await this.categoryRepository.remove(category)

    return { message: `Category ${category.cat_name} deleted`}
  }
}
