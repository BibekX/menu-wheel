import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}

// import { Component, OnInit } from '@angular/core';
// import * as _ from 'lodash';
// import { gsap } from 'gsap';

// interface MenuItem {
//   label: string;
//   url: string;
// }

// interface CircleMenuOptions {
//   key: string;
//   pageLoader: {
//     target: any;
//     key: string;
//   };
// }

// interface CircleMenuFunc {
//   onInit?: (currentSelected: number) => void;
//   onChangeBegin?: () => void;
//   onChangeComplete?: (data: MenuItem) => void;
//   onLoadPageComplete?: () => void;
// }

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss'],
// })
// export class AppComponent implements OnInit {
//   data: MenuItem[] = [
//     {
//       label: 'Menu 0',
//       url: 'menu 0',
//     },
//     {
//       label: 'Menu 1',
//       url: 'menu 1',
//     },
//   ];
//   items: any[] = [];
//   steps: any = null;
//   lastPos: any[] = [];
//   currentSelected = 0;
//   animate = false;

//   lastItemInTop: any = null;
//   lastItemInBottom: any = null;

//   onInit: ((currentSelected: number) => void) | undefined;
//   onChangeBegin: (() => void) | undefined;
//   onChangeComplete: ((data: MenuItem) => void) | undefined;
//   onLoadPageComplete: (() => void) | undefined;

//   constructor() {}

//   ngOnInit(): void {
//     for (let i = 0; i <= 5; i++) {
//       this.data.push({
//         label: `Menu ${i}`,
//         url: `menu-${i}`,
//       });
//     }

//     const SELECTED = 'menu-0';

//     const OPTIONS = {
//       key: 'url',
//       pageLoader: {
//         target: null,
//         key: 'url',
//       },
//     };

//     const FUNC: CircleMenuFunc = {
//       onInit: (currentSelected: number) => {
//         console.log('INIT');
//       },
//       onChangeBegin: () => {
//         console.log('CHANGE');
//       },
//       onChangeComplete: (data: MenuItem) => {
//         console.log('CHANGE_COMPLETE');
//         console.log(data);
//       },
//     };

//     this.createSteps();
//     this.createItems(SELECTED, OPTIONS);
//     this.onInit ? this.onInit(this.currentSelected) : null;
//   }

//   createItems(selectedByKey: string, opt: any) {
//     const cm_items = document.querySelector('.cm-items');
//     const cartRow = document.createElement('div');
//     const offset = _.findIndex(this.data, [opt.key, 'menu-0']);

//     _.forEach(this.data, (d, i) => {
//       cartRow.innerHTML = `<li id="item-${i}" class="cm-item"><a href="${d.url}" title="${d.label}">${d.label}</a></li>`;
//       cm_items?.append(cartRow);
//       this.items.push(document.querySelector(`#item-${i}`));
//     });

//     this.select(offset, { init: true });
//   }

//   createSteps() {
//     const theta: number[] = [];
//     const steps: { left: number; top: number }[] = [];
//     const positiveSteps: any[] = [];
//     const widePerItem = 30;

//     const max_dat = this.data.length;

//     _.forEach(this.data, (d, i) => {
//       let posX = 0;
//       let posY = 0;

//       if (i <= Math.round((max_dat - 1) / 2)) {
//         theta.push((widePerItem / 360) * i * Math.PI);

//         posX = Math.round((550 / 2) * Math.cos(theta[i]));
//         posY = -Math.round((550 / 2) * Math.sin(theta[i]));

//         steps.push({ left: posX, top: posY });
//       } else {
//         const x = i - Math.round((max_dat - 1) / 2);
//         positiveSteps.push({ left: steps[x].left, top: steps[x].top * -1 });
//         // positiveSteps.push({ top: steps[x].top * -1 });
//       }
//     });

//     if (positiveSteps.length > 0) {
//       this.lastItemInTop = steps.length - 1;
//       this.lastItemInBottom = steps.length;

//       this.steps = _.concat(steps, _.reverse(positiveSteps));
//     }
//   }

//   next() {
//     let offset = this.currentSelected;
//     const min_offset = 0;
//     const max_offset = this.data.length - 1;

