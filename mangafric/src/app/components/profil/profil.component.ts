import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSelectionListChange } from '@angular/material/list';

import { User } from 'src/app/models/user';
import { profilInterface } from 'src/app/models/profil';
import { mangasInterface } from 'src/app/models/mangas';
import { MangasService } from 'src/app/services/mangas.service';
import { ProfilService } from 'src/app/services/profil.service';




@Component({
  selector: 'profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilComponent implements OnInit, OnDestroy {
  user: User | null = null;
  library: Observable<mangasInterface[]>;
  libraryArray: mangasInterface[] = [];
  lenghtLibrary: number = 0;
  profilObservable: Observable<profilInterface[]>;

  private profilSubscription: Subscription;
  private librarySubscription: Subscription;

  constructor(
    public MangasService: MangasService,
    public ProfilService: ProfilService,
  ) {
    this.profilObservable = this.ProfilService.profilObservable

  }

  ngOnInit() {
    this.profilSubscription = this.profilObservable.subscribe((profil) => {
      this.library = this.MangasService.getMangasByIds(profil[0]?.library);

      if (this.library) {
        this.librarySubscription = this.library.subscribe((mangas) => {
          this.lenghtLibrary = mangas.length;
        });
      }
    });
  }

  onSelectionChange(event: MatSelectionListChange) {
    const selectedManga = event.options.map(option => option.value);
    if (event.options[0].selected) {
      this.mangaRead(selectedManga[0]);
    } else {
      this.mangaUnread(selectedManga[0]);
    }
  }

  mangaRead(selectedManga: mangasInterface) {
    this.ProfilService.addLibrary(selectedManga.id, true);
  }

  mangaUnread(selectedManga: mangasInterface) {
    this.ProfilService.removeLibrary(selectedManga.id, true);
  }

  checkIfIsRead(id: string | undefined) {
    return id !== undefined ? this.ProfilService.profil.libraryRead.includes(id) : false;
  }

  drop(event: CdkDragDrop<mangasInterface[]>) {
    if (this.ProfilService.profil) {
      moveItemInArray(this.ProfilService.profil.library, event.previousIndex, event.currentIndex);
      this.ProfilService.updateOrder([...this.ProfilService.profil.library]);
      this.library = this.MangasService.getMangasByIds(this.ProfilService.profil.library);
    }
  }

  ngOnDestroy() {
    if (this.profilSubscription) {
      this.profilSubscription.unsubscribe();
    }

    if (this.librarySubscription) {
      this.librarySubscription.unsubscribe();
    }
  }

}
