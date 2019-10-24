import { Movie } from 'src/app/interfaces/movie';
export interface Results {
    results: Movie[];
    page: number;
    itemsPerPage: number;
    resultsCount: number;
}
