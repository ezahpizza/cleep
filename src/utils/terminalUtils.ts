import { InputMode } from '@/types/terminal';

export const getInputPlaceholder = (inputMode: InputMode): string => {
  if (inputMode.type === 'auth') {
    if (inputMode.step === 'email') return 'Enter email...';
    if (inputMode.step === 'password') return 'Enter password...';
  } else if (inputMode.type === 'create') {
    if (inputMode.step === 'tag') return 'Enter tag...';
    if (inputMode.step === 'content') return 'Enter content...';
  } else if (inputMode.type === 'modify') {
    return 'Edit content...';
  }
  return 'Type command...';
};

export const getInputType = (inputMode: InputMode): string => {
  return inputMode.type === 'auth' && inputMode.step === 'password' ? 'password' : 'text';
};

export const getDisplayValue = (input: string, inputMode: InputMode): string => {
  if (inputMode.type === 'auth' && inputMode.step === 'password') {
    return '*'.repeat(input.length);
  }
  return input;
};
