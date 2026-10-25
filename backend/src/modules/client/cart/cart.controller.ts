import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { DeleteCartItemDto } from './dto/delete-cart-item.dto';
import { JwtAuthGuard } from 'src/modules/client/auth/guards/jwt.guard';
import { GetUserSession } from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';

@Controller('cart')
@ApiTags('Client - Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.cartService.addToCart(sessionData.user.id, addToCartDto);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.cartService.updateCartItem(
      sessionData.user.id,
      updateCartItemDto,
    );
  }

  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  async deleteCartItem(
    @Body() deleteCartItemDto: DeleteCartItemDto,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.cartService.deleteCartItem(
      sessionData.user.id,
      deleteCartItemDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@GetUserSession() sessionData: UserSessionType) {
    return await this.cartService.getCart(sessionData);
  }
}
