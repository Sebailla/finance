import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {

    @IsNotEmpty({message: 'Coupon code is required'})
    code: string
}
