import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { mangasInterface } from '../models/mangas';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';


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

}
