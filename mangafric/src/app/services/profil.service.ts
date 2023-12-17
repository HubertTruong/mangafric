import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { profilInterface } from '../models/profil';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private profilCollection: AngularFirestoreCollection;
  user: User | null = null;
  profil: profilInterface;
  profilObservable: Observable<profilInterface[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {
    this.auth.user$.subscribe((user: User | null) => {
      if (user) {
        this.user = user;
      }
    });

    this.profilCollection = this.afs.collection('profil');
    this.profilObservable = this.getProfilCurrentUser();

    this.profilObservable.subscribe((value) => {
      if (value.length == 0) {
        this.initEmptyLibrary();
      }
      this.profil = value[0];
    });
  }

  getProfilCurrentUser(): Observable<any[]> {
    return this.auth.getUserObservable().pipe(
      filter(user => !!user),
      switchMap(user =>
        this.profilCollection.ref.where(
          'userId', '==', user?.uid
        ).get()
      ),
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
      })
    );
  }

  initEmptyLibrary() {
    if (this.user) {
      this.profilCollection.add({
        library: [],
        libraryRead: [],
        userId: this.user.uid
      });
    }
  }

  updateOrder(mangas: string[]) {
    if (this.user) {
      const query = this.profilCollection.ref.where('userId', '==', this.user?.uid);

      query.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ library: mangas })
            .catch((error) => {
              console.error('Error updating document:', doc.id, error);
            });
        });
      })
      .catch((error) => {
        console.error('Error querying documents:', error);
      });
    }
  }

  addLibrary(id: string | undefined, isRead: boolean) {
    const query = this.profilCollection.ref.where('userId', '==', this.user?.uid);
    const nameLibrary = isRead ? "libraryRead" : "library";

    query.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const currentLibrary = doc.data()?.[nameLibrary] || [];
          const updatedLibrary = [...currentLibrary, id];

          doc.ref.update({ [nameLibrary]: updatedLibrary })
            .catch((error) => {
              console.error('Error updating document:', doc.id, error);
            });
        });
      })
      .catch((error) => {
        console.error('Error querying documents:', error);
      });
  }

  removeLibrary(id: string | undefined, isRead: boolean) {
    const query = this.profilCollection.ref.where('userId', '==', this.user?.uid);
    const nameLibrary = isRead ? "libraryRead" : "library";

    query.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const currentLibrary = doc.data()?.[nameLibrary] || [];
          const updatedLibrary = currentLibrary.filter(function (value: string) {
            return value != id;
          });

          doc.ref.update({ [nameLibrary]: updatedLibrary })
            .catch((error) => {
              console.error('Error updating document:', doc.id, error);
            });
        });
      })
      .catch((error) => {
        console.error('Error querying documents:', error);
      });
  }

}

