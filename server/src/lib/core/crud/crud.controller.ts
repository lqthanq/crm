import { Body, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseEntity } from '../entities/base.entity';
import { ICrudService } from './icrud.service';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseQueryDTO, TenantOrganizationBaseDTO } from '../dto';
import { IPagination } from 'src/contracts';
import { AbstractValidationPipe, UUIDValidationPipe } from 'src/lib/shared';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
})
@ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
})
@ApiBearerAuth()
export abstract class CrudController<T extends BaseEntity> {
    protected constructor(private readonly crudService: ICrudService<T>) {}

    /**
     * Get the total count of all records
     */
    @ApiOperation({ summary: 'Get total record count' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Total record count retrieved successfully',
    })
    @Get('count')
    async getCount(@Query() options?: FindOptionsWhere<T>): Promise<number | void> {
        return await this.crudService.countBy(options);
    }

    /**
     * Get a paginated list of records
     */
    @ApiOperation({ summary: 'Get paginated records' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Records retrieved successfully',
    })
    @Get('pagination')
    async pagination(@Query() filter?: BaseQueryDTO<T>, ...options: any[]): Promise<IPagination<T> | undefined> {
        return this.crudService.paginate(filter);
    }

    /**
     * Get all records
     */
    @ApiOperation({ summary: 'Get all records ' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Records retrieved successfully',
    })
    @Get()
    async findAll(filter?: BaseQueryDTO<T>, ...options: any[]): Promise<IPagination<T>> {
        return this.crudService.findAll(filter);
    }

    /**
     * Get a record by ID
     */
    @ApiOperation({ summary: 'Find record by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Record retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Record not found' })
    @Get(':id')
    async findById(@Param('id', UUIDValidationPipe) id: T['id']): Promise<T> {
        return this.crudService.findOneByIdString(id!);
    }

    /**
     * Create a new record
     */
    @ApiOperation({ summary: 'Create new record' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Record created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input provided' })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() entity: DeepPartial<T>): Promise<T> {
        return this.crudService.create(entity);
    }

    /**
     * Update an existing record.
     */
    @ApiOperation({ summary: 'Update existing record' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Record updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Record not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input provided for update' })
    @HttpCode(HttpStatus.ACCEPTED)
    @Put(':id')
    async update(@Param('id', UUIDValidationPipe) id: string, @Body() entity: QueryDeepPartialEntity<T>): Promise<any> {
        return this.crudService.update(id, entity);
    }

    /**
     * Delete a record
     */
    @ApiOperation({ summary: 'Delete record' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Record deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Record not found' })
    @HttpCode(HttpStatus.ACCEPTED)
    @Delete(':id')
    async delete(@Param('id', UUIDValidationPipe) id: string): Promise<any> {
        return this.crudService.delete(id);
    }

    /**
     * Soft deletes a record by ID.
     */
    @ApiOperation({ summary: 'Soft delete a record by ID' })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Record soft deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Record not found' })
    @Delete(':id/soft')
    @HttpCode(HttpStatus.ACCEPTED)
    @UsePipes(new AbstractValidationPipe({ whitelist: true }, { query: TenantOrganizationBaseDTO }))
    async softRemove(@Param('id', UUIDValidationPipe) id: T['id'], ...options: any[]): Promise<T> {
        console.log('options >>', options);
        return await this.crudService.softRemove(id!, options);
    }

    /**
     * Restores a soft-deleted record by ID
     */
    @ApiOperation({ summary: 'Restore a soft-deleted record by ID' })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Record restored successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Record not found or not in a soft-deleted state' })
    @Put(':id/recover')
    @HttpCode(HttpStatus.ACCEPTED)
    @UsePipes(new AbstractValidationPipe({ whitelist: true }, { query: TenantOrganizationBaseDTO }))
    async softRecover(@Param('id', UUIDValidationPipe) id: T['id'], ...options: any[]): Promise<T> {
        return await this.crudService.softRecover(id!, options);
    }
}
