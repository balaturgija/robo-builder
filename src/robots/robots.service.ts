import { Inject, Injectable } from '@nestjs/common';
import { OrderItem } from 'sequelize';
import { toRobtDto } from '../base/utils/Mapper.util';
import { Pager } from '../base/utils/Pager.util';
import { PageResult } from '../base/utils/PageResult.util';
import { SortDirection, Sorter } from '../base/utils/Sorter.util';
import { Provider } from '../constants';
import { RobotCreateDto } from './dto/create-robot.dto';
import { RobotFilterDto } from './dto/filter-robot.dto';
import { RobotUpdateDto } from './dto/update-robot.dto';
import { RobotEntity } from './entities/robot.entity';

@Injectable()
export class RobotsService {
    constructor(
        @Inject(Provider.RobotRepository)
        private readonly robotRepository: typeof RobotEntity
    ) {}

    async findAllAsync(query: RobotFilterDto): Promise<PageResult<Robot>> {
        const pager = new Pager(query.page, query.rpp);
        const sorter = new Sorter(query.sortBy, query.sortDirection);
        const orderBy: OrderItem[] = [
            ['id', sorter.direction() ? sorter.direction() : SortDirection.Asc],
        ];

        const options = {
            order: orderBy,
            limit: pager.pageSize(),
            offset: (pager.pageNumber() - 1) * pager.pageSize(),
        };

        const data = await this.robotRepository.findAndCountAll(options);
        return new PageResult<Robot>(
            data.count,
            data.rows.map((x) => toRobtDto(x))
        );
    }

    async getByIdAsync(id: string): Promise<Robot | null> {
        const result = await this.robotRepository.findByPk(id);
        return result !== null ? toRobtDto(result) : null;
    }

    async createAsync(createRobotDto: RobotCreateDto): Promise<Robot> {
        return await this.robotRepository.create(createRobotDto);
    }

    async putAsync(
        id: string,
        robotUpdateDto: RobotUpdateDto
    ): Promise<boolean> {
        return (
            (
                await this.robotRepository.update(robotUpdateDto, {
                    where: { id: id },
                })
            )[0] > 0
        );
    }

    async deleteAsync(id: string): Promise<boolean> {
        return (await this.robotRepository.destroy({ where: { id: id } })) > 0;
    }
}
