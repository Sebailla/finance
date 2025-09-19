import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Max, Min, IsDateString, IsBoolean } from 'class-validator';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
    @IsNotEmpty({ message: 'Coupon code is required' })
    code: string

    @IsNotEmpty({ message: 'Discount is required' })
    @IsInt({ message: 'Discount must be between 1 and 100' })
    @Max(100, { message: 'Discount must be between 1 and 100' })
    @Min(1, { message: 'Discount must be between 1 and 100' })
    discount: number

    @IsNotEmpty({ message: 'Expiration date is required' })
    @IsDateString({}, { message: 'Invalid expiration date' })
    expirationDate: Date

    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean
}
