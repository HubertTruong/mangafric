import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/user';
import { mangasInterface } from 'src/app/models/mangas';
import { MangasService } from 'src/app/services/mangas.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: User | null = null;
  myForm: FormGroup;

  constructor(
    public MangasService: MangasService,
  ) {

    this.MangasService.mangas.subscribe(
      (value) => {
        console.log('Received value:', value);
      },
      (error) => {
        console.error('Error:', error);
      },
      () => {
        console.log('Observable completed.');
      }
    );

    this.myForm = new FormGroup({
      title: new FormControl('', [
        Validators.required
      ]),
      image: new FormControl('', [
        Validators.required,
      ]),
      description: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  addLibrary(id: string | undefined) {
    console.log(id);
  }

  onSubmit() {
    let manga: mangasInterface = {
      title: "",
      image: "",
      description: "",
    };;

    manga.title = this.myForm.value.title;
    manga.image = this.myForm.value.image;
    manga.description = this.myForm.value.description;

    this.MangasService.addMangas(manga);

    this.clearForm();
  }

  clearForm() {
    this.myForm.reset();
    Object.keys(this.myForm.controls).forEach(key =>{
      this.myForm.controls[key].setErrors(null)
    });
  }

}
