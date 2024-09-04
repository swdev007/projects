import { ApiProperty } from '@nestjs/swagger';
import { FilterCategory } from 'src/looks/entities/filter-category.entity';
import { FilterMapping } from 'src/looks/entities/filter-mapping.entity';
import { Filter } from 'src/looks/entities/filter.entity';
import { FilterIdsWithCount } from 'src/looks/repositories/look-filter-mapping.repository';
import { FilterModel } from './filter.model';

export class FilterCategoryModel {
  @ApiProperty()
  title: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  children: FilterModel[];

  @ApiProperty()
  count = 0;

  constructor(
    data: FilterCategory,
    child: Filter[] | FilterModel[] | undefined,
    count = 0,
  ) {
    this.id = data.id;
    this.title = data.title;
    this.children = (child ?? []).map((el) => new FilterModel(el));
    this.count = count;
  }

  static covertToFilterCategoryModel(
    allFilters: FilterMapping[],
    filterIdsWithCount: FilterIdsWithCount[] = [],
  ): FilterCategoryModel[] {
    const filterCountMap = {};
    filterIdsWithCount.forEach((e) => {
      filterCountMap[e.filterId] = +e.count;
    });

    const childFilters: Map<string, Filter[]> = new Map<string, Filter[]>();
    const parents: FilterCategory[] = [];

    allFilters.forEach((filterMapping) => {
      if (childFilters.has(filterMapping.filterCategory.id)) {
        childFilters.set(filterMapping.filterCategory.id, [
          ...childFilters.get(filterMapping.filterCategory.id),
          filterMapping.filter,
        ]);
      } else {
        parents.push(filterMapping.filterCategory);
        childFilters.set(filterMapping.filterCategory.id, [
          filterMapping.filter,
        ]);
      }
    });

    const filterCategories = parents.map((parent) => {
      const childFilter = [];
      let count = 0;
      childFilters.get(parent.id).forEach((el) => {
        childFilter.push(new FilterModel(el, filterCountMap[el.id] || 0));
        count = count + +(filterCountMap[el.id] || 0);
      });
      return new FilterCategoryModel(parent, childFilter, count);
    });
    return filterCategories;
  }
}
