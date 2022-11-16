import { Component, OnInit } from '@angular/core';
import { IpcService } from './services/ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ScanPII';

  constructor(private ipcService: IpcService) {}
  ngOnInit() {
    console.log('OK');
  }
  list(): void {
    this.ipcService.send('fetch');
    this.ipcService.on('publish', (e: any, args: any) => {
      console.log(args);
    });
  }
}
