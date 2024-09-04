import { Injectable } from '@angular/core';
import { IToken } from '@shared/interface/interface';
import { Observable } from 'rxjs';
import { ITags } from 'src/app/pages/add-mint/interface/interface';
import { ApiService } from 'src/app/services/api.service';
import { ISearchQuery } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private apiService: ApiService) { }

  searchTokens(query: ISearchQuery): Observable<{ tags: { data: ITags[], count: number }, tokens: { data: IToken[], count: number }, user: { data: [], count: number } } | null> {
    return this.apiService.get('tokens/user/search', { ...query })
  }
}
