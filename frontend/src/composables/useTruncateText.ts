import { computed } from 'vue';

export function useTruncateText(text: string, maxLength: number) {
  const truncatedText = computed(() => {
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  });

  const isTruncated = computed(() => {
    return text.length > maxLength;
  });

  return {
    truncatedText,
    isTruncated
  };
}
