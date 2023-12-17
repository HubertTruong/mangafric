import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { mangasInterface } from '../models/mangas';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, combineLatest  } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MangasService {
  private mangasCollection: AngularFirestoreCollection<mangasInterface>;
  user: User | null = null;
  mangas: Observable<mangasInterface[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {
    this.auth.user$.subscribe((user: User | null) => {
      if (user) {
        this.user = user;
      }
    });

    this.mangasCollection = this.afs.collection<mangasInterface>('mangas');

    this.mangas = this.getAllMangas();
  }

  addMangas(mangas: any) {
    if (mangas) {
      this.mangasCollection.add({
        title: mangas.title,
        image: mangas.image,
        description: mangas.description
      });
    }
  }

  getAllMangas(): Observable<any[]> {
    return this.mangasCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<mangasInterface>[]) => {
        return actions.map((action: DocumentChangeAction<mangasInterface>) => {
          const data = action.payload.doc.data() as mangasInterface;
          return { id: action.payload.doc.id, ...data };
        });
      })
    );
  }

  getMangasByIds(ids: string[]): Observable<mangasInterface[]> {
    return combineLatest([
      this.mangas,
      this.getOrderMap(ids)
    ]).pipe(
      map(([items, orderMap]) => {
        const filteredMangas = items.filter(item => item && item.id && ids.includes(item.id));
        const sortedMangas = filteredMangas.sort((a, b) => {
          if (a && b && a.id && b.id) {
            const orderA = orderMap.get(a.id);
            const orderB = orderMap.get(b.id);
            if (orderA !== undefined && orderB !== undefined) {
              return orderA - orderB;
            }
          }
          return 0;
        });
  
        return sortedMangas;
      })
    );
  }

  getOrderMap(ids: string[]): Observable<Map<string, number>> {
    return this.mangas.pipe(
      map(items => {
        const orderMap = new Map<string, number>();
        ids.forEach((id, index) => {
          orderMap.set(id, index);
        });
        return orderMap;
      })
    );
  }

}
