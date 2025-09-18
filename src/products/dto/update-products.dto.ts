import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsDto } from './create-products.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductsDto extends PartialType(CreateProductsDto) {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Invalid name format' })
    name: string

    image: string

    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Invalid description format' })
    description: string

    @IsNotEmpty({ message: 'Stock is required' })
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Invalid price format' })
    stock: number

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Invalid price format' })
    price: number

    @IsBoolean()
    @Type(() => Boolean)
    status: boolean
}
