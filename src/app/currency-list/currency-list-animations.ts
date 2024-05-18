import { trigger, state, style, transition, animate } from '@angular/animations';

export const showDropdown = trigger('showDropdown', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateY(-20px)'
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),
  transition('hidden => visible', [
    animate('0.3s ease-in')
  ]),
  transition('visible => hidden', [
    animate('0.3s ease-out')
  ])
]);

export const showItem = trigger('showItem', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateX(-20px)'
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  transition('hidden => visible', [
    animate('0.3s ease-in')
  ]),
  transition('visible => hidden', [
    animate('0.3s ease-out')
  ])
]);

export const switchToggle = trigger('switchToggle', [
  state('api', style({
    transform: 'translateX(140px)'
  })),
  state('mock', style({
    transform: 'translateX(0)'
  })),
  transition('api <=> mock', [
    animate('0.4s ease-in-out')
  ])
]);
