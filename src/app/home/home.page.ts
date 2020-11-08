import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { CreateTaskPage } from '../tasks/create-task/create-task.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loading: boolean = false;
  tasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];

  constructor(public router: Router, private tasksService: TaskService) {}

  ngOnInit() {}

  search(event) {
    const value = event.target.value.toLowerCase();
    if (!value) {
      this.filteredTasks = [];
    } else {
      this.filteredTasks = this.tasks.filter(
        (x) =>
          x.title.toLowerCase().includes(value) ||
          x.content.toLowerCase().includes(value) ||
          x.tags.join(' ').toLowerCase().includes(value)
      );
    }
  }

  reorder(event) {
    const aux = this.tasks[event.previousIndex];
    if (event.currentIndex > event.previousIndex) {
      for (let i = event.previousIndex + 1; i <= event.currentIndex; i++) {
        this.tasks[i - 1] = this.tasks[i];
      }
    } else {
      for (let i = event.previousIndex - 1; i >= event.currentIndex; i--) {
        this.tasks[i + 1] = this.tasks[i];
      }
    }
    this.tasks[event.currentIndex] = aux;
    console.log(event);
  }

  ionViewDidEnter() {
    this.getTasks();
  }

  getTasks() {
    this.loading = true;
    this.tasksService.searchCurrentUserTasks().subscribe(
      (tasks) => {
        this.loading = false;
        this.tasks = tasks.sort((a, b) =>
          a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
        );
      },
      (error) => (this.loading = false)
    );
  }

  openCreateTask() {
    this.router.navigate(['/task/create']);
  }

  openTask(id: string) {
    this.router.navigate(['/task/' + id]);
  }
}
