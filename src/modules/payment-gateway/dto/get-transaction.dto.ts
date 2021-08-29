import {
    IsEnum,
    IsOptional,
    IsString,
    IsMongoId,
} from 'class-validator';

import {
    TransactionLabels,
    TransactionStatus,
} from '../types/transaction-type';
import { PaginationQueryStringDto } from '../../../common/providers/pagination.dto';

export class UserTransactionFilterDto extends PaginationQueryStringDto {
    @IsOptional()
    @IsString({ message: 'endDate_should_be_string'.toUpperCase() })
    endDate?: string;

    @IsOptional()
    @IsString({ message: 'startDate_should_be_string'.toUpperCase() })
    startDate?: string;

    @IsOptional()
    @IsString({ message: 'label_should_be_string'.toUpperCase() })
    @IsEnum(TransactionLabels, {
        message: 'label_is_invalid'.toUpperCase(),
    })
    label?: TransactionLabels;

    @IsOptional()
    @IsString({ message: 'status_should_be_string'.toUpperCase() })
    @IsEnum(TransactionStatus, {
        message: 'status_is_invalid'.toUpperCase(),
    })
    status?: TransactionStatus;
}

export class AdminTransactionFilterDto extends UserTransactionFilterDto {
    @IsOptional()
    @IsString({ message: 'userId_should_be_string'.toUpperCase() })
    @IsMongoId({
        message: 'userId_should_be_object_id'.toUpperCase(),
    })
    userId?: string;
}
