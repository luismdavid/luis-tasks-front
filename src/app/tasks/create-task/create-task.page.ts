import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, delay, switchMap } from 'rxjs/operators';
import { TaskModel } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();
  loading: boolean = false;
  addingTag = false;
  currentTask: TaskModel;
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tasksService: TaskService,
    private activeRoute: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: new FormControl(''),
      content: new FormControl(''),
      pinned: new FormControl(false),
      order: new FormControl(1),
      color: new FormControl(),
      tags: new FormControl([])
    });

    this.subs.add(
      this.activeRoute.params.subscribe(params => {
        const id = params.id;
  
        if (id) {
          this.loading = true;
          this.subCurrentTask(id);
        } else {
          this.subFormChanges();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  subFormChanges() {
    this.subs.add(
      this.form.valueChanges.pipe(
        debounceTime(1500),
        switchMap((value) => this.tasksService.createOrUpdate({ ...this.currentTask, ...value}).pipe(
          catchError(error => of(this.toast.show(error.message)))
        ))
      ).subscribe()
    );
  }

  subCurrentTask(id: string) {
    this.subs.add(
      this.tasksService.searchTask(id).subscribe(task => {
        this.currentTask = task;
        this.loading = false;
        this.form.reset(task);
        this.subFormChanges();
      })
    );
  }

  pinTask() {
    this.form.get('pinned').setValue(!this.form.value.pinned);
  }

  addTag(newTag: string) {
    this.addingTag = false;
    if (this.currentTask)  {
      this.currentTask.tags = [...this.currentTask?.tags, newTag];
    }
    this.form.get('tags').setValue([...this.form.value.tags, newTag]);
  }

  closeModal() {
    this.router.navigate(['/home']);
  }
}
