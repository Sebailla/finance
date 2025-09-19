import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {

  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
  ){}
  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto);
  }

  async findAll() {
    const [data, total] = await this.couponRepository.findAndCount()
    return { data, total }
  }

  async findOne(id: string) {
    
    const coupon =  await this.couponRepository.findOneBy({id})

    if(!coupon){
      throw new NotFoundException('Coupon not found')
    }

    return coupon
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    
    const coupon = await this.findOne(id)

    if(!coupon){
      throw new NotFoundException('Coupon not found')
    }

    Object.assign(coupon, updateCouponDto)

    await this.couponRepository.save(coupon)

    return {message: 'Coupon updated successfully'}
    
  }

  async remove(id: string) {
    
    const coupon = await this.findOne(id)

    if (!coupon) {
      throw new NotFoundException('Coupon not found')
    }

    await this.couponRepository.remove(coupon)

    return { message: 'Coupon deleted successfully' }
  }

  async applyCoupons(code: string) {
    
    const coupon = await this.couponRepository.findOneBy({code: code})
    
    if(!coupon){
      throw new NotFoundException('Coupon not found')
    }

    const currentdate = new Date()
    const expirationDate = endOfDay(coupon.expirationDate)

    if(isAfter(currentdate, expirationDate)){
      throw new UnprocessableEntityException('Expirated Coupon')
    }

    return {
      message: "valid Coupon",
      ... coupon
    }

  }
}
