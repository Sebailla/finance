import { IsNotEmpty, IsString } from "class-validator"


export class CreateCategoryDto {
    
    @IsString()
    @IsNotEmpty({ message: 'The category name is required' })
    cat_name: string
}
