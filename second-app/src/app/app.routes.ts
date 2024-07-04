import { Routes } from '@angular/router';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ButtonComponent } from './components/button/button.component';
import { HeaderComponent } from './components/header/header.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AboutComponent } from './components/about/about.component';



const routes: Routes = [
    {
        path: '',
        component:TasksComponent,
        title: 'Home page'
    },
    {
        path: 'about',
        component:AboutComponent,
        title: 'About page'
    }
];

export default routes;

