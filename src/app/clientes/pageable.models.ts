import { Cliente } from './cliente';
export interface SortPageable{
    empty:    boolean;
    sorted:   boolean; 
    unsorted: boolean;
}

export interface Pageable{

}
export interface PaginatorCliente{
    content:          Cliente[];
    pageable:         Pageable;
    last:             boolean;
    totalElements:    number;
    totalPages:       number; 
    size:             number;
    number:           number;
    sort:             SortPageable;
    first:            boolean;
    numberOfElements: number;
    empty:            boolean;
} 