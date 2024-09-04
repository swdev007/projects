import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
    @Input() height: string='100%';
    @Input() width: string='100%';
    @Input() radius: string='6px';
    @Input() margin: string='0';
    @Input() type!: | 'circle' | 'bar';
  constructor() { }

  ngOnInit(): void {
  }

}
