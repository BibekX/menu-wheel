import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { gsap } from 'gsap';

@Component({
  selector: 'app-circle-menu',
  templateUrl: './circle-menu.component.html',
  styleUrls: ['./circle-menu.component.css'],
})
export class CircleMenuComponent implements AfterViewInit {
  data = [
    { label: 'Menu 1', url: 'menu-1' },
    { label: 'Menu 2', url: 'menu-2' },
    { label: 'Menu 3', url: 'menu-3' },
    { label: 'Menu 4', url: 'menu-4' },
    { label: 'Menu 5', url: 'menu-5' },
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

  @ViewChild('cm_items') cm_items!: ElementRef;
  constructor() {}

  ngAfterViewInit(): void {
    const theta: number[] = [],
      steps2: { left: number; top: number }[] = [],
      positiveSteps: any[] = [];
    const widePerItem = 30;

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
    // console.log('cm_items', this.cm_items.nativeElement);
    // this.data.forEach((d, i) => {
    // this.items.push(cm_items.querySelector(`#item-${i}`));
    // });

    this.select(offset, { init: true });

    this.items.forEach((d, i) => {
      // d.querySelector('a').addEventListener(
      //   'click',
      //   (event: {
      //     preventDefault: () => void;
      //     target: { getAttribute: (arg0: string) => any };
      //   }) => {
      //     event.preventDefault();
      //     const url = event.target.getAttribute('href');
      // const offset = _.findIndex(this.data, [this.opt.key, url]);
      // this.select(offset, { goto: true });
      //   }
      // );
    });
  }

  itemClick(event: any) {
    console.log('event', event.target.value);
    // const offset = _.findIndex(this.data, [this.opt.key, url]);
    // this.select(offset, { goto: true });

    // const url = event.target.getAttribute('href');
    // const offset = _.findIndex(this.data, [this.opt.key, url]);
    // this.select(offset, { goto: true });
  }

  select(offset: number, selectOpt: any) {
    const max_dat = this.data.length;
    // const cm_label = this.target.querySelector('.cm-selected-label');

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
          // cm_label.querySelector('span').textContent = this.data[offset].label;
          // cm_label.querySelector('span').style.display = 'block';
          console.log('newPos', newPos);
          this.lastPos[i as number] = {
            left: newPos[i as number].left,
            top: newPos[i as number].top,
          };

          this.animate = false;
        };

        // cm_label.querySelector('span').style.display = 'none';
        this.items.forEach((d: any, i) => {
          // d.style.display = 'block';
          // d.classList.remove('selected');

          const pos_id = (i - offset + max_dat) % max_dat;
          console.log('id', pos_id);
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
            d.style.display = 'none';
            d.classList.add('selected');
          }
        });

        if (selectOpt && selectOpt.goto) {
          this.items.forEach((d: any, i) => {
            d.style.display = 'none';
          });

          this.animateList(newPos);

          setTimeout(() => {
            this.items.forEach((d: any, i) => {
              !d.classList.contains('selected')
                ? (d.style.display = 'block')
                : null;
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
    this.items.forEach((d: any, i) => {
      console.log('d', d);
      if (i == lastItem && selectOpt && selectOpt.next == true) {
        d.style.display = 'none';
        gsap.fromTo(d, 1, this.lastPos[i], newPos[i]);

        setTimeout(() => {
          d.style.display = 'block';
        }, 800);
      } else if (i == lastItem_bot && selectOpt && selectOpt.prev == true) {
        d.style.display = 'none';
        gsap.fromTo(d, 1, this.lastPos[i], newPos[i]);

        setTimeout(() => {
          d.style.display = 'block';
        }, 800);
      } else {
        gsap.fromTo(d, 1, this.lastPos[i], newPos[i]);
      }
    });
  }

  prev() {
    let offset = this.currentSelected;
    const min_offset = 0,
      max_offset = this.data.length - 1;

    offset = offset > min_offset ? offset - 1 : max_offset;

    this.select(offset, { prev: true });
  }

  next() {
    let offset = this.currentSelected;
    const min_offset = 0,
      max_offset = this.data.length - 1;

    offset = offset < max_offset ? offset + 1 : min_offset;

    this.select(offset, { next: true });
  }
}
