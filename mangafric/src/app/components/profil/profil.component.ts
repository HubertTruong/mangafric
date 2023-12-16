import { Component } from '@angular/core';
import { User } from 'src/app/models/user';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  user: User | null = null;

  mangas: { title: string; image: string; }[] = [
    {
      title: 'Jujutsu Kaisen',
      image: 'https://m.media-amazon.com/images/I/71PBZJaSmAL._AC_UF894,1000_QL80_.jpg',
    },
    {
      title: 'One Piece',
      image: 'https://m.media-amazon.com/images/I/71y+XnBXm4L._AC_UF894,1000_QL80_.jpg',
    },
    {
      title: 'Berserk',
      image: 'https://m.media-amazon.com/images/I/91D07epNE9L._AC_UF894,1000_QL80_.jpg',
    },
    {
      title: 'Kingdom',
      image: 'https://m.media-amazon.com/images/I/91IhAnTuK8L._AC_UF1000,1000_QL80_.jpg',
    },
    {
      title: 'Blue Lock',
      image: 'https://m.media-amazon.com/images/I/51jMLFs0YBL.jpg',
    },
  ];


  constructor(
    
  ) {
    
  }

  drop(event: CdkDragDrop<{ title: string; image: string; }[]>) {
    moveItemInArray(this.mangas, event.previousIndex, event.currentIndex);
  }
}
