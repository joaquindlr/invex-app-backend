import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwtAuth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '../../application/createCategory.uc';
import { GetCategoriesByBusinessUseCase } from '../../application/getCategoriesByBusiness.uc';
import { GetCategoryUseCase } from '../../application/getCategory.uc';
import { UpdateCategoryUseCase } from '../../application/updateCategory.uc';
import { DeleteCategoryUseCase } from '../../application/deleteCategory.uc';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUc: CreateCategoryUseCase,
    private readonly getCategoriesByBusinessUc: GetCategoriesByBusinessUseCase,
    private readonly getCategoryUc: GetCategoryUseCase,
    private readonly updateCategoryUc: UpdateCategoryUseCase,
    private readonly deleteCategoryUc: DeleteCategoryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada con éxito.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createCategoryUc.execute(createCategoryDto);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Listar todas las categorías de una empresa' })
  @ApiResponse({ status: 200, description: 'Listado de categorías.' })
  findAllByBusiness(@Param('businessId', ParseUUIDPipe) businessId: string) {
    return this.getCategoriesByBusinessUc.execute(businessId);
  }

  @Get(':id/business/:businessId')
  @ApiOperation({ summary: 'Obtener una categoría específica' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ) {
    return this.getCategoryUc.execute(id, businessId);
  }

  @Patch(':id/business/:businessId')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateCategoryUc.execute(id, businessId, updateCategoryDto);
  }

  @Delete(':id/business/:businessId')
  @ApiOperation({ summary: 'Eliminar una categoría (soft delete)' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ) {
    return this.deleteCategoryUc.execute(id, businessId);
  }
}
