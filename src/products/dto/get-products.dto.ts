import { IsNumberString, IsOptional, IsString, IsUUID} from "class-validator";

export class GetProductsQueryDto {
    
    @IsString()
    @IsOptional()
    @IsUUID()
    category_id: string;

    @IsOptional()
    @IsNumberString({}, { message: 'The take must be a number' })
    take: number

    @IsOptional()
    @IsNumberString({}, { message: 'The skip must be a number' })
    skip: number
}