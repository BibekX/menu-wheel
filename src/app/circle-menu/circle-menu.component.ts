import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { gsap } from 'gsap';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-circle-menu',
  templateUrl: './circle-menu.component.html',
  styleUrls: ['./circle-menu.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeOut', [
      transition('void => *', [
        style({ opacity: 1 }),
        animate(300, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CircleMenuComponent implements AfterViewInit {
  data = [
    { label: 'Menu 1', url: 'menu-1', selected: false, display: 'block' },
    { label: 'Menu 2', url: 'menu-2', selected: false, display: 'block' },
    { label: 'Menu 3', url: 'menu-3', selected: false, display: 'block' },
    { label: 'Menu 4', url: 'menu-4', selected: false, display: 'block' },
    { label: 'Menu 5', url: 'menu-5', selected: false, display: 'block' },
  ];
  selectedByKey = 'menu-1';
  opt = {
    key: 'url',
    pageLoader: {
      target: null,
      key: 'url',
    },
  };
  items = [];
  steps: any = null;
  lastPos: any = [];
  currentSelected = 0;
  animate = false;
  lastItemInTop = 0;
  lastItemInBottom = 0;
  display = 'block';
  cm_element: any;
  child: any;

  @ViewChild('cm_items') cm_items!: ElementRef;
  constructor() {}

  ngAfterViewInit(): void {
    const theta: number[] = [],
      steps2: { left: number; top: number }[] = [],
      positiveSteps: any[] = [];
    const widePerItem = 30;

    this.cm_element = this.cm_items.nativeElement;
    this.child = this.cm_element.children;

    const max_dat = this.data.length;
    this.data.forEach((d, i) => {
      let posX = 0,
        posY = 0;

      if (i <= Math.round((max_dat - 1) / 2)) {
        theta.push((widePerItem / 360) * i * Math.PI);

        posX = Math.round(550 / 2) * Math.cos(theta[i]);
        posY = -Math.round(550 / 2) * Math.sin(theta[i]);

        steps2.push({ left: posX, top: posY });
      } else {
        const x = i - Math.round((max_dat - 1) / 2);
        positiveSteps.push({ left: steps2[x].left, top: steps2[x].top * -1 });
      }
    });
    if (positiveSteps.length > 0) {
      this.lastItemInTop = steps2.length - 1;
      this.lastItemInBottom = steps2.length;

      this.steps = _.concat(steps2, _.reverse(positiveSteps));
    }

    const offset = _.findIndex(this.data, [this.opt.key, this.selectedByKey]);

    this.select(offset, { init: true });
  }

  itemClick(id: number) {
    this.data[id].display = 'block';
    this.select(id, { next: true });
  }

  select(offset: number, selectOpt: any) {
    const max_dat = this.data.length;

    if (offset >= 0) {
      if (!this.animate) {
        this.animate = true;

        const newPos: {
          left: any;
          top: any;
          onComplete: (i: any) => void;
          onCompleteParams: number[];
        }[] = [];
        let lastItem = null,
          lastItem_bot = null;

        const completeAnimation = (i: string | number) => {
          this.lastPos[i as number] = {
            left: newPos[i as number].left,
            top: newPos[i as number].top,
          };

          this.animate = false;
        };
        this.data.forEach((d: any, i) => {
          const pos_id = (i - offset + max_dat) % max_dat;
          if (pos_id == this.lastItemInTop) {
            lastItem = i;
          }

          if (pos_id == this.lastItemInBottom) {
            lastItem_bot = i;
          }

          if (selectOpt && selectOpt.init) {
            this.lastPos.push({
              left: this.steps[pos_id].left,
              top: this.steps[pos_id].top,
            });
          }

          newPos.push({
            left: this.steps[pos_id].left,
            top: this.steps[pos_id].top,
            onComplete: completeAnimation,
            onCompleteParams: [i],
          });

          if (offset == i) {
            this.data[i].display = 'none';
            this.data[i].selected = true;
          }
        });

        if (selectOpt && selectOpt.goto) {
          this.data.forEach((d: any, i) => {
            d.display = 'none';
          });

          this.animateList(newPos);

          setTimeout(() => {
            this.data.forEach((d: any, i) => {
              !d.classList.contains('selected') ? (d.display = 'block') : null;
            });
          }, 1000);
        } else {
          if (selectOpt && selectOpt.init) {
            this.animateList(newPos);
          } else {
            this.animateList(newPos, selectOpt, lastItem, lastItem_bot);
          }
        }

        this.currentSelected = offset;
      }
    } else {
      // this.target.style.display = 'none';
    }
  }

  animateList(
    newPos: any[],
    selectOpt?: { next: boolean; prev: boolean } | undefined,
    lastItem?: number | null | undefined,
    lastItem_bot?: number | null | undefined
  ) {
    this.data.forEach((d: any, i) => {
      if (i == lastItem && selectOpt && selectOpt.next == true) {
        this.data[i].display = 'none';

        gsap.fromTo(
          this.child[i],
          { duration: 1, ...this.lastPos[i] },
          newPos[i]
        );

        setTimeout(() => {
          this.data[i].display = 'block';
        }, 100);
      } else if (i == lastItem_bot && selectOpt && selectOpt.prev == true) {
        this.data[i].display = 'none';
        gsap.fromTo(
          this.child[i],
          { duration: 1, ...this.lastPos[i] },
          newPos[i]
        );

        setTimeout(() => {
          this.data[i].display = 'block';
        }, 100);
      } else {
        if (newPos[i]) {
          gsap.fromTo(
            this.child[i],
            { duration: 1, ...this.lastPos[i] },
            newPos[i]
          );
        }
      }
    });
  }

  prev() {
    let offset = this.currentSelected;
    const min_offset = 0,
      max_offset = this.data.length - 1;
    this.data[offset].display = 'block';
    offset = offset > min_offset ? offset - 1 : max_offset;

    this.select(offset, { prev: true });
  }

  next() {
    let offset = this.currentSelected;
    const min_offset = 0,
      max_offset = this.data.length - 1;
    this.data[offset].display = 'block';
    offset = offset < max_offset ? offset + 1 : min_offset;

    this.select(offset, { next: true });
  }
}
