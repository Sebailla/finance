import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty({ message: 'The Total cannot be empty' })
    @IsNumber({}, { message: 'Invalid Quantity' })
    total: number

    @IsOptional()
    @IsString()
    coupon:string

    @IsArray()
    @ArrayNotEmpty({ message: 'The contents cannot be empty' })
    @ValidateNested()
    @Type(() => TransactionContentsDto)
    contents: TransactionContentsDto[]
}

export class TransactionContentsDto {
    @IsNotEmpty({ message: 'The Product Id cannot be empty' })
    @IsUUID('4', { message: 'Invalid Product Id' })
    productId: string;

    @IsNotEmpty({ message: 'The Quantity cannot be empty' })
    @IsInt({ message: 'Invalid Quantity' }) // Validate quantity too
    quantity: number;

    @IsNotEmpty({ message: 'Te price canot be empty' })
    @IsNumber({}, { message: 'Invalud Price' })
    price: number;
}