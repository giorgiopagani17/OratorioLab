import type { Directive } from 'vue';

const trim: Directive = {
  mounted(el: HTMLElement) {
    const inputElement = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
      ? el
      : el.querySelector('input') || el.querySelector('textarea');

    if (!inputElement) {
      console.warn('v-trim directive requires an input or textarea element');
      return;
    }

    inputElement.addEventListener('blur', () => {
      const input = inputElement as HTMLInputElement | HTMLTextAreaElement;

      if (input.value !== undefined) {
        const trimmedValue = input.value.trim();

        if (trimmedValue !== input.value) {
          input.value = trimmedValue;

          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });
  }
};

export default trim;
