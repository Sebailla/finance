import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { GetProductsQueryDto } from './dto/get-products.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation/id-validation.pipe';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductsDto: CreateProductsDto) {
    return this.productsService.create(createProductsDto);
  }

  @Get()
  findAll(@Query() query: GetProductsQueryDto) {

    const category = query.category_id ? query.category_id : null
    const take = query.take ? query.take : 10
    const skip = query.take ? query.take : 0

    return this.productsService.findAll(category, take, skip);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateProductsDto: UpdateProductsDto
  ) {
    return this.productsService.update(id, updateProductsDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.productsService.remove(id);
  }
}
