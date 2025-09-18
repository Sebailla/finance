import { Type } from "class-transformer"
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateProductsDto {
    
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Invalid name format'})
    name: string
    
    image: string
    
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Invalid description format' })
    description: string
    
    @IsNotEmpty({ message: 'Stock is required' })
    @IsNumber({maxDecimalPlaces: 0}, { message: 'Invalid price format' })
    stock: number
    
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({maxDecimalPlaces: 2}, { message: 'Invalid price format' })
    price: number
    
    @IsBoolean()
    @Type(() => Boolean)
    status: boolean
    
    @IsNotEmpty({ message: 'CategoryId is required' })
    @IsUUID('4', { message: 'Invalid categoryId format' })
    categoryId: string
}
