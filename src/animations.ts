import {
  trigger,
  transition,
  state,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    // each time the binding value changes
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger(100, [animate('0.5s', style({ opacity: 1 }))]),
      ],
      { optional: true },
    ),
  ]),
]);

export const cardAnimation = trigger('cardAnimation', [
  state(
    'void',
    style({
      height: '0px',
    }),
  ),
  transition(':enter', [
    animate(
      '0.6s 70ms cubic-bezier(0.87, 0, 0.13, 1)',
      style({
        height: '*',
      }),
    ),
  ]),
  transition(':leave', [
    animate(
      '0.6s cubic-bezier(0.87, 0, 0.13, 1)',
      style({
        height: '0px',
      }),
    ),
  ]),
]);
