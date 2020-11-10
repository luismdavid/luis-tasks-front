import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TaskModel } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  createOrUpdate(task: TaskModel) {
    return this.http.put<TaskModel>(environment.API + '/tasks', task);
  }

  searchTask(id: string) {
    return this.http.get<TaskModel>(environment.API + '/tasks/getTaskById/' + id);
  }

  searchCurrentUserTasks() {
    return this.auth.subUser().pipe(
      filter(user => !!user),
      switchMap(user => {
        console.log(user);
        return this.http.get<TaskModel[]>(environment.API + '/tasks?userId=' + user._id)
      }),
      first()
    );
  }

}
