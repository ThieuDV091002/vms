import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], property: string): any[][] {
    if (!collection || !property) return [];

    const grouped = collection.reduce((acc, item) => {
      const key = item[property];
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: any[] });

    return Object.values(grouped);
  }
}