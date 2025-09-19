import { Type } from "class-transformer"
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator"


export class CreateCouponDto {

    @IsNotEmpty({message: 'Coupon code is required'})
    code: string

    @IsNotEmpty({message: 'Discount is required'})
    @IsInt({message: 'Discount must be between 1 and 100'})
    @Max(100, {message: 'Discount must be between 1 and 100'})
    @Min(1, {message: 'Discount must be between 1 and 100'})
    discount: number

    @IsNotEmpty({message: 'Expiration date is required'})
    @IsDateString({}, {message: 'Invalid expiration date'})
    expirationDate: Date

    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean
}
