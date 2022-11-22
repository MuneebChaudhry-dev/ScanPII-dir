import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IpcService } from './services/ipc.service';

@Component({
  selector: 'app-root',
  template: `<ejs-treeview id="treeelement" [fields]="field"></ejs-treeview>`,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'ScanPII';
  public tree: Object[] = [];
  public field: Object = [];

  constructor(private ipcService: IpcService) {}
  // ngOnInit() {
  //   console.log('OK');
  // }

  ngOnInit(): void {
    this.ipcService.send('fetch');
    this.ipcService.on('publish', (e: any, args: any) => {
      console.log(args);
      this.tree = JSON.parse(args);
      console.log(this.tree);
      this.field = {
        dataSource: this.tree,
        id: 'id',
        text: 'name',
        child: 'children',
      };
    });
  }
}