//     offset = offset < max_offset ? offset + 1 : min_offset;

//     this.select(offset, { next: true });
//   }

//   prev() {
//     let offset = this.currentSelected;
//     const min_offset = 0;
//     const max_offset = this.data.length - 1;

//     offset = offset > min_offset ? offset - 1 : max_offset;

//     this.select(offset, { prev: true });
//   }

//   goto(targetSelected: string) {
//     const offset = _.findIndex(this.data, ['url', targetSelected]);

//     this.select(offset, { goto: true });
//   }

//   select(offset: number, selectOpt: any) {
//     const max_dat = this.data.length;
//     const cm_label = document.querySelector('.cm-selected-label');

//     if (offset >= 0) {
//       if (!this.animate) {
//         this.animate = true;

//         const newPos: any[] = [];
//         let lastItem = null;
//         let lastItem_bot = null;

//         this.onChangeBegin ? this.onChangeBegin() : null;

//         const completeAnimation = (i: number) => {
//           if (cm_label && cm_label.querySelector('span')) {
//             cm_label.querySelector('span')?.classList.remove('fadeIn');
//           }
//           cm_label?.querySelector('span')?.classList.add('fadeIn');
//           this.lastPos[i] = {
//             left: newPos[i].left,
//             top: newPos[i].top,
//           };

//           if (i === offset) {
//             this.onChangeComplete ? this.onChangeComplete(this.data[i]) : null;
//           }

//           this.animate = false;
//         };

//         cm_label?.querySelector('span')?.classList.remove('fadeIn');

//         _.forEach(this.items, (d, i) => {
//           d.style.display = 'block';
//           d.classList.remove('selected');

//           const pos_id = (i - offset + max_dat) % max_dat;

//           if (pos_id === this.lastItemInTop) {
//             lastItem = i;
//           }

//           if (pos_id === this.lastItemInBottom) {
//             lastItem_bot = i;
//           }

//           if (selectOpt && selectOpt.init) {
//             this.lastPos.push({
//               left: this.steps[pos_id].left,
//               top: this.steps[pos_id].top,
//             });
//           }

//           newPos.push({
//             left: this.steps[pos_id].left,
//             top: this.steps[pos_id].top,
//             onComplete: completeAnimation,
//             onCompleteParams: [i],
//           });

//           if (offset === i) {
//             d.style.display = 'none';
//             d.classList.add('selected');
//           }
//         });

//         if (selectOpt && selectOpt.goto) {
//           _.forEach(this.items, (d, i) => {
//             d.style.display = 'none';
//           });

//           this.animateList(newPos);

//           setTimeout(() => {
//             _.forEach(this.items, (d, i) => {
//               !d.classList.contains('selected')
//                 ? (d.style.display = 'block')
//                 : null;
//             });
//           }, 1000);
//         } else {
//           if (selectOpt && selectOpt.init) {
//             this.animateList(newPos);
//           } else {
//             this.animateList(newPos, selectOpt, lastItem, lastItem_bot);
//           }
//         }

//         this.currentSelected = offset;
//       }
//     } else {
//     }
//   }

//   animateList(
//     newPos: any[],
//     selectOpt?: any,
//     lastItem?: any,
//     lastItem_bot?: any
//   ) {
//     _.forEach(this.items, (d, i) => {
//       if (i === lastItem && selectOpt && selectOpt.next === true) {
//         // perform next animation only for last in top section
//         d.style.display = 'none';
//         gsap.fromTo(d, 1, this.lastPos[i], newPos[i]);

//         setTimeout(() => {
//           d.style.display = 'block';
//         }, 800);
//       } else if (i === lastItem_bot && selectOpt && selectOpt.prev === true) {
//         // perform previous animation only for last in bottom section
//         d.style.display = 'none';
//         gsap.fromTo(d, 1, this.lastPos[i], newPos[i]);

//         setTimeout(() => {
//           d.style.display = 'block';
//         }, 800);
//       } else {
//         // perform next-previous animation for all items
//         gsap.fromTo(d, 1, this.lastPos[i], newPos[i]);
//       }
//     });
//   }
// }
